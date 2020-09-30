import React, { useState, useEffect } from "react";
import { gql, useLazyQuery, useQuery } from "@apollo/client";
import { Link } from "react-router-dom";
import ReactHtmlParser from "react-html-parser";
import { usePostQuery } from "./usePostQuery";
import Loading from "./Loading/Loading";
import { Input, Button } from "@material-ui/core";

const STICKY_POSTS_QUERY = gql`
  query stickyPosts {
    stickyPosts: posts(where: { onlySticky: true }) {
      nodes {
        databaseId
        title(format: RENDERED)
        slug
        link
        excerpt
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
      }
    }
  }
`;
const STATIC_PAGE = gql`
  query staticPage {
    getCustomizations {
      postspageid
      staticfrontpageid
    }
  }
`;

const POST_QUERY = gql`
  query Page($id: ID!) {
    post(id: $id, idType: DATABASE_ID) {
      databaseId
      title(format: RENDERED)
      # content(format: RENDERED)
      excerpt
      link
      slug
      featuredImage {
        node {
          sourceUrl
        }
      }
    }
  }
`;

const POSTS_QUERY = gql`
  query GET_POSTS(
    $first: Int
    $last: Int
    $after: String
    $before: String
    $search: String
  ) {
    posts(
      first: $first
      last: $last
      after: $after
      before: $before
      where: { search: $search }
    ) {
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }

      nodes {
        databaseId
        title(format: RENDERED)
        slug

        link
        excerpt
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
      }
    }
  }
`;
const updateQuery = (previousResult, { fetchMoreResult }) => {
  return fetchMoreResult.posts.nodes.length ? fetchMoreResult : previousResult;
};
export const Pagination = ({ posts, fetchMore, updateQuery, postsPerPage }) => {
  return (
    <div>
      {posts.pageInfo.hasPreviousPage && (
        <Button
          color="primary"
          variant="contained"
          onClick={() => {
            fetchMore({
              variables: {
                first: null,
                after: null,
                last: postsPerPage,
                before: posts.pageInfo.startCursor || null
              },
              updateQuery
            });
          }}
        >
          Previous
        </Button>
      )}
      &nbsp;
      {posts.pageInfo.hasNextPage && (
        <Button
          color="primary"
          variant="contained"
          onClick={() => {
            fetchMore({
              variables: {
                first: postsPerPage,
                after: posts.pageInfo.endCursor || null,
                last: null,
                before: null
              },
              updateQuery
            });
          }}
        >
          Next
        </Button>
      )}
    </div>
  );
};
const FeaturedSection = ({ stickyPosts }) => {
  return stickyPosts.nodes.map(
    ({ databaseId, title, slug, featuredImage, excerpt }) => (
      <div key={databaseId}>
        <h3>
          <Link to={`/${slug}/`}>{ReactHtmlParser(title)}</Link>
        </h3>
        {featuredImage && (
          <div>
            <img
              src={featuredImage.node.sourceUrl}
              alt={featuredImage.node.altText}
            />
          </div>
        )}
        <div>{ReactHtmlParser(excerpt)}</div>
      </div>
    )
  );
};
const Posts = ({ onActivePage }) => {
  const [search, setSearch] = useState("");
  const [isFetch, setIsFetch] = useState(false);
  const postsQuery = useLazyQuery(POSTS_QUERY);

  const [
    postQuery,
    { loading: pLoading, error: pError, data: postData }
  ] = useLazyQuery(POST_QUERY);

  const [
    frontPageQuery,
    { loading: fpLoading, error: fpError, data: frontPageData }
  ] = useLazyQuery(POST_QUERY);

  const { loading: isLoading, error: isError, data: staticPageData } = useQuery(
    STATIC_PAGE
  );
  const { data: stickeyPostData, loading: sLoading, error: sError } = useQuery(
    STICKY_POSTS_QUERY
  );
  const [, { fetchMore }] = postsQuery;
  const { loading, data, error, postsPerPage } = usePostQuery({
    query: postsQuery,
    search,
    isFetch
  });
  useEffect(() => {
    if (!staticPageData) return;
    const {
      getCustomizations: { postspageid, staticfrontpageid }
    } = staticPageData;
    if (!parseInt(staticfrontpageid) || !parseInt(postspageid)) {
      setIsFetch(true);
    }
    if (parseInt(staticfrontpageid)) {
      frontPageQuery({
        variables: {
          id: staticfrontpageid
        }
      });
    }
    if (parseInt(postspageid)) {
      postQuery({
        variables: {
          id: postspageid
        }
      });
    }
  }, [staticPageData]);
  useEffect(() => {
    onActivePage("posts");
    return () => onActivePage("");
  }, []);
  if (sLoading) return <Loading />;
  if (error || sError) return <p>Something wrong happened inside!</p>;
  const { stickyPosts } = stickeyPostData;
  const posts = data?.posts || {};
  return (
    <div className="posts">
      <Search onSearch={val => setSearch(val)} />
      <h3>feature section</h3>
      {!posts?.pageInfo?.hasPreviousPage && (
        <FeaturedSection stickyPosts={stickyPosts} />
      )}
      {frontPageData && (
        <div>
          <h3>Home page</h3>
          <Post post={frontPageData.post} />
        </div>
      )}
      {postData && (
        <div>
          <h3>Post page</h3>
          <Post post={postData.post} />
        </div>
      )}
      {posts.nodes && (
        <>
          <h3>Postlist</h3>
          {posts.nodes?.map(post => (
            <Post key={post.databaseId} post={post} />
          ))}
        </>
      )}
      {posts.nodes && (
        <Pagination
          fetchMore={fetchMore}
          posts={posts}
          updateQuery={updateQuery}
          postsPerPage={postsPerPage}
        />
      )}
    </div>
  );
};

export default Posts;
const Post = ({
  post: { databaseId, title, slug, featuredImage, excerpt }
}) => {
  return (
    <div className="post" key={databaseId}>
      <h3>
        <Link to={`/${slug}/`}>{ReactHtmlParser(title)}</Link>
      </h3>
      {featuredImage && (
        <div>
          <img
            src={featuredImage.node.sourceUrl}
            alt={featuredImage.node.altText}
          />
        </div>
      )}
      <div>{ReactHtmlParser(excerpt)}</div>
    </div>
  );
};
const Search = ({ onSearch }) => {
  const [search, setSearch] = useState("");
  return (
    <div>
      <Input
        value={search}
        onChange={({ target }) => setSearch(target.value)}
      />
      &nbsp;
      <Button
        variant="contained"
        color="default"
        onClick={() => onSearch(search)}
      >
        Search
      </Button>
    </div>
  );
};
