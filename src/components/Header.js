import React, { useEffect } from "react";
import { useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import { Link } from "react-router-dom";
import { baseUrl } from "../wpconfig";
import ReactHtmlParser from "react-html-parser";
import { Helmet } from "react-helmet";
import classnames from "classnames";

const MENU_QUERY = gql`
  query Menus {
    getCustomizations {
      leadcolor1
      logourl
      siteiconurl
      colorfontbuttons
      colorhd
      colorhdfont
      colorhdfonthover
      copyright
    }
    allSettings {
      generalSettingsDescription
      generalSettingsTitle
    }
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
        label
        url
        target
        childItems(where: { location: PRIMARY }) {
          nodes {
            label
            label
            url
            id
          }
        }
      }
    }
    iconMenuItems: menuItems(first: 100, where: { location: ICONMENU }) {
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
  useEffect(() => {
    if (!data) return;
    const { getCustomizations } = data;
    const {
      leadcolor1,
      colorfontbuttons,
      colorhd,
      colorhdfont,
      colorhdfonthover
    } = getCustomizations;
    console.log(
      leadcolor1,
      colorfontbuttons,
      colorhd,
      colorhdfont,
      colorhdfonthover
    );
    document.documentElement.style.setProperty("--leadcolor1", leadcolor1);
    document.documentElement.style.setProperty(
      "--colorfontbuttons",
      colorfontbuttons
    );
    document.documentElement.style.setProperty("--colorhd", colorhd);
    document.documentElement.style.setProperty("--colorhdfont", colorhdfont);
    document.documentElement.style.setProperty(
      "--colorhdfonthover",
      colorhdfonthover
    );
  }, [data]);
  if (loading) return <p>Loading MENU...</p>;
  if (error) return <p>Ooops!</p>;
  const menu = data.menuItems.nodes.filter(n => !n.parentId);
  const blockAreas = data.blockAreas;
  const { getCustomizations, allSettings, iconMenuItems } = data;
  console.log("header menu data...", getCustomizations);
  return (
    <div>
      <Helmet>
        <link rel="icon" href={getCustomizations.siteiconurl} sizes="32x32" />
        <link rel="icon" href={getCustomizations.siteiconurl} sizes="192x192" />
        <link
          rel="apple-touch-icon-precomposed"
          href={getCustomizations.siteiconurl}
        />
      </Helmet>
      {getCustomizations.logourl ? (
        <Link to="/">
          <img src={getCustomizations.logourl} alt="logo" />
        </Link>
      ) : (
        <>
          <Link to="/">
            <h3>{allSettings.generalSettingsTitle}</h3>
          </Link>
          <span>{allSettings.generalSettingsDescription}</span>
        </>
      )}
      <h3 className="leadcolor1">header blocks</h3>
      {blockAreas.nodes
        .filter(({ slug }) => slug === "header-blocks")
        .map(({ content, databaseId }) => (
          <div key={databaseId}>{ReactHtmlParser(content)}</div>
        ))}
      <Menus menus={menu} />
      <h3>icon menus</h3>
      <Menus menus={iconMenuItems.nodes} />
    </div>
  );
};

export const Menus = ({ menus }) => {
  console.log(menus);
  return menus.map(({ label, id, url, childItems, cssClasses }) => {
    const urlObj = getUrl(url);
    return (
      <ul key={id}>
        <li className={classnames(cssClasses)}>
          {urlObj.isExternal ? (
            <a target="_blank" rel="noopener noreferrer" href={urlObj.url}>
              {label}
            </a>
          ) : (
            <Link to={urlObj.url}>{label}</Link>
          )}
          {childItems &&
            childItems.nodes.map(({ label, id, url, css }) => {
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
                        {label}
                      </a>
                    ) : (
                      <Link to={urlObj.url}>{label}</Link>
                    )}
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
