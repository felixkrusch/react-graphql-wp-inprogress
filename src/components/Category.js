import React from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery, useLazyQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import ReactHtmlParser from "react-html-parser";
import { getUrl } from "./Header";
import { Pagination } from "./Posts";
import { usePostQuery } from "./usePostQuery";
//post query updated
const CATEGORY_QUERY = gql`
  query Category(
    $id: ID!
    $first: Int
    $last: Int
    $after: String
    $before: String
    $categoryName: String
  ) {
    category(id: $id, idType: SLUG) {
      name
      description
      posts(
        first: $first
        last: $last
        after: $after
        before: $before
        where: { categoryName: $categoryName }
      ) {
        pageInfo {
          hasNextPage
          hasPreviousPage
          startCursor
          endCursor
        }

        nodes {
          databaseId
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
  const categoryQuery = useLazyQuery(CATEGORY_QUERY);
  const [, { fetchMore }] = categoryQuery;
  const { loading, data, error, postsPerPage } = usePostQuery({
    query: categoryQuery,
    variables: { id: slug, categoryName: slug }
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
        postsPerPage={postsPerPage}
      />
      <ul>
        {category.posts.nodes.map(({ title, date, link, databaseId }) => {
          const urlObj = getUrl(link);
          return (
            <li key={databaseId}>
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
