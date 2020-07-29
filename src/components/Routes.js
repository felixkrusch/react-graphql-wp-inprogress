import React from "react";
import { Switch, Route, BrowserRouter } from "react-router-dom";
import Posts from "./Posts";
import Tag from "./Tag";
import Category from "./Category";
import PostPage from "./PostPage";
import Header from "./Header";

export default () => (
  // You need to wrap the Switch with BrowserRouter
  <BrowserRouter>
    <div>
      <Header />

      <Switch>
        <Route exact path="/" component={Posts} />

        <Route path="/tag/:slug?" component={Tag} />
        <Route path="/category/:slug?" component={Category} />
        <Route exact path="/:slug/:slugChild?" component={PostPage} />
      </Switch>
    </div>
  </BrowserRouter>
);
