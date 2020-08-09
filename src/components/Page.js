import React from "react";
import { useParams, useHistory, Link } from "react-router-dom";
import { useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import ReactHtmlParser from "react-html-parser";
import Comments from "./Comments";
import { baseUrl } from "../wpconfig";

const PAGE_QUERY = gql`
  query Page($id: ID!) {
    page(id: $id, idType: URI) {
      databaseId
      title
      content
      commentStatus
      template {
        ... on FullWidthTemplate {
          templateName
        }
      }
    }
    post(id: $id, idType: SLUG) {
      databaseId
      title(format: RENDERED)
      content(format: RENDERED)
      commentStatus

      template {
        ... on FullWidthTemplate {
          templateName
        }
      }
      tags {
        nodes {
          id
          name
        }
      }
      categories {
        nodes {
          id
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
export const replaceUrl = url => {
  return url.replace(new RegExp(`href="${baseUrl}`, "g"), `href="`);
};
const Page = () => {
  const { slug, slugChild } = useParams();
  const history = useHistory();
  // creating complete slug path
  const path = `${slug}/${slugChild ? slugChild : ""}`;
  const { loading, error, data } = useQuery(PAGE_QUERY, {
    variables: { id: path }
  });
  if (loading) return <p>Loading Page Content...</p>;
  if (error) return <p>Something wrong happened!</p>;
  console.log(data);
  // destructuring data
  const page = data.page || data.post;
  const handleClick = e => {
    const { target } = e;
    const hasParentAnchor = target.parentElement.tagName === "A";
    const dataId = target.getAttribute("data-id");
    if (dataId && hasParentAnchor) {
      e.preventDefault();
      const parentUl = target.closest("ul");
      const images = parentUl.querySelectorAll("img");
      const imagesDataIds = Array.from(images).map(img =>
        img.getAttribute("data-id")
      );
      history.push(
        `/post-format-gallery/${dataId}?i=${window.btoa(imagesDataIds)}`
      );
    }
    const hasAnchor = target.tagName === "A";
    if (hasAnchor) {
      const regPdf = new RegExp("^.+.(([pP][dD][fF]))$");
      if (regPdf.test(target.href)) {
        e.preventDefault();
        target.href = `${baseUrl}${target.pathname}`;
        window.open(target.href);
      }
    }
  };

  return (
    <div>
      <h3>{page && page.title}</h3>
      {/* <div>
        {contentParser({ content: page.content }, { wordPressUrl: baseUrl })}
      </div> */}
      <div onClick={handleClick}>
        {ReactHtmlParser(replaceUrl(page && page.content))}
      </div>
      {page.author && <Author author={page.author.node} link />}
      {page.tags && <Tags tags={page.tags} />}
      {page.categories && <Categories categories={page.categories} />}
      <Comments
        contentId={page.databaseId}
        commentStatus={page.commentStatus}
      />
    </div>
  );
};

export const Author = ({ author, link }) => {
  const avatar = author.avatar;
  return (
    <div>
      <h3>About Author</h3>
      {author.description && (
        <div>
          <img src={avatar.url} alt={"author picture"} />
          <div>{author.name}</div>
          <div>{author.description}</div>
          {link && <Link to={author.uri}>More from this Author</Link>}
        </div>
      )}
    </div>
  );
};

const Tags = ({ tags }) => {
  return (
    <div>
      <h3>Tags</h3>
      {tags.nodes.map(tag => (
        <div key={tag.id}>
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
        <div key={category.id}>
          <p>{category.name}</p>
        </div>
      ))}
    </div>
  );
};
export default Page;
