import React from "react";
import { useParams, useHistory } from "react-router-dom";
import { useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import ReactHtmlParser from "react-html-parser";

//post query updated

const POST_PAGE_QUERY = gql`
  {
    contentTypes {
      nodes {
        name
        contentNodes {
          nodes {
            slug
            uri
            ... on Page {
              id
              uri
              slug
            }
            ... on MediaItem {
              id
              slug
              uri
            }
            ... on Post {
              id
              uri
              slug
            }
          }
        }
      }
    }
  }
`;

const PostPage = () => {
  // const { slug } = useParams();
  const {
    location: { pathname }
  } = useHistory();
  const { loading, error, data } = useQuery(POST_PAGE_QUERY);
  if (loading) return <p>Loading Post Content ......</p>;
  if (error) return <p>Something wrong happened!</p>;
  // console.log("data...", data, pathname);

  const {
    contentTypes: { nodes }
  } = data;
  const filterNode = nodes.filter(
    node =>
      node.contentNodes.nodes.filter(cNode => {
        return cNode.uri.slice(0, cNode.uri.length - 1);
      }).length > 0
  );
  // console.log(filterNode);
  return <div>post page</div>;
};

export default PostPage;
