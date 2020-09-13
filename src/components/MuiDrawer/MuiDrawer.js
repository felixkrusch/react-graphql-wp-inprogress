import React, { useState } from "react";
import AppBar from "@material-ui/core/AppBar";
import CssBaseline from "@material-ui/core/CssBaseline";
import Toolbar from "@material-ui/core/Toolbar";
import { makeStyles, fade, useTheme } from "@material-ui/core/styles";
import Header from "./Header/Header";
import Routes from "../Routes";
import SearchIcon from "@material-ui/icons/Search";
import useMediaQuery from "@material-ui/core/useMediaQuery";

import MenuIcon from "@material-ui/icons/Menu";

import Drawer from "@material-ui/core/Drawer";
import {
  FormControlLabel,
  Switch,
  IconButton,
  Typography,
  InputBase
} from "@material-ui/core";
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
    // width: drawerWidth,
    // flexShrink: 0,
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
  title: {
    flexGrow: 1
  },
  search: {
    marginRight: 10,
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: fade(theme.palette.common.white, 0.25)
    },
    marginLeft: 0,
    // width: "100%",
    [theme.breakpoints.up("sm")]: {
      // marginLeft: theme.spacing(1)
      width: "auto"
    }
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  inputRoot: {
    color: "inherit"
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create("width"),
    // width: "100%",
    width: "12ch",
    "&:focus": {
      width: "20ch"
    }
    // [theme.breakpoints.up("sm")]: {
    // }
  },
  switchLabel: {
    marginRight: 0
  }
}));

function MuiDrawer({ toggleDarkMode }) {
  const classes = useStyles();
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isUpSM = useMediaQuery(theme.breakpoints.up("sm"));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  // const container =
  //   window !== undefined ? () => window().document.body : undefined;
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
        <Header />
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
          <Typography variant="h6" className={classes.title}>
            App Bar
          </Typography>
          <div className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <InputBase
              placeholder="Search…"
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput
              }}
              inputProps={{ "aria-label": "search" }}
            />
          </div>
          <FormControlLabel
            className={classes.switchLabel}
            control={<Switch onClick={toggleDarkMode} />}
          />
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
