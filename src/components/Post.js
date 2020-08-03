import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import ReactHtmlParser from "react-html-parser";
import Comments from "./Comments";

//post query updated
const POST_QUERY = gql`
  query Post($id: ID!) {
    post(id: $id, idType: SLUG) {
      databaseId
      title(format: RENDERED)
      content(format: RENDERED)
    }
  }
`;

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
      <Comments contentId={post.databaseId} />
      {/* //comment list show avatar / name (link date to URL if it exists) / date
      /comment (max. comment deptp: 2) // comment reply */}
      {/* <h3 id="reply-title" class="comment-reply-title">
        Write a Comment
      </h3> */}
      {/* <form
        action="https://demo.richwp.com/wp-comments-post.php"
        method="post"
        id="commentform"
        class="comment-form"
        novalidate
      >
        <p class="comment-notes">
          <span id="email-notes">
            Your email address will not be published.
          </span>{" "}
          Required fields are marked <span class="required">*</span>
        </p>
        <p class="comment-form-comment">
          <textarea
            id="comment"
            name="comment"
            placeholder="* Message"
            rows="8"
            aria-required="true"
          ></textarea>
        </p>
        <div class="comment-form-column-wrapper">
          <p class="comment-form-author comment-form-column">
            <input
              id="author"
              name="author"
              placeholder="* Name"
              type="text"
              value=""
              aria-required="true"
            />
          </p>
          <p class="comment-form-email comment-form-column">
            <input
              id="email"
              name="email"
              placeholder="* Email"
              type="text"
              value=""
              aria-required="true"
            />
          </p>
          <p class="comment-form-url comment-form-column">
            <input
              id="url"
              name="url"
              placeholder="Website"
              type="text"
              value=""
            />
          </p>
        </div>
        <p class="form-submit">
          <input
            name="submit"
            type="submit"
            id="submit"
            class="submit"
            value="Submit Comment"
          />{" "}
          <input
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
          />
        </p>
      </form> */}
    </div>
  );
};

export default Post;
