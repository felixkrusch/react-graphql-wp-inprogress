import React from "react";
import { useParams, useHistory, Link } from "react-router-dom";
import { useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import ReactHtmlParser from "react-html-parser";
import Comments from "./Comments";
import { baseUrl } from "../wpconfig";
import { Helmet } from "react-helmet";
import Loading from "./Loading/Loading";

const PAGE_QUERY = gql`
  query Page($id: ID!) {
    allSettings {
      generalSettingsTitle
    }
    page(id: $id, idType: URI) {
      databaseId
      title
      content
      commentStatus
      date
      # excerpt
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
      excerpt
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
const Page = ({ onHeadUpdate }) => {
  const { slug, slugChild } = useParams();
  const history = useHistory();
  // creating complete slug path
  const path = `${slug}/${slugChild ? slugChild : ""}`;
  const { loading, error, data } = useQuery(PAGE_QUERY, {
    variables: { id: path, search: "" }
  });

  if (loading) return <Loading />;
  if (error) return <p>Something wrong happened!</p>;
  // destructuring data
  const page = data.page || data.post;
  const { allSettings } = data;
  const handleClick = e => {
    const { target } = e;
    const hasParentAnchor = target.parentElement.tagName === "A";
    const dataId = target.getAttribute("data-id");
    if (dataId && hasParentAnchor) {
      e.preventDefault();
      const parent = target.parentElement;
      if (!parent.href.includes("post-format-gallery")) return;
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
    <div className="page">
      <Helmet>
        <meta
          property="og:title"
          content={`${page.title} - ${allSettings.generalSettingsTitle}`}
        />
        <meta property="og:description" content={page.excerpt} />
        {page.tags && (
          <meta
            name="keywords"
            content={`${page.tags.nodes.map(({ name }) => name)}`}
          />
        )}
      </Helmet>
      <h3 className="title">{page.title}</h3>
      <div>{page.date}</div>

      <div onClick={handleClick}>
        {ReactHtmlParser(replaceUrl(page.content))}
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
    <div className="page-author">
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
    <div className="page-tags">
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
    <div className="page-categories">
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
