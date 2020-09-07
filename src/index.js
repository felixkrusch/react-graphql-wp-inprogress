import React from "react";
// import ReactDomServer from "react-dom/server";
import ReactDom from "react-dom";

import * as serviceWorker from "./serviceWorker";
import "./index.css";
import App from "./App";
// import { Helmet } from "react-helmet";
// ReactDomServer.renderToString(<App />);
ReactDom.render(<App />, document.getElementById("root"));

// const helmetMetadata = Helmet.rewind();

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
