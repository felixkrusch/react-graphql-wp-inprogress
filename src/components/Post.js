import React from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import ReactHtmlParser from "react-html-parser";
import Comments from "./Comments";
import { node } from "prop-types";

//post query updated
const POST_QUERY = gql`
  query Post($id: ID!) {
    post(id: $id, idType: SLUG) {
      databaseId
      title(format: RENDERED)
      content(format: RENDERED)
      commentStatus
      tags {
        nodes {
          name
        }
      }
      categories {
        nodes {
          name
        }
      }
      author {
        node {
          description
          name
          uri
          avatar {
            url
          }
        }
      }
    }
  }
`;
const Author = ({ author }) => {
  const node = author.node;
  const avatar = node.avatar;
  return (
    <div>
      <h3>About Author</h3>
      {node.description && (
        <Link to={node.uri}>
          <img src={avatar.url} alt={"author picture"} />
          <div>{node.name}</div>
          <div>{node.description}</div>
        </Link>
      )}
    </div>
  );
};
const Post = () => {
  const { slug } = useParams();
  const { loading, error, data } = useQuery(POST_QUERY, {
    variables: { id: slug }
  });
  if (loading) return <p>Loading Post Content...</p>;
  if (error) return <p>Something wrong happened!</p>;
  const post = data.post;
  return (
    <div>
      <h3>{post && post.title}</h3>
      <div>{ReactHtmlParser(post && post.content)}</div>
      <Author author={post.author} />
      <Tags tags={post.tags} />
      <Categories categories={post.categories} />
      <Comments
        contentId={post.databaseId}
        commentStatus={post.commentStatus}
      />
    </div>
  );
};
const Tags = ({ tags }) => {
  return (
    <div>
      <h3>Tags</h3>
      {tags.nodes.map(tag => (
        <div>
          <p>{tag.name}</p>
        </div>
      ))}
    </div>
  );
};
const Categories = ({ categories }) => {
  return (
    <div>
      <h3>Categories</h3>
      {categories.nodes.map(category => (
        <div>
          <p>{category.name}</p>
        </div>
      ))}
    </div>
  );
};
export default Post;
