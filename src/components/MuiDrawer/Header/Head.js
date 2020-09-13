import React from "react";
import { Helmet } from "react-helmet";
import { gql, useQuery } from "@apollo/client";

const HEAD_QUERY = gql`
  {
    getCustomizations {
      siteiconurl
      frontpagedescription
    }
    allSettings {
      generalSettingsDescription
      generalSettingsTitle
    }
  }
`;

const STICKY_POSTS_QUERY = gql`
  query stickyPosts {
    stickyPosts: posts(where: { onlySticky: true }) {
      nodes {
        databaseId
        title(format: RENDERED)
        excerpt
        author {
          node {
            name
          }
        }
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
      }
    }
  }
`;
const Head = () => {
  const { data: headData, loading: hLoading, error: hError } = useQuery(
    HEAD_QUERY
  );
  const { data: stickeyPostData, loading: sLoading, error: sError } = useQuery(
    STICKY_POSTS_QUERY
  );
  if (hLoading || hError || sError || sLoading) return null;

  const { getCustomizations, allSettings } = headData;
  const { stickyPosts } = stickeyPostData;
  const features = stickyPosts.nodes?.filter(n => n.featuredImage)[0];
  return (
    <Helmet>
      <link rel="icon" href={getCustomizations?.siteiconurl} sizes="32x32" />
      <link rel="icon" href={getCustomizations?.siteiconurl} sizes="192x192" />
      <link
        rel="apple-touch-icon-precomposed"
        href={getCustomizations?.siteiconurl}
      />
      <title>{allSettings?.generalSettingsTitle}</title>
      <meta
        name="description"
        content={allSettings?.generalSettingsDescription}
      />
      <meta property="og:title" content={allSettings?.generalSettingsTitle} />
      <meta
        property="og:description"
        content={allSettings?.generalSettingsDescription}
      />
      <script type="application/ld+json">
        {`{
          "@context": "https://schema.org/",
          "@type": "Website",
          "name": "${features?.title}",
          "author": "${features?.author?.node?.name}",
          "image": ["${features?.featuredImage?.node?.sourceUrl}"],
          "description": "${features?.excerpt}"
        }`}
      </script>
    </Helmet>
  );
};

export default Head;
