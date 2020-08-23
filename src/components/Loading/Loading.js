import React from "react";
import CircularProgress from "@material-ui/core/CircularProgress";
import { makeStyles } from "@material-ui/core";
const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    width: "100%"
    // "justify-content": "center;"
  }
}));
const Loading = ({ color }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <CircularProgress color={color || "inherit"} />
    </div>
  );
};

export default Loading;
