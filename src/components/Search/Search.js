import React, { useState, useRef, useEffect } from "react";
import {
  makeStyles,
  fade,
  InputBase,
  List,
  ListItem,
  Popover,
  CircularProgress
} from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import { useLazyQuery, gql } from "@apollo/client";
import { usePostQuery } from "../usePostQuery";
import ReactHtmlParser from "react-html-parser";
import { Link } from "react-router-dom";
import LinkButton from "../Button/LinkButton";

const useStyles = makeStyles(theme => ({
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
    cursor: "pointer",
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    zIndex: 10,
    // pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  inputRoot: {
    color: "inherit"
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create("width"),
    width: "15ch",
    "&:focus": {
      //   width: "20ch"
    }
  },
  link: {
    color: "inherit",
    textDecoration: "none"
  },
  listItem: {
    "&:hover": {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText
    }
  }
}));

const POSTS_QUERY = gql`
  query GET_POSTS($search: String) {
    posts(where: { search: $search }) {
      nodes {
        databaseId
        title(format: RENDERED)
        slug
      }
    }
  }
`;
export const Search = () => {
  const classes = useStyles();
  const popoverActions = useRef(null);
  const anchorElRef = useRef(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [search, setSearch] = useState("");
  const postsQuery = useLazyQuery(POSTS_QUERY);
  const { loading, data } = usePostQuery({
    query: postsQuery,
    search
  });
  useEffect(() => {
    setTimeout(() => {
      if (popoverActions.current) {
        popoverActions.current.updatePosition();
      }
    }, 0);
  }, [data, popoverActions]);
  const posts = data?.posts?.nodes || [];
  const handlePopoverOpen = event => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  return (
    <div
      ref={item => (anchorElRef.current = item)}
      className={classes.search}
      aria-haspopup="true"
    >
      <div onClick={handlePopoverOpen} className={classes.searchIcon}>
        <SearchIcon />
      </div>
      <InputBase
        value={search}
        onChange={({ target: { value } }) => setSearch(value)}
        placeholder="Search…"
        classes={{
          root: classes.inputRoot,
          input: classes.inputInput
        }}
        inputProps={{ "aria-label": "search" }}
        onKeyDown={e => e.key === "Enter" && handlePopoverOpen(e)}
      />
      <Popover
        onClose={handlePopoverClose}
        anchorEl={anchorElRef.current}
        open={open}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left"
        }}
        action={popoverActions}
        transformOrigin={{
          vertical: "top",
          horizontal: "left"
        }}
      >
        <List component="div" className={classes.list}>
          {loading ? (
            <ListItem>
              <CircularProgress />
            </ListItem>
          ) : posts.length === 0 ? (
            <ListItem>No search result</ListItem>
          ) : (
            posts.map(post => (
              <LinkButton
                dense
                onClick={handlePopoverClose}
                to={`/${post.slug}/`}
                className={classes.listItem}
                key={post.databaseId}
              >
                {/* <Link
                  className={classes.link}
                > */}
                {ReactHtmlParser(post.title)}
                {/* </Link> */}
              </LinkButton>
            ))
          )}
        </List>
      </Popover>
    </div>
  );
};
