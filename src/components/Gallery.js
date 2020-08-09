import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import ReactHtmlParser from "react-html-parser";
import queryString from "query-string";

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
  const [ids, setIds] = useState([]);

  const history = useHistory();
  const { location } = history;
  const { loading, error, data } = useQuery(GALLERY_QUERY, {
    variables: { id }
  });
  useEffect(() => {
    const { i } = queryString.parse(location.search);
    const ids = window.atob(i);
    setIds(ids.split(","));
  }, [location.search]);
  if (loading) return <p>Loading Gallery Content...</p>;
  if (error) return <p>Something wrong happened!</p>;
  // destructuring data
  const handleNext = () => {
    const currentIndex = ids.indexOf(id);
    const newIndex = (currentIndex + 1) % ids.length;
    history.push(`/post-format-gallery/${ids[newIndex]}${location.search}`);
  };
  const handlePrev = () => {
    const currentIndex = ids.indexOf(id);
    const newIndex = currentIndex
      ? (currentIndex - 1) % ids.length
      : ids.length - 1;
    history.push(`/post-format-gallery/${ids[newIndex]}${location.search}`);
  };
  const { mediaItem } = data;
  return (
    <div>
      Gallery
      <figure>
        <div>{mediaItem.title}</div>
        <img src={mediaItem.mediaItemUrl} alt={mediaItem.altText} />
        <figcaption>{ReactHtmlParser(mediaItem.caption)}</figcaption>
      </figure>
      <div>
        <button onClick={handlePrev}>Previous</button>
        <button onClick={handleNext}>Next</button>
      </div>
    </div>
  );
};

export default Gallery;
