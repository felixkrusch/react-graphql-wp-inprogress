import { useState } from "react";

export const muiTheme = {
  palette: {
    type: "light"
  }
};

export const useDarkMode = () => {
  const [theme, setTheme] = useState(muiTheme);
  const {
    palette: { type }
  } = theme;
  const toggleDarkMode = () => {
    const updatedTheme = {
      ...theme,
      palette: {
        ...theme.palette,
        type: type === "light" ? "dark" : "light"
      }
    };
    setTheme(updatedTheme);
  };
  return { theme, toggleDarkMode };
};
