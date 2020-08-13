import React from "react";
import { useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import { Link } from "react-router-dom";
import { baseUrl } from "../wpconfig";
import ReactHtmlParser from "react-html-parser";

const MENU_QUERY = gql`
  query Menus {
    blockAreas {
      nodes {
        databaseId
        content
        slug
        #  template {
        #    ... on HeaderBlockAreaTemplate {
        #      templateName
        #    }
        #  }
      }
    }
    menuItems(where: { location: PRIMARY }, first: 100) {
      nodes {
        id
        parentId
        title: label
        url
        target
        childItems(where: { location: PRIMARY }) {
          nodes {
            label
            title: label
            url
            id
          }
        }
      }
    }
  }
`;
export const getUrl = url => {
  url = url.replace(baseUrl, "");
  // console.log(url);
  if (url.indexOf("://") >= 0) {
    return { url, isExternal: true };
  }
  return { url };
};
const Header = () => {
  const menuApi = useQuery(MENU_QUERY, {
    fetchPolicy: "no-cache"
  });
  const { loading, error, data } = menuApi;
  if (loading) return <p>Loading MENU...</p>;
  if (error) return <p>Ooops!</p>;
  const menu = data.menuItems.nodes.filter(n => !n.parentId);
  const blockAreas = data.blockAreas;
  console.log("header menu data...", blockAreas);
  return (
    <div>
      <h3>header blocks</h3>
      {blockAreas.nodes
        .filter(({ slug }) => slug === "header-blocks")
        .map(({ content, databaseId }) => (
          <div key={databaseId}>{ReactHtmlParser(content)}</div>
        ))}
      {menu.map(({ title, id, url, childItems: { nodes } }) => {
        const urlObj = getUrl(url);
        return (
          <ul key={id}>
            <li>
              {urlObj.isExternal ? (
                <a target="_blank" rel="noopener noreferrer" href={urlObj.url}>
                  {title}
                </a>
              ) : (
                <Link to={urlObj.url}>{title}</Link>
              )}
              {nodes.map(({ title, id, url }) => {
                const urlObj = getUrl(url);
                return (
                  <ul key={id}>
                    <li>
                      {urlObj.isExternal ? (
                        <a
                          target="_blank"
                          rel="noopener noreferrer"
                          href={urlObj.url}
                        >
                          {title}
                        </a>
                      ) : (
                        <Link to={urlObj.url}>{title}</Link>
                      )}
                    </li>
                  </ul>
                );
              })}
            </li>
          </ul>
        );
      })}
    </div>
  );
};

export default Header;
