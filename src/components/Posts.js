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
        <div>
          <img
            src={featuredImage && featuredImage.node.sourceUrl}
            alt={featuredImage && featuredImage.node.altText}
          />
        </div>
        <div>{ReactHtmlParser(excerpt)}</div>
      </div>
    )
  );
};
const Posts = ({ onActivePage }) => {
  const [search, setSearch] = useState("");
  const postsQuery = useLazyQuery(POSTS_QUERY);
  const { data: stickeyPostData, loading: sLoading, error: sError } = useQuery(
    STICKY_POSTS_QUERY
  );
  const [, { fetchMore }] = postsQuery;
  const { loading, data, error, postsPerPage } = usePostQuery({
    query: postsQuery,
    search
  });

  useEffect(() => {
    onActivePage("posts");
    return () => onActivePage("");
  }, []);
  if (loading || sLoading) return <Loading />;
  if (error || sError) return <p>Something wrong happened inside!</p>;
  const { stickyPosts } = stickeyPostData;
  const { posts } = data;
  const { nodes } = posts;
  const stickeyPostIds = stickyPosts.nodes.map(({ databaseId }) => databaseId);

  return (
    <div className="posts">
      <Search onSearch={val => setSearch(val)} />

      <h3>feature section</h3>
      {!posts.pageInfo.hasPreviousPage && (
        <FeaturedSection stickyPosts={stickyPosts} />
      )}
      <h3>posts</h3>
      {nodes
        .filter(({ databaseId }) => !stickeyPostIds.includes(databaseId))
        .map(({ databaseId, title, slug }) => (
          <div className="post" key={databaseId}>
            <h3>
              <Link to={`/${slug}/`}>{ReactHtmlParser(title)}</Link>
            </h3>
          </div>
        ))}
      <Pagination
        fetchMore={fetchMore}
        posts={posts}
        updateQuery={updateQuery}
        postsPerPage={postsPerPage}
      />
    </div>
  );
};

export default Posts;

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
