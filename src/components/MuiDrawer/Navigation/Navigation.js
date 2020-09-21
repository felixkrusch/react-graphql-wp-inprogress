import React, { useState } from "react";
import { gql, useQuery } from "@apollo/client";
import { baseUrl } from "../../../wpconfig";
import classnames from "classnames";
import { List, ListItemText, Button, MenuItem, Menu } from "@material-ui/core";
import LinkButton from "../../Button/LinkButton";
import "./header.scss";
import Loading from "../../Loading/Loading";
import useHeader from "./useHeader";
import { Helmet } from "react-helmet";
const MENU_QUERY = gql`
  query Menus {
    getCustomizations {
      leadcolor1
      # logourl
      colorfontbuttons
      colorhd
      colorhdfont
      customcss
      colorhdfonthover
      siteiconurl
    }

    # blockAreas {
    #   nodes {
    #     databaseId
    #     content
    #     slug
    #   }
    # }
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
            url
            id
          }
        }
      }
    }
    # iconMenuItems: menuItems(first: 100, where: { location: ICONMENU }) {
    #   nodes {
    #     id
    #     parentId
    #     label
    #     cssClasses
    #     url
    #     target
    #   }
    # }
  }
`;
export const getUrl = url => {
  url = url.replace(baseUrl, "");
  if (url.indexOf("://") >= 0) {
    return { url, isExternal: true };
  }
  return { url };
};

const Header = () => {
  const menuApi = useQuery(MENU_QUERY);
  const { loading, error, data } = menuApi;
  useHeader({ data });

  if (loading) return <Loading />;
  if (error) return <p>Ooops!</p>;
  const menus = data.menuItems.nodes.filter(n => !n.parentId);

  // const blockAreas = data.blockAreas;
  const {
    getCustomizations //, allSettings, iconMenuItems
  } = data;
  return (
    <div className="header">
      <Helmet>
        <link rel="icon" href={getCustomizations.siteiconurl} sizes="32x32" />
        <link rel="icon" href={getCustomizations.siteiconurl} sizes="192x192" />
        <link rel="apple-touch-icon" href={getCustomizations.siteiconurl} />
      </Helmet>
      {/* {getCustomizations.logourl ? (
        <LinkButton to="/">
          <img
            src={getCustomizations.logourl}
            title={
              allSettings.generalSettingsTitle +
              allSettings.generalSettingsDescription
            }
          />
        </LinkButton>
      ) : (
        <div>
          <LinkButton to="/">{allSettings.generalSettingsTitle}</LinkButton>
          <ListItemText className="link-btn">
            {allSettings.generalSettingsDescription}
          </ListItemText>
        </div>
      )} */}
      {/* {blockAreas.nodes
        .filter(({ slug }) => slug === "header-blocks")
        .map(({ content, databaseId }) => (
          <div key={databaseId}>{ReactHtmlParser(content)}</div>
        ))} */}
      <Menus menus={menus} />
      {/* <h3 className="testcustomcss">icon menus</h3> */}
      {/* <Menus menus={iconMenuItems.nodes} /> */}
    </div>
  );
};

export const Menus = ({ menus }) => {
  return (
    <List className="list-row">
      {menus.map(menu => {
        return <NavMenu key={menu.id} menu={menu}></NavMenu>;
      })}
    </List>
  );
};

const NavMenu = ({ menu: { label, url, childItems, cssClasses } }) => {
  const urlObj = getUrl(url);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = event => {
    if (!(childItems && childItems.nodes.length > 0)) return;
    event.preventDefault();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <li className={classnames(cssClasses)}>
      {urlObj.isExternal ? (
        <Button
          className="link-btn"
          target="_blank"
          rel="noopener noreferrer"
          href={urlObj.url}
          fullWidth
        >
          <ListItemText>{label}</ListItemText>
        </Button>
      ) : (
        <LinkButton onClick={handleClick} to={urlObj.url}>
          {label}
        </LinkButton>
      )}
      {childItems && childItems.nodes.length > 0 && (
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          getContentAnchorEl={null}
          onClose={handleClose}
          elevation={0}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center"
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "center"
          }}
        >
          {childItems.nodes.map(({ label, id, url, css }) => {
            const urlObj = getUrl(url);
            return (
              <MenuItem onClick={handleClose} key={id}>
                {urlObj.isExternal ? (
                  <Button
                    className="link-btn"
                    target="_blank"
                    rel="noopener noreferrer"
                    href={urlObj.url}
                  >
                    <ListItemText>{label}</ListItemText>
                  </Button>
                ) : (
                  <LinkButton to={urlObj.url}>{label}</LinkButton>
                )}
              </MenuItem>
            );
          })}
        </Menu>
      )}
    </li>
  );
};

export default Header;
