import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import ReactHtmlParser from "react-html-parser";

//post query updated
const TAG_QUERY = gql`
  query Tag($id: ID!) {
    tag(id: $id, idType: SLUG) {
      id
      description
      name
      posts {
        nodes {
          id
          title
          date
        }
      }
    }
  }
`;

const Tag = () => {
  const { slug } = useParams();
  const { loading, error, data } = useQuery(TAG_QUERY, {
    variables: { id: slug }
  });
  if (loading) return <p>Loading Post Content...</p>;
  if (error) return <p>Something wrong happened!</p>;
  const { tag } = data;
  console.log(tag);
  return (
    <div>
      <h3>Name: {tag.name}</h3>
      <div>{tag.description}</div>

      <ul>
        {tag.posts.nodes.map(({ title, date }) => (
          <li>
            <div>Title: {title}</div>
            <div>Date: {date}</div>
            <br />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Tag;
