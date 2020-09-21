import React, { forwardRef, useMemo } from "react";
import { Link } from "react-router-dom";
import { ListItem, ListItemText } from "@material-ui/core";

const LinkButton = ({ to, children, onClick, onMouseEnter, dense }) => {
  const CustomLink = useMemo(
    () =>
      forwardRef((linkProps, ref) => <Link ref={ref} to={to} {...linkProps} />),
    [to]
  );
  return (
    <ListItem
      dense={dense}
      onClick={onClick}
      className="link-btn"
      button
      component={CustomLink}
      to={to}
      onMouseEnter={onMouseEnter}
    >
      <ListItemText>{children}</ListItemText>
    </ListItem>
  );
};
export default LinkButton;
