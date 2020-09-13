import React from "react";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import { IntrospectionFragmentMatcher } from "apollo-cache-inmemory";
import Config from "./wpconfig";
import introspectionQueryResultData from "./fragmentTypes.json";
import { ThemeProvider } from "@material-ui/core";
import { createMuiTheme } from "@material-ui/core";
import MuiDrawer from "./components/MuiDrawer/MuiDrawer";
import { BrowserRouter } from "react-router-dom";
import { useDarkMode } from "./muiTheme";

// https://www.apollographql.com/docs/react/v2.5/advanced/fragments/#fragments-on-unions-and-interfaces
const fragmentMatcher = new IntrospectionFragmentMatcher({
  introspectionQueryResultData
});
const client = new ApolloClient({
  uri: Config.wpUrl,
  cache: new InMemoryCache({ fragmentMatcher })
});
const App = () => {
  const { theme, toggleDarkMode } = useDarkMode();
  const themeConfig = createMuiTheme(theme);
  return (
    <ThemeProvider theme={themeConfig}>
      <ApolloProvider client={client}>
        <BrowserRouter>
          <MuiDrawer toggleDarkMode={toggleDarkMode} />
        </BrowserRouter>
      </ApolloProvider>
    </ThemeProvider>
  );
};

export default App;
