import React, { useState, useEffect } from "react";
import { gql, useLazyQuery, useQuery } from "@apollo/client";
import { Link, useLocation } from "react-router-dom";
import ReactHtmlParser from "react-html-parser";
import { usePostQuery } from "./usePostQuery";
import Loading from "./Loading/Loading";
import { Input, Button } from "@material-ui/core";
import queryString from "query-string";

export const STICKY_POSTS_QUERY = gql`
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
export const STATIC_PAGE = gql`
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
      content(format: RENDERED)
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

export const POSTS_QUERY = gql`
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
        date
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
export const updateQuery = (previousResult, { fetchMoreResult }) => {
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
export const FeaturedSection = ({ stickyPosts }) => {
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
  const location = useLocation();
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
  // const { data: stickeyPostData, loading: sLoading, error: sError } = useQuery(
  //   STICKY_POSTS_QUERY
  // );
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
    if (!parseInt(staticfrontpageid)) {
      setIsFetch(true);
    }
    if (parseInt(staticfrontpageid)) {
      frontPageQuery({
        variables: {
          id: staticfrontpageid
        }
      });
    } else if (parseInt(postspageid)) {
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
  useEffect(() => {
    const parsed = queryString.parse(location.search);
    if (parsed.search) {
      setSearch(parsed.search);
      setIsFetch(true);
    }
  }, [location]);
  if (isLoading) return <Loading />;
  if (error || isError) return <p>Something wrong happened inside!</p>;
  // const { stickyPosts } = stickeyPostData;
  const posts = data?.posts || {};
  return (
    <div className="posts">
      <Search
        onSearch={val => {
          setSearch(val);
          setIsFetch(true);
        }}
        search={search}
      />
      {loading && <Loading />}

      {posts.nodes && (
        <>
          <h3>Search Result</h3>
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
      {/* {posts.pageInfo && (
        <>
          <h3>feature section</h3>
          {!posts?.pageInfo?.hasPreviousPage && (
            <FeaturedSection stickyPosts={stickyPosts} />
          )}
        </>
      )} */}
    </div>
  );
};

export default Posts;
export const Post = ({
  post: { databaseId, title, slug, featuredImage, excerpt, content, date }
}) => {
  return (
    <div className="post" key={databaseId}>
      <h3>
        <Link to={`/${slug}/`}>{ReactHtmlParser(title)}</Link>
      </h3>
      <div>{date}</div>
      {featuredImage && (
        <div>
          <img
            src={featuredImage.node.sourceUrl}
            alt={featuredImage.node.altText}
          />
        </div>
      )}
      <div>{ReactHtmlParser(content ? content : excerpt)}</div>
    </div>
  );
};
const Search = ({ onSearch, search: value }) => {
  const [search, setSearch] = useState("");
  useEffect(() => {
    setSearch(value);
  }, [value]);
  return (
    <div>
      <Input
        value={search}
        onChange={({ target }) => setSearch(target.value)}
        onKeyDown={e => e.key === "Enter" && onSearch(search)}
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
