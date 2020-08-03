import React from "react";
import { useHistory, Switch, Route } from "react-router-dom";
import { useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import Page from "./Page";
import Post from "./Post";
import { get } from "lodash";

//post query updated

const POST_PAGE_QUERY = gql`
  {
    contentTypes {
      nodes {
        name
        contentNodes(first: 100) {
          nodes {
            uri
            #  ... on Page {
            #    uri
            #  }
            #  ... on MediaItem {
            #    uri
            #  }
            #  ... on Post {
            #    uri
            #  }
          }
        }
      }
    }
  }
`;

const PostPage = () => {
  const {
    location: { pathname }
  } = useHistory();
  const { loading, error, data } = useQuery(POST_PAGE_QUERY);
  if (loading) return <p>Loading Post Content ......</p>;
  if (error) return <p>Something wrong happened!</p>;
  // console.log("post page data...", data, pathname);

  const {
    contentTypes: { nodes }
  } = data;
  // find if the pathname is available in nodes
  const filterNode = nodes
    .map(node => {
      const n = node.contentNodes.nodes.filter(
        cNode => cNode.uri.slice(0, cNode.uri.length) === pathname
      );
      return {
        ...node,
        contentNodes: {
          nodes: n
        }
      };
    })
    .filter(node => node.contentNodes.nodes.length > 0);
  // if post available in node
  const isPost = get(filterNode, "[0].name") === "post";
  // console.log("filter.", filterNode, nodes);
  return (
    <div>
      <Switch>
        <Route
          path="/:slug/:slugChild?"
          component={isPost ? Post : Page}
        ></Route>
      </Switch>
    </div>
  );
};

export default PostPage;
