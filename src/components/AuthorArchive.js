import React from "react";
import { useParams } from "react-router-dom";
import { useLazyQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import ReactHtmlParser from "react-html-parser";
import { Pagination } from "./Posts";
import { Author } from "./Post";
import { usePostQuery } from "./usePostQuery";
import { baseUrl } from "../wpconfig";

//post query updated
const AUTHOR_QUERY = gql`
  query Author(
    $authorName: String
    $userId: ID!
    $first: Int
    $last: Int
    $after: String
    $before: String
  ) {
    user(id: $userId, idType: SLUG) {
      description
      name
      uri
      avatar {
        url
      }
    }
    posts(
      first: $first
      last: $last
      after: $after
      before: $before
      where: { authorName: $authorName }
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
        excerpt
        date
        slug
      }
    }
  }
`;
const replaceUrl = url => {
  return url.replace(baseUrl, "");
};
const updateQuery = (previousResult, { fetchMoreResult }) => {
  return fetchMoreResult.posts.nodes.length ? fetchMoreResult : previousResult;
};
const AuthorArchive = () => {
  const { slug } = useParams();
  const authorQuery = useLazyQuery(AUTHOR_QUERY);
  const [, { fetchMore }] = authorQuery;
  const { loading, data, error, postsPerPage } = usePostQuery({
    query: authorQuery,
    variables: { authorName: slug, userId: slug }
  });

  if (loading) return <p>Loading Author Content...</p>;
  if (error) return <p>Something wrong happened!</p>;
  const posts = data.posts;
  const user = data.user;
  return (
    <div>
      <Author author={user} />
      <ul>
        {console.log(posts)}
        {posts.nodes.map(post => (
          <li key={post.databaseId}>
            <h3>{post.title}</h3>
            <div>{post.date}</div>
            <div>{ReactHtmlParser(replaceUrl(post.excerpt))}</div>
          </li>
        ))}
      </ul>
      <Pagination
        fetchMore={fetchMore}
        posts={posts}
        updateQuery={updateQuery}
        postsPerPage={postsPerPage}
      />
    </div>
  );
};

export default AuthorArchive;
