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
import Drawer from "@material-ui/core/Drawer";
import { FormControlLabel, Switch } from "@material-ui/core";
// const MENU_QUERY = gql`
//   query Menus {
//     getCustomizations {
//       siteiconurl
//     }
//   }
// `;
const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex"
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0
  },
  appBar: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth
  },
  toolbar: theme.mixins.toolbar,

  content: {
    flexGrow: 1,
    padding: theme.spacing(3)
  },
  drawerPaper: {
    width: drawerWidth
  },
  toolbar: {
    // justifyContent: "flex-end"
  }
}));

function MuiDrawer({ toggleDarkMode }) {
  const classes = useStyles();
  // const menuApi = useQuery(MENU_QUERY);
  // const { loading, error, data } = menuApi;

  // if (loading) return <Loading />;
  // if (error) return <p>Ooops!</p>;
  // const { getCustomizations } = data;

  return (
    <div className={classes.root}>
      <Drawer
        className={classes.drawer}
        variant="permanent"
        classes={{
          paper: classes.drawerPaper
        }}
        anchor="left"
      >
        <Header />
      </Drawer>

      <CssBaseline />
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar className={classes.toolbar}>
          <FormControlLabel control={<Switch onClick={toggleDarkMode} />} />
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
