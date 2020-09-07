import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";

const Head = ({ metaInfo }) => {
  const { allSettings, getCustomizations } = metaInfo;
  return (
    <Helmet>
      <link rel="icon" href={getCustomizations?.siteiconurl} sizes="32x32" />
      <link rel="icon" href={getCustomizations?.siteiconurl} sizes="192x192" />
      <link
        rel="apple-touch-icon-precomposed"
        href={getCustomizations?.siteiconurl}
      />
      <title>{allSettings?.generalSettingsTitle}</title>
      <meta property="og:title" content={allSettings?.generalSettingsTitle} />
      <meta
        property="og:description"
        content={allSettings?.generalSettingsDescription}
      />
    </Helmet>
  );
};

export default Head;
