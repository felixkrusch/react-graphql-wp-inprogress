import React, { useState } from "react";
import { Switch, Route } from "react-router-dom";
import Posts from "./Posts";
import Tag from "./Tag";
import Category from "./Category";
import AuthorArchive from "./AuthorArchive";
import Gallery from "./Gallery";
import Page from "./Page";
import Footer from "./Footer";
import Head from "./MuiDrawer/Navigation/Head";

export default () => {
  const [activePage, setActivePage] = useState("");
  return (
    <>
      {activePage === "posts" && <Head />}
      <Switch>
        <Route
          exact
          path="/"
          component={() => <Posts onActivePage={setActivePage} />}
        />
        <Route path="/author/:slug?" component={AuthorArchive} />
        <Route path="/tag/:slug?" component={Tag} />
        <Route path="/category/:slug?" component={Category} />
        <Route exact path="/post-format-gallery/:id" component={Gallery} />
        <Route exact path="/:slug/:slugChild?" component={Page} />
      </Switch>
      <Footer />
    </>
  );
};
