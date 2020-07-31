import React from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import ReactHtmlParser from "react-html-parser";
import { getUrl } from "./Header";
import { Pagination } from "./Posts";
//post query updated
const CATEGORY_QUERY = gql`
  query Category(
    $id: ID!
    $first: Int
    $last: Int
    $after: String
    $before: String
  ) {
    category(id: $id, idType: SLUG) {
      name
      description
      posts(first: $first, last: $last, after: $after, before: $before) {
        pageInfo {
          hasNextPage
          hasPreviousPage
          startCursor
          endCursor
        }

        nodes {
          postId
          title
          date
          link
        }
      }
    }
  }
`;
const updateQuery = (previousResult, { fetchMoreResult }) => {
  return fetchMoreResult.category.posts.nodes.length
    ? fetchMoreResult
    : previousResult;
};
const Category = () => {
  const { slug } = useParams();
  const variables = {
    first: 10,
    last: null,
    after: null,
    before: null,
    id: slug
  };
  const { loading, error, data, fetchMore } = useQuery(CATEGORY_QUERY, {
    variables
  });
  if (loading) return <p>Loading Post Content...</p>;
  if (error) return <p>Something wrong happened!</p>;
  const { category } = data;
  return (
    <div>
      <h3>{category.name}</h3>
      <div>{category.description}</div>
      <Pagination
        fetchMore={fetchMore}
        posts={category.posts}
        updateQuery={updateQuery}
        variables={{ id: slug }}
      />
      <ul>
        {category.posts.nodes.map(({ title, date, link, postId }) => {
          const urlObj = getUrl(link);
          return (
            <li key={postId}>
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
