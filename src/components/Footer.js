import React from "react";
import { useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import { Link } from "react-router-dom";
import { baseUrl } from "../wpconfig";
import ReactHtmlParser from "react-html-parser";
import { replaceUrl } from "./Page";

const FOOTER_QUERY = gql`
  query BlockAreas {
    blockAreas {
      nodes {
        databaseId
        content
        slug
      }
    }
  }
`;
export const getUrl = url => {
  url = url.replace(baseUrl, "");
  if (url.indexOf("://") >= 0) {
    return { url, isExternal: true };
  }
  return { url };
};
const Footer = () => {
  const menuApi = useQuery(FOOTER_QUERY, {
    fetchPolicy: "no-cache"
  });
  const { loading, error, data } = menuApi;
  if (loading) return <p>Loading Footer...</p>;
  if (error) return <p>Ooops!</p>;
  const blockAreas = data.blockAreas;
  return (
    <div>
      <h3>Footer block</h3>
      {blockAreas.nodes
        .filter(({ slug }) => slug === "footer-blocks")
        .map(({ content, databaseId }) => (
          <div key={databaseId}>{ReactHtmlParser(replaceUrl(content))}</div>
        ))}
    </div>
  );
};

export default Footer;