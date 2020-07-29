import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import ReactHtmlParser from "react-html-parser";

//post query updated
const TAG_QUERY = gql`
  query Tag($id: ID!) {
    tag(id: $id, idType: SLUG) {
      name
      description
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
  return (
    <div>
      <h3>{tag && tag.name}</h3>
      <div>{tag && tag.description}</div>
    </div>
  );
};

export default Tag;
