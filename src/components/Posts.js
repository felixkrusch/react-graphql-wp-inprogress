import React from "react";
import { useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import { Link } from "react-router-dom";
import ReactHtmlParser from "react-html-parser";

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
        postId
        title(format: RENDERED)
        slug
      }
    }
  }
`;
const updateQuery = (previousResult, { fetchMoreResult }) => {
  return fetchMoreResult.posts.nodes.length ? fetchMoreResult : previousResult;
};
export const Pagination = ({ posts, fetchMore, updateQuery, variables }) => {
  return (
    <div>
      {posts.pageInfo.hasPreviousPage && (
        <button
          onClick={() => {
            fetchMore({
              variables: {
                first: null,
                after: null,
                last: 10,
                before: posts.pageInfo.startCursor || null,
                ...variables
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
                first: 10,
                after: posts.pageInfo.endCursor || null,
                last: null,
                before: null,
                ...variables
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
  const variables = {
    first: 10,
    last: null,
    after: null,
    before: null
  };
  const { loading, error, data, fetchMore } = useQuery(POSTS_QUERY, {
    variables
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
      />
      {nodes.map(({ postId, title, slug }) => (
        <div key={postId}>
          <h3>
            <Link to={`/${slug}/`}>{ReactHtmlParser(title)}</Link>
          </h3>
        </div>
      ))}
    </div>
  );
};

export default Posts;
