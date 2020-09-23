import React, { useState, useRef, useEffect } from "react";
import {
  makeStyles,
  fade,
  InputBase,
  List,
  ListItem,
  CircularProgress,
  Popper,
  ClickAwayListener,
  Typography
} from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import { useLazyQuery, gql } from "@apollo/client";
import { usePostQuery } from "../usePostQuery";
import ReactHtmlParser from "react-html-parser";
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
    flexFlow: "column",
    alignItems: "flex-start",
    "&:hover": {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText
    }
  },
  popper: {
    backgroundColor: theme.palette.primary.contrastText,
    zIndex: 2000,
    boxShadow:
      "0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)",
    borderRadius: 4,
    maxHeight: 300,
    overflow: "auto",
    maxWidth: 300
  }
}));

const POSTS_QUERY = gql`
  query GET_POSTS($search: String) {
    posts(where: { search: $search }) {
      nodes {
        databaseId
        title(format: RENDERED)
        slug

        date
        excerpt
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
      }
    }
  }
`;
export const Search = () => {
  const classes = useStyles();
  const anchorElRef = useRef(null);
  const [showFull, setShowFull] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [search, setSearch] = useState("");
  const postsQuery = useLazyQuery(POSTS_QUERY);
  const { loading, data } = usePostQuery({
    query: postsQuery,
    search
  });
  const posts = data?.posts?.nodes || [];
  const handlePopoverOpen = event => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
    setShowFull(false);
  };
  const showFullResults = e => {
    handlePopoverOpen(e);
    setShowFull(true);
  };
  const open = Boolean(anchorEl);
  return (
    <ClickAwayListener onClickAway={handlePopoverClose}>
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
          onFocus={e => handlePopoverOpen(e)}
          classes={{
            root: classes.inputRoot,
            input: classes.inputInput
          }}
          inputProps={{ "aria-label": "search" }}
          onKeyDown={e => e.key === "Enter" && showFullResults(e)}
        />
        <Popper
          className={classes.popper}
          onClose={handlePopoverClose}
          anchorEl={anchorElRef.current}
          open={open}
          placement="bottom-start"
        >
          <List className={classes.list}>
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
                  <Typography>{ReactHtmlParser(post.title)}</Typography>
                  {/* </Link> */}
                  {showFull && (
                    <>
                      {post.date}
                      <br />
                      {post.featuredImage && (
                        <div>
                          <img
                            src={post.featuredImage.node.sourceUrl}
                            alt={post.featuredImage.node.altText}
                          />
                        </div>
                      )}
                      <div>{ReactHtmlParser(post.excerpt)}</div>
                    </>
                  )}
                </LinkButton>
              ))
            )}
          </List>
        </Popper>
      </div>
    </ClickAwayListener>
  );
};
