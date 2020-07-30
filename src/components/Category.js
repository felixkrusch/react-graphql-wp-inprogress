import React from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import ReactHtmlParser from "react-html-parser";
import { getUrl } from "./Header";
//post query updated
const CATEGORY_QUERY = gql`
  query Category($id: ID!) {
    category(id: $id, idType: SLUG) {
      name
      description
      posts {
        nodes {
          id
          title
          date
          link
        }
      }
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
      <h3>{category.name}</h3>
      <div>{category.description}</div>
      <ul>
        {category.posts.nodes.map(({ title, date, link }) => {
          const urlObj = getUrl(link);
          return (
            <li>
              <Link to={urlObj.url}>{title}</Link>
              <div>Date: {date}</div>
              <br />
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Category;
