import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { gql, useQuery } from "@apollo/client";
import ReactHtmlParser from "react-html-parser";
import queryString from "query-string";
import Loading from "./Loading/Loading";
import { Button } from "@material-ui/core";

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
  if (loading) return <Loading />;
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
      <h3>Gallery</h3>
      <figure>
        <div>{mediaItem.title}</div>
        <img src={mediaItem.mediaItemUrl} alt={mediaItem.altText} />
        <figcaption>{ReactHtmlParser(mediaItem.caption)}</figcaption>
      </figure>
      <div>
        <Button variant="contained" color="primary" onClick={handlePrev}>
          Previous
        </Button>
        &nbsp;
        <Button variant="contained" color="primary" onClick={handleNext}>
          Next
        </Button>
      </div>
    </div>
  );
};

export default Gallery;
