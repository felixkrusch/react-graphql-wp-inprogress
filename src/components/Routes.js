import React from "react";
import { Switch, Route, BrowserRouter } from "react-router-dom";
import Posts from "./Posts";
import Tag from "./Tag";
import Category from "./Category";
import Header from "./Header";
import AuthorArchive from "./AuthorArchive";
import Gallery from "./Gallery";
import Page from "./Page";

export default () => (
  // You need to wrap the Switch with BrowserRouter
  <BrowserRouter>
    <div>
      <Header />

      <Switch>
        <Route exact path="/" component={Posts} />
        <Route path="/author/:slug?" component={AuthorArchive} />
        <Route path="/tag/:slug?" component={Tag} />
        <Route path="/category/:slug?" component={Category} />
        <Route exact path="/post-format-gallery/:id" component={Gallery} />
        <Route exact path="/:slug/:slugChild?" component={Page} />
      </Switch>
    </div>
  </BrowserRouter>
);
