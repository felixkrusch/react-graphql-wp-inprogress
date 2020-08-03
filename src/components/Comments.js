import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import ReactHtmlParser from "react-html-parser";

//comment query updated

const COMMETS_QUERY = gql`
  fragment CommentFields on Comment {
    id
    date
    type
    approved
    content
    author {
      node {
        name
      }
    }
  }

  query Comments($contentId: ID!) {
    comments(where: { contentId: $contentId }, first: 100) {
      nodes {
        ...CommentFields
        replies {
          nodes {
            ...CommentFields
          }
        }
      }
    }
  }
`;
const CREATE_COMMENT = gql`
  mutation CREATE_COMMENT($input: CreateCommentInput!) {
    createComment(input: $input) {
      comment {
        id
        content
        author {
          node {
            name
          }
        }
      }
    }
  }
`;
const Comment = ({ node: { title, content, replies, date, author } }) => {
  return (
    <li>
      <b>{author.node.name}</b>
      <div>{title}</div>
      <div>{date}</div>
      <div>{ReactHtmlParser(content)}</div>
      {replies && (
        <ul>
          {replies.nodes.map(node => (
            <Comment key={node.id} node={node} />
          ))}
        </ul>
      )}
    </li>
  );
};

const Comments = ({ contentId }) => {
  const { loading, error, data } = useQuery(COMMETS_QUERY, {
    variables: { contentId }
  });
  if (loading) return <p>Loading Comments Content...</p>;
  if (error) return <p>Something wrong happened!</p>;
  const comments = data.comments;
  return (
    <div>
      {/* //comment list show avatar / name (link date to URL if it exists) / date
      /comment (max. comment deptp: 2) // comment reply */}
      <CreateComment contentId={contentId} />

      <ul>
        {comments.nodes.map(node => (
          <Comment key={node.id} node={node} />
        ))}
      </ul>
    </div>
  );
};

const CreateComment = ({ contentId }) => {
  const [addComment, { data, error, loading }] = useMutation(CREATE_COMMENT);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const handleSubmit = e => {
    e.preventDefault();
    addComment({
      variables: {
        input: {
          parent: 0,
          commentOn: contentId,
          clientMutationId: "CreateComment",
          content: message,
          author: name,
          authorEmail: email,
          authorUrl: url
        }
      }
    });
  };
  if (loading) return <p>Loading creating Comments Content...</p>;
  if (error) return <p>Something wrong happened in comments!</p>;
  return (
    <form className="comment-form">
      <h3 className="comment-reply-title">Write a Comment</h3>

      <p className="comment-notes">
        <span id="email-notes">Your email address will not be published.</span>
        Required fields are marked <span className="required">*</span>
      </p>
      <p className="comment-form-comment">
        <textarea
          placeholder="* Message"
          rows="8"
          value={message}
          aria-required="true"
          onChange={({ target: { value } }) => setMessage(value)}
        ></textarea>
      </p>
      <div className="comment-form-column-wrapper">
        <p className="comment-form-author comment-form-column">
          <input
            placeholder="* Name"
            type="text"
            value={name}
            aria-required="true"
            onChange={({ target: { value } }) => setName(value)}
          />
        </p>
        <p className="comment-form-email comment-form-column">
          <input
            placeholder="* Email"
            type="text"
            value={email}
            aria-required="true"
            onChange={({ target: { value } }) => setEmail(value)}
          />
        </p>
        <p className="comment-form-url comment-form-column">
          <input
            value={url}
            placeholder="Website"
            type="text"
            onChange={({ target: { value } }) => setUrl(value)}
          />
        </p>
      </div>
      <p className="form-submit">
        <button className="submit" onClick={handleSubmit}>
          Submit Comment
        </button>
        {/* <input
          type="hidden"
          name="comment_post_ID"
          value="155"
          id="comment_post_ID"
        />
        <input
          type="hidden"
          name="comment_parent"
          id="comment_parent"
          value="0"
        /> */}
      </p>
    </form>
  );
};

export default Comments;
