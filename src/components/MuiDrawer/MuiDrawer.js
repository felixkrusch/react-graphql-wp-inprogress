import React, { useState, useEffect } from "react";
import AppBar from "@material-ui/core/AppBar";
import CssBaseline from "@material-ui/core/CssBaseline";
import Toolbar from "@material-ui/core/Toolbar";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Navigation from "./Navigation/Navigation";
import Routes from "../Routes";
import useMediaQuery from "@material-ui/core/useMediaQuery";

import MenuIcon from "@material-ui/icons/Menu";
import moment from "moment";
import Drawer from "@material-ui/core/Drawer";
import { FormControlLabel, Switch, IconButton } from "@material-ui/core";
import { Search } from "../Search/Search";
import { Logo } from "./Logo/Logo";
import { SocialLinks } from "./SocialLinks/SocialLinks";
import { gql, useQuery } from "@apollo/client";
const MENU_QUERY = gql`
  query Menus {
    getCustomizations {
      disabledarkmodetoggle
    }
  }
`;
const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex"
  },
  drawer: {
    [theme.breakpoints.up("sm")]: {
      width: drawerWidth,
      flexShrink: 0
    }
  },
  rightSection: {
    width: drawerWidth
  },
  appBar: {
    [theme.breakpoints.up("sm")]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth
    }
  },
  toolbar: theme.mixins.toolbar,

  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    display: "flex"
  },
  drawerPaper: {
    width: drawerWidth
  },
  menuButton: {
    [theme.breakpoints.up("sm")]: {
      display: "none"
    }
  },

  switchLabel: {
    marginRight: 0
  }
}));

function MuiDrawer({ toggleDarkMode }) {
  const classes = useStyles();
  const [darkModeActive, setDarkModeActive] = useState(false);
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isUpSM = useMediaQuery(theme.breakpoints.up("sm"));

  const menuApi = useQuery(MENU_QUERY);
  const { loading, error, data } = menuApi;
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  useEffect(() => {
    if (!data) return;
    const disabledarkmodetoggle = data?.disabledarkmodetoggle;
    if (!disabledarkmodetoggle) {
      const isBetween = moment().isBetween(
        moment("05:30", "HH:mm"),
        moment("21:30", "HH:mm")
      );
      if (isBetween) return;
      setDarkModeActive(true);
      toggleDarkMode();
    }
  }, [data]);
  const disabledarkmodetoggle = data?.disabledarkmodetoggle;
  return (
    <div className={classes.root}>
      <Drawer
        className={classes.drawer}
        variant={isUpSM ? "permanent" : "temporary"}
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true // Better open performance on mobile.
        }}
        classes={{
          paper: classes.drawerPaper
        }}
        anchor="left"
      >
        <Navigation />
      </Drawer>

      <CssBaseline />
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar className={classes.toolbar}>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="menu"
            onClick={handleDrawerToggle}
          >
            <MenuIcon />
          </IconButton>
          <Logo />
          <Search />
          <SocialLinks />
          {!loading && !disabledarkmodetoggle && (
            <FormControlLabel
              className={classes.switchLabel}
              control={
                <Switch
                  onChange={() => {
                    toggleDarkMode();
                    setDarkModeActive(!darkModeActive);
                  }}
                  checked={darkModeActive}
                />
              }
            />
          )}
        </Toolbar>
      </AppBar>

      <main className={classes.content}>
        <div>
          <div className={classes.toolbar} />
          <Routes />
        </div>
        <div className={classes.rightSection}>
          <div className={classes.toolbar} />

          <h3> </h3>
        </div>
      </main>
    </div>
  );
}

export default MuiDrawer;
