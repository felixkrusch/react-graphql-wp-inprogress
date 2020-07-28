import React from "react";
import { useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import { Link } from "react-router-dom";

const MENU_QUERY = gql`
  query Menus {
    menuItems(where: { location: PRIMARY }) {
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

const Header = () => {
  const menuApi = useQuery(MENU_QUERY, {
    fetchPolicy: "no-cache"
  });
  const { loading, error, data } = menuApi;
  if (loading) return <p>Loading MENU...</p>;
  if (error) return <p>Ooops!</p>;
  const menu = data.menuItems.nodes.filter(n => !n.parentId);
  console.log("header menu", menu);
  return menu.map(({ title, id, url, childItems: { nodes } }) => {
    console.log("url...", url);
    const newUrl = url.replace("https://demo.richwp.com", "");
    console.log(newUrl);
    return (
      <ul key={id}>
        <li>
          <Link to={`${newUrl}`}>{title}</Link>
          {nodes.map(({ title, id, url }) => {
            const newUrl = url.replace("https://demo.richwp.com", "");
            return (
              <ul key={id}>
                <li>
                  <Link to={newUrl}>{title}</Link>
                </li>
              </ul>
            );
          })}
        </li>
      </ul>
    );
  });
};

export default Header;
