import React, { useState } from "react";
import { Switch, Route } from "react-router-dom";
import Posts from "./Posts";
import Tag from "./Tag";
import Category from "./Category";
import AuthorArchive from "./AuthorArchive";
import Gallery from "./Gallery";
import Page from "./Page";
import Footer from "./Footer";
import Head from "./MuiDrawer/Header/Head";

export default () => {
  const [metaInfo, setMetaInfo] = useState({});
  return (
    <>
      <Head metaInfo={metaInfo} />
      <Switch>
        <Route
          exact
          path="/"
          component={() => <Posts onHeadUpdate={setMetaInfo} />}
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
