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
        connectedObject {
          ... on MenuItem {
            id
            url
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

            parent {
              node {
                slug
              }
            }
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

  const menu = data.menuItems.nodes;
  return menu.map(
    ({ title, id, target, url, connectedObject: { slug, parent } }) => {
      const parentSlug = parent?parent.node.slug:"";
      return (
        <ul key={id}>
          {/* // if key exists ... use router, display the label shown in the menu, not
      the page title */}
          <li>
            <Link to={`/page/${parentSlug ? parentSlug + "/" : ""}${slug}`}>
              {title}
            </Link>
          </li>
          {/* // if MenuItem(external link) */}
          <li>
            <a href={url} target={target}>
              {title}
            </a>
          </li>
        </ul>
      );
    }
  );
};

export default Header;
