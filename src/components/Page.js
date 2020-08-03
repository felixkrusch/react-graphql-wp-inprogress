import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import ReactHtmlParser from "react-html-parser";
import Comments from "./Comments";

//pages query updated
const PAGE_QUERY = gql`
  query Page($id: ID!) {
    page(id: $id, idType: URI) {
      databaseId
      title
      content
    }
  }
`;

const Page = () => {
  const { slug, slugChild } = useParams();

  // creating complete slug path
  const path = `${slug}/${slugChild ? slugChild : ""}`;
  const { loading, error, data } = useQuery(PAGE_QUERY, {
    variables: { id: path }
  });
  if (loading) return <p>Loading Page Content...</p>;
  if (error) return <p>Something wrong happened!</p>;

  // destructuring data
  const { page } = data;

  return (
    <div>
      <h3>{page && page.title}</h3>
      <div>{ReactHtmlParser(page && page.content)}</div>
      <Comments contentId={page.databaseId} />
    </div>
  );
};

export default Page;
