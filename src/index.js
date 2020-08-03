import React from "react";
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "@apollo/react-hooks";
import {
  InMemoryCache,
  IntrospectionFragmentMatcher
} from "apollo-cache-inmemory";
import Routes from "./components/Routes";
import Config from "./wpconfig";
// import { render } from "@wordpress/element";
import ReactDOM from "react-dom";
import * as serviceWorker from "./serviceWorker";
import introspectionQueryResultData from "./fragmentTypes.json";

// https://www.apollographql.com/docs/react/v2.5/advanced/fragments/#fragments-on-unions-and-interfaces
const fragmentMatcher = new IntrospectionFragmentMatcher({
  introspectionQueryResultData
});

// Apollo client 1
const client = new ApolloClient({
  uri: Config.wpUrl,
  cache: new InMemoryCache({ fragmentMatcher })
});

const App = () => {
  return (
    <ApolloProvider client={client}>
      <div>
        <Routes />
      </div>
    </ApolloProvider>
  );
};
ReactDOM.render(<App />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
