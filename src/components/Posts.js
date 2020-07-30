import React from "react";
import { useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import { Link } from "react-router-dom";

const POSTS_QUERY = gql`
  {
    posts {
      nodes {
        postId
        title(format: RENDERED)
        slug
      }
    }
  }
`;

const Posts = () => {
  const { loading, error, data } = useQuery(POSTS_QUERY);
  if (loading) return <p>Loading Posts...</p>;
  if (error) return <p>Something wrong happened inside!</p>;

  // destructuring data
  const {
    posts: { nodes }
  } = data;
  return nodes.map(({ postId, title, slug }) => (
    <div key={postId}>
      <h3>
        <Link to={`/${slug}/`}>{title}</Link>
      </h3>
    </div>
  ));
};

export default Posts;
