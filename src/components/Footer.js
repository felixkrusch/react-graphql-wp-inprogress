import React from "react";
import { gql, useQuery } from "@apollo/client";
import ReactHtmlParser from "react-html-parser";
import { replaceUrl } from "./Page";
import { Menus } from "./MuiDrawer/Navigation/Navigation";
import Loading from "./Loading/Loading";

const FOOTER_QUERY = gql`
  query BlockAreas {
    blockAreas {
      nodes {
        databaseId
        content
        slug
      }
    }
    getCustomizations {
      copyright
    }
    menuItems(first: 100, where: { location: FOOTER }) {
      nodes {
        id
        parentId
        label
        cssClasses
        url
        target
      }
    }
  }
`;
export const getUrl = url => {
  url = url.replace(window.baseUrl, "");
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
  if (loading) return <Loading />;
  if (error) return <p>Ooops!</p>;
  const { blockAreas, menuItems, getCustomizations } = data;
  return (
    <div>
      <h3>Footer block</h3>
      {blockAreas.nodes
        .filter(({ slug }) => slug === "footer-blocks")
        .map(({ content, databaseId }) => (
          <div key={databaseId}>{ReactHtmlParser(replaceUrl(content))}</div>
        ))}
      <Menus menus={menuItems.nodes} />
      <p>
        Copyright © 2020 {getCustomizations.copyright} . All rights reserved.
      </p>
    </div>
  );
};

export default Footer;
