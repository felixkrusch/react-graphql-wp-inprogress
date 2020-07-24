import React from "react";
import { Switch, Route, BrowserRouter } from "react-router-dom";
import Posts from "./Posts";
import Post from "./Post";
import Page from "./Page";
import Header from "./Header";

export default () => (
  // You need to wrap the Switch with BrowserRouter
  <BrowserRouter>
    <div>
      <Header />

      <Switch>
        <Route exact path="/" component={Posts} />
        <Route exact path="/post/:slug" component={Post} />
        <Route path="/page/:slug/:slugChild?" component={Page} />
      </Switch>
    </div>
  </BrowserRouter>
);
