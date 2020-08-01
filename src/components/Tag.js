import React from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery, useLazyQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import ReactHtmlParser from "react-html-parser";
import { getUrl } from "./Header";
import { Pagination } from "./Posts";
import { usePostQuery } from "./usePostQuery";

//post query updated
const TAG_QUERY = gql`
  query Tag(
    $id: ID!
    $first: Int
    $last: Int
    $after: String
    $before: String
    $tag: String
  ) {
    tag(id: $id, idType: SLUG) {
      id
      description
      name

      posts(
        first: $first
        last: $last
        after: $after
        before: $before
        where: { tag: $tag }
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
  return fetchMoreResult.tag.posts.nodes.length
    ? fetchMoreResult
    : previousResult;
};
const Tag = () => {
  const { slug } = useParams();
  const tagQuery = useLazyQuery(TAG_QUERY);
  const [, { fetchMore }] = tagQuery;
  const { loading, data, error, postsPerPage } = usePostQuery({
    query: tagQuery,
    variables: { id: slug, tag: slug }
  });
  console.log("tag page", data);
  // const { slug } = useParams();
  // const variables = {
  //   first: 10,
  //   last: null,
  //   after: null,
  //   before: null,
  //   id: slug
  // };
  // const { loading, error, data, fetchMore } = useQuery(TAG_QUERY, {
  //   variables
  // });
  if (loading) return <p>Loading Tag Content...</p>;
  if (error) return <p>Something wrong happened!</p>;
  const { tag } = data;
  console.log(tag);
  return (
    <div>
      <h3>Name: {tag.name}</h3>
      <div>{tag.description}</div>
      <Pagination
        fetchMore={fetchMore}
        posts={tag.posts}
        postsPerPage={postsPerPage}
        updateQuery={updateQuery}
      />
      <ul>
        {tag.posts.nodes.map(({ title, date, link, databaseId }) => {
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

export default Tag;
