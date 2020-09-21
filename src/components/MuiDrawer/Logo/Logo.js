import React from "react";
import LinkButton from "../../Button/LinkButton";
import { Typography, ListItemText, makeStyles } from "@material-ui/core";
import { gql, useQuery } from "@apollo/client";
import Loading from "../../Loading/Loading";

const useStyles = makeStyles(theme => ({
  title: {
    flexGrow: 1
  },
  imgLogo: {
    maxHeight: 35,
    verticalAlign: "top"
  },
  titleWrap: {
    "& .link-btn": {
      background: "none",
      width: "auto",
      padding: 0,
      display: "inline-block",
      "& div": {
        margin: 0
      }
    }
  },
  description: {
    margin: 0,
    "& span": {
      fontSize: 13
    }
  }
}));

const MENU_QUERY = gql`
  query Menus {
    getCustomizations {
      logourl
    }
    allSettings {
      generalSettingsDescription
      generalSettingsTitle
    }
  }
`;

export const Logo = () => {
  const classes = useStyles();
  const menuApi = useQuery(MENU_QUERY);
  const { loading, error, data } = menuApi;

  if (loading) return <Loading />;
  if (error) return <p>Ooops!</p>;

  const { getCustomizations, allSettings } = data;
  return (
    <Typography variant="h6" className={classes.title}>
      {getCustomizations.logourl ? (
        <LinkButton to="/">
          <img
            className={classes.imgLogo}
            src={getCustomizations.logourl}
            title={
              allSettings.generalSettingsTitle +
              allSettings.generalSettingsDescription
            }
          />
        </LinkButton>
      ) : (
        <div className={classes.titleWrap}>
          <LinkButton to="/">{allSettings.generalSettingsTitle}</LinkButton>
          <br />
          <ListItemText className={classes.description}>
            {allSettings.generalSettingsDescription}
          </ListItemText>
        </div>
      )}
    </Typography>
  );
};
