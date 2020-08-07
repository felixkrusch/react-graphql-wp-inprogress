import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import ReactHtmlParser from "react-html-parser";

//pages query updated
const GALLERY_QUERY = gql`
  query Gallery($id: ID!) {
    mediaItem(id: $id, idType: DATABASE_ID) {
      id
      title
      caption
      mediaItemUrl
      altText
    }
  }
`;

const Gallery = () => {
  const { id } = useParams();

  const { loading, error, data } = useQuery(GALLERY_QUERY, {
    variables: { id }
  });
  if (loading) return <p>Loading Gallery Content...</p>;
  if (error) return <p>Something wrong happened!</p>;

  // destructuring data
  const { mediaItem } = data;
  console.log("mediaItem page", mediaItem);
  console.log(mediaItem);
  return (
    <div>
      Gallery
      <figure>
        <div>{mediaItem.title}</div>
        <img src={mediaItem.mediaItemUrl} alt={mediaItem.altText} />
        <figcaption>{ReactHtmlParser(mediaItem.caption)}</figcaption>
      </figure>
    </div>
  );
};

export default Gallery;
