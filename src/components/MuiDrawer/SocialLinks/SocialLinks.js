import React from "react";
import LinkButton from "../../Button/LinkButton";
import { gql, useQuery } from "@apollo/client";
import { List, Button, makeStyles } from "@material-ui/core";
import classnames from "classnames";
import Loading from "../../Loading/Loading";
const SOCIAL_LINKS_QUERY = gql`
  query SocialLinks {
    menuItems(first: 100, where: { location: ICONMENU }) {
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

const useStyles = makeStyles(theme => ({
  linkButton: {
    color: theme.palette.primary.contrastText
  }
}));

export const SocialLinks = () => {
  const menuApi = useQuery(SOCIAL_LINKS_QUERY);
  const classes = useStyles();
  const { loading, error, data } = menuApi;

  if (loading) return <Loading />;
  if (error) return <p>Ooops!</p>;
  const socialLinks = data.menuItems.nodes;
  return (
    <List component="div" className="social-links">
      {socialLinks.map(item => {
        return (
          <Button
            key={item.id}
            className={classnames(classes.linkButton, item.cssClasses)}
            href={`${item.url}`}
            target="_blank"
          >
            {item.label}
          </Button>
        );
      })}
    </List>
  );
};
