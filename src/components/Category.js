import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import ReactHtmlParser from "react-html-parser";

//post query updated
const CATEGORY_QUERY = gql`
  query Category($id: ID!) {
    category(id: $id, idType: SLUG) {
      name
      description
    }
  }
`;

const Category = () => {
  const { slug } = useParams();
  const { loading, error, data } = useQuery(CATEGORY_QUERY, {
    variables: { id: slug }
  });
  if (loading) return <p>Loading Post Content...</p>;
  if (error) return <p>Something wrong happened!</p>;
  const { category } = data;
  return (
    <div>
      <h3>{category && category.name}</h3>
      <div>{category && category.description}</div>
    </div>
  );
};

export default Category;
