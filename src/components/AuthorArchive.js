import React from "react";
import { useParams, Link } from "react-router-dom";
import { gql, useLazyQuery } from "@apollo/client";
import ReactHtmlParser from "react-html-parser";
import { Pagination } from "./Posts";
import { Author } from "./Page";
import { usePostQuery } from "./usePostQuery";
import { baseUrl } from "../wpconfig";
import Loading from "./Loading/Loading";

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
        uri
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

  if (loading) return <Loading />;
  if (error) return <p>Something wrong happened!</p>;
  const posts = data.posts;
  const user = data.user;
  return (
    <div>
      <Author author={user} />
      <ul>
        {posts.nodes.map(post => (
          <li key={post.databaseId}>
            <h3>
              <Link to={post.uri}>{post.title}</Link>
            </h3>
            <div>{post.date}</div>
            <div>{ReactHtmlParser(replaceUrl(post.excerpt))}</div>
            <Link to={post.uri}>Read More</Link>
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
