import React from "react";
import { useLazyQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import { Link } from "react-router-dom";
import ReactHtmlParser from "react-html-parser";
import { usePostQuery } from "./usePostQuery";

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
const Posts = () => {
  const postsQuery = useLazyQuery(POSTS_QUERY);
  const [, { fetchMore }] = postsQuery;
  const { loading, data, error, postsPerPage } = usePostQuery({
    query: postsQuery
  });
  if (loading) return <p>Loading Posts...</p>;
  if (error) return <p>Something wrong happened inside!</p>;
  // destructuring data
  const { posts } = data;
  const { nodes } = posts;
  return (
    <div>
      <Pagination
        fetchMore={fetchMore}
        posts={posts}
        updateQuery={updateQuery}
        postsPerPage={postsPerPage}
      />
      {nodes.map(({ databaseId, title, slug }) => (
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
