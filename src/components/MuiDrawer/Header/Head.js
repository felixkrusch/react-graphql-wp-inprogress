import React from "react";
import { Helmet } from "react-helmet";

const Head = ({ getCustomizations }) => {
  return (
    <Helmet>
      <link rel="icon" href={getCustomizations.siteiconurl} sizes="32x32" />
      <link rel="icon" href={getCustomizations.siteiconurl} sizes="192x192" />
      <link
        rel="apple-touch-icon-precomposed"
        href={getCustomizations.siteiconurl}
      />

      <link
        rel="alternate"
        type="application/json+oembed"
        href="https://richwp.com/wp-json/oembed/1.0/embed?url=https%3A%2F%2Frichwp.com%2F"
      />
      <link
        rel="alternate"
        type="text/xml+oembed"
        href="https://richwp.com/wp-json/oembed/1.0/embed?url=https%3A%2F%2Frichwp.com%2F&#038;format=xml"
      />
    </Helmet>
  );
};

export default Head;
