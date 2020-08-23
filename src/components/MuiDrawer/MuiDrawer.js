import React from "react";
import PropTypes from "prop-types";
import AppBar from "@material-ui/core/AppBar";
import CssBaseline from "@material-ui/core/CssBaseline";
import Toolbar from "@material-ui/core/Toolbar";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Header from "./Header/Header";
import Routes from "../Routes";
import { gql } from "apollo-boost";
import Head from "./Header/Head";
import Loading from "../Loading/Loading";
import { useQuery } from "@apollo/react-hooks";

const MENU_QUERY = gql`
  query Menus {
    getCustomizations {
      siteiconurl
    }
  }
`;
const useStyles = makeStyles(theme => ({
  root: {
    display: "flex"
  },

  toolbar: theme.mixins.toolbar,

  content: {
    flexGrow: 1,
    padding: theme.spacing(3)
  }
}));

function MuiDrawer({ toggleDarkMode }) {
  const classes = useStyles();
  const menuApi = useQuery(MENU_QUERY);
  const { loading, error, data } = menuApi;

  if (loading) return <Loading />;
  if (error) return <p>Ooops!</p>;
  const { getCustomizations } = data;

  return (
    <div className={classes.root}>
      <Head getCustomizations={getCustomizations} />
      <CssBaseline />
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <Header toggleDarkMode={toggleDarkMode} />
        </Toolbar>
      </AppBar>

      <main className={classes.content}>
        <div className={classes.toolbar} />
        <Routes />
      </main>
    </div>
  );
}

export default MuiDrawer;
