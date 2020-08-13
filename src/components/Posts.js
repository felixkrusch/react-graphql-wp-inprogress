import React from "react";
import { useLazyQuery, useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import { Link } from "react-router-dom";
import ReactHtmlParser from "react-html-parser";
import { usePostQuery } from "./usePostQuery";
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
  query GET_POSTS($first: Int, $last: Int, $after: String, $before: String) {
    posts(first: $first, last: $last, after: $after, before: $before) {
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
        <button
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
        </button>
      )}
      {posts.pageInfo.hasNextPage && (
        <button
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
        </button>
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
        <div>{excerpt}</div>
      </div>
    )
  );
};
const Posts = () => {
  const postsQuery = useLazyQuery(POSTS_QUERY);
  const { data: stickeyPostData, loading: sLoading, error: sError } = useQuery(
    STICKY_POSTS_QUERY
  );
  const [, { fetchMore }] = postsQuery;
  const { loading, data, error, postsPerPage } = usePostQuery({
    query: postsQuery
  });
  if (loading || sLoading) return <p>Loading Posts...</p>;
  if (error || sError) return <p>Something wrong happened inside!</p>;
  const { stickyPosts } = stickeyPostData;
  const { posts } = data;
  const { nodes } = posts;
  const stickeyPostIds = stickyPosts.nodes.map(({ databaseId }) => databaseId);
  return (
    <div>
      <Pagination
        fetchMore={fetchMore}
        posts={posts}
        updateQuery={updateQuery}
        postsPerPage={postsPerPage}
      />
      {!posts.pageInfo.hasPreviousPage && (
        <FeaturedSection stickyPosts={stickyPosts} />
      )}
      {nodes
        .filter(({ databaseId }) => !stickeyPostIds.includes(databaseId))
        .map(({ databaseId, title, slug }) => (
          <div key={databaseId}>
            <h3>
              <Link to={`/${slug}/`}>{ReactHtmlParser(title)}</Link>
            </h3>
          </div>
        ))}
    </div>
  );
};

export default Posts;
