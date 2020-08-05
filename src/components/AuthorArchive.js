import React from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import ReactHtmlParser from "react-html-parser";
import Comments from "./Comments";
import { node } from "prop-types";
import Posts from "./Posts";

//post query updated
const AUTHOR_QUERY = gql`
  query Author($authorName: String) {
    posts(where: { authorName: $authorName }) {
      nodes {
        id
        excerpt
        title
        date
        slug
      }
    }
  }
`;

const AuthorArchive = () => {
  const { slug } = useParams();
  const { loading, error, data } = useQuery(AUTHOR_QUERY, {
    variables: { authorName: slug }
  });
  if (loading) return <p>Loading Author Content...</p>;
  if (error) return <p>Something wrong happened!</p>;
  const posts = data.posts;
  return (
    <ul>
      {posts.nodes.map(post => (
        <li key={post.id}>
          <h3>{post.title}</h3>
          <div>{post.date}</div>
          <div>{ReactHtmlParser(post.excerpt)}</div>
          {/* <div>{post.slug}</div> */}
        </li>
      ))}
    </ul>
  );
};

export default AuthorArchive;
