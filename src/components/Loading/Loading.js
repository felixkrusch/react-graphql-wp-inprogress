import React from "react";
import CircularProgress from "@material-ui/core/CircularProgress";
import { makeStyles, LinearProgress } from "@material-ui/core";
const useStyles = makeStyles(theme => ({
  root: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    // display: "flex",
    width: "100%",
    zIndex: 10000
    // "justify-content": "center;"
  }
}));
const Loading = ({ color }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <LinearProgress color="primary" />
    </div>
  );
};

export default Loading;
