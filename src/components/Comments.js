import React, { useState } from "react";
import { gql, useQuery, useMutation } from "@apollo/client";
import ReactHtmlParser from "react-html-parser";
import Loading from "./Loading/Loading";
import { TextField, Button } from "@material-ui/core";

//comment query updated

const COMMETS_QUERY = gql`
  #  fragment CommentFields on Comment {
  #    id
  #    date
  #    content
  #    parent {
  #      node {
  #        id
  #      }
  #    }
  #    author {
  #      node {
  #        name
  #        url
  #        email
  #        ... on User {
  #          avatar(size: 60) {
  #            url
  #            width
  #            height
  #          }
  #        }
  #      }
  #    }
  #  }

  query Comments($contentId: ID!) {
    comments(where: { contentId: $contentId, parentIn: "" }, first: 100) {
      nodes {
        id
        replies {
          nodes {
            id
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
            url
            name
          }
        }
      }
    }
  }
`;

const COMMET_QUERY = gql`
  fragment CommentField on Comment {
    id
    date
    content
    author {
      node {
        name
        url
        email
        ... on User {
          avatar(size: 60) {
            url
            width
            height
          }
        }
      }
    }
  }

  query Comment($id: ID!) {
    comment(id: $id) {
      ...CommentField
      replies {
        nodes {
          id
        }
      }
    }
  }
`;

const Comment = ({ node: { id }, contentId, level }) => {
  const [isReply, setIsReply] = useState(false);
  const { loading, error, data } = useQuery(COMMET_QUERY, {
    variables: { id }
  });
  if (loading) return <Loading />;
  if (error) return <p>Something wrong happened!</p>;
  const { title, content, replies, date, author } = data.comment;

  const node = author.node || {};
  const avatar = node.avatar || {};
  const authorUrl = node.url;

  return (
    <li>
      {/* {id} */}
      {node.avatar && (
        <img
          alt="author-pic"
          style={{ borderRadius: "50%" }}
          src={avatar.url}
          width={avatar.width}
          height={avatar.height}
        />
      )}

      <a href={authorUrl ? authorUrl : null}>{node.name}</a>
      <br />
      {level < 5 && (
        <Button
          variant="contained"
          color="primary"
          onClick={() => setIsReply(true)}
        >
          Reply
        </Button>
      )}
      {isReply && <CreateComment contentId={contentId} parentId={id} />}
      <div>{title}</div>
      <div>{date}</div>
      <div>{ReactHtmlParser(content)}</div>
      {replies && (
        <ul>
          {replies.nodes.map(node => (
            <Comment
              key={node.id}
              node={node}
              contentId={contentId}
              level={level + 1}
            />
          ))}
        </ul>
      )}
    </li>
  );
};

const Comments = ({ contentId, commentStatus }) => {
  const { loading, error, data } = useQuery(COMMETS_QUERY, {
    variables: { contentId }
  });
  if (loading) return <Loading />;
  if (error) return <p>Something wrong happened!</p>;

  const comments = data.comments;
  return (
    <div className="page-comments">
      {commentStatus === "open" && <CreateComment contentId={contentId} />}
      <ul>
        {comments.nodes.map(node => (
          <Comment key={node.id} node={node} contentId={contentId} level={1} />
        ))}
      </ul>
    </div>
  );
};

const CreateComment = ({ contentId, parentId }) => {
  const [addComment, { data }] = useMutation(CREATE_COMMENT);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const handleSubmit = e => {
    e.preventDefault();
    const parent = parentId ? window.atob(parentId).split(":")[1] : 0;
    addComment({
      variables: {
        input: {
          parent,
          commentOn: contentId,
          clientMutationId: `${parentId}`,
          content: message,
          author: name,
          authorEmail: email,
          authorUrl: url
        }
      }
    });
  };
  // if (loading) return <Loading />;
  // if (error) return <p>Something wrong happened in comments!</p>;

  return (
    <form className="comment-form">
      <h3 className="comment-reply-title">Write a Comment</h3>

      <p className="comment-notes">
        <span id="email-notes">Your email address will not be published.</span>
        Required fields are marked <span className="required">*</span>
      </p>
      <p className="comment-form-comment">
        <TextField
          variant="outlined"
          fullWidth
          placeholder="* Message"
          rows="8"
          multiline
          value={message}
          aria-required="true"
          onChange={({ target: { value } }) => setMessage(value)}
        ></TextField>
      </p>
      <div className="comment-form-column-wrapper">
        <p className="comment-form-author comment-form-column">
          <TextField
            placeholder="* Name"
            fullWidth
            variant="outlined"
            type="text"
            value={name}
            aria-required="true"
            onChange={({ target: { value } }) => setName(value)}
          />
        </p>
        <p className="comment-form-email comment-form-column">
          <TextField
            placeholder="* Email"
            fullWidth
            variant="outlined"
            type="text"
            value={email}
            aria-required="true"
            onChange={({ target: { value } }) => setEmail(value)}
          />
        </p>
        <p className="comment-form-url comment-form-column">
          <TextField
            variant="outlined"
            fullWidth
            value={url}
            placeholder="Website"
            type="text"
            onChange={({ target: { value } }) => setUrl(value)}
          />
        </p>
      </div>
      <p className="form-submit">
        <Button
          color="primary"
          variant="contained"
          className="submit"
          onClick={handleSubmit}
        >
          Submit Comment
        </Button>
      </p>
      {data && (
        <p style={{ color: "red" }}>Your comment is awaiting moderation.</p>
      )}
    </form>
  );
};

export default Comments;
