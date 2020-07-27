import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import ReactHtmlParser from "react-html-parser";

//post query updated 
const POST_QUERY = gql`
  query Post($id: ID!) {
    post(id: $id, idType: SLUG) {
      title(format: RENDERED)
      content(format: RENDERED)
    }
  }
`;

const Post = () => {
  const { slug } = useParams();
  const { loading, error, data } = useQuery(POST_QUERY, {
    variables: { id: slug }
  });
  if (loading) return <p>Loading Post Content...</p>;
  if (error) return <p>Something wrong happened!</p>;
  const post = data.post;
  return (
    <div>
      <h3>{post && post.title}</h3> 
      <div>{ReactHtmlParser(post && post.content)}</div>
    </div>
  );
};

export default Post;
