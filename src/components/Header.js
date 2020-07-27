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
            connectedObject {
              ... on MenuItem {
                id
                menuUrl: url
                label
              }
              ... on Tag {
                name
                slug
              }
              ... on Category {
                name
                slug
              }
              ... on Page {
                slug
                id
              }
            }
          }
        }
        connectedObject {
          ... on MenuItem {
            id
            menuUrl: url
            label
          }
          ... on Tag {
            name
            slug
          }
          ... on Category {
            name
            slug
          }
          ... on Page {
            slug
            id
          }
          ... on Post {
            slug
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
  console.log(menu);
  return menu.map(
    ({
      title,
      id,
      connectedObject: { slug, menuUrl, label },
      childItems: { nodes }
    }) => {
      return (
        <ul key={id}>
          {/* // if key exists ... use router, display the label shown in the menu, not
      the page title */}
          <li>
            {menuUrl ? (
              <a href={menuUrl} target="_blank">
                {label}
              </a>
            ) : (
              <Link to={`/page/${slug}`}>{title}</Link>
            )}
            {nodes.map(
              ({
                title,
                id,
                connectedObject: {
                  slug: childSlug,
                  menuUrl: childMenuUrl,
                  label
                }
              }) => (
                <ul key={id}>
                  <li>
                    {childMenuUrl ? (
                      <a href={childMenuUrl} target="_blank">
                        {label}
                      </a>
                    ) : (
                      <Link to={`/page/${slug}/${childSlug}`}>{title}</Link>
                    )}
                  </li>
                </ul>
              )
            )}
          </li>
        </ul>
      );
    }
  );
};

export default Header;