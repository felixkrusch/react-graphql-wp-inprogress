import React from "react";
import { useParams, Link } from "react-router-dom";
import { gql, useLazyQuery } from "@apollo/client";
import { getUrl } from "./MuiDrawer/Navigation/Navigation";
import { Pagination } from "./Posts";
import { usePostQuery } from "./usePostQuery";
import { Helmet } from "react-helmet";
import Loading from "./Loading/Loading";
//post query updated
const CATEGORY_QUERY = gql`
  query Category(
    $id: ID!
    $first: Int
    $last: Int
    $after: String
    $before: String
    $categoryName: String
  ) {
    allSettings {
      generalSettingsTitle
    }
    category(id: $id, idType: SLUG) {
      name
      description
      posts(
        first: $first
        last: $last
        after: $after
        before: $before
        where: { categoryName: $categoryName }
      ) {
        pageInfo {
          hasNextPage
          hasPreviousPage
          startCursor
          endCursor
        }

        nodes {
          databaseId
          title
          date
          link
        }
      }
    }
  }
`;
const updateQuery = (previousResult, { fetchMoreResult }) => {
  return fetchMoreResult.category.posts.nodes.length
    ? fetchMoreResult
    : previousResult;
};
const Category = () => {
  const { slug } = useParams();
  const categoryQuery = useLazyQuery(CATEGORY_QUERY);
  const [, { fetchMore }] = categoryQuery;
  const { loading, data, error, postsPerPage } = usePostQuery({
    query: categoryQuery,
    variables: { id: slug, categoryName: slug }
  });

  if (loading) return <Loading />;
  if (error) return <p>Something wrong happened!</p>;
  const { category, allSettings } = data;
  return (
    <div className="categories">
      <Helmet>
        <title>
          {category.name} - {allSettings.generalSettingsTitle}
        </title>
        <meta name="description" content={category.description} />
        <meta
          property="og:title"
          content={`${category.name} - ${allSettings.generalSettingsTitle}`}
        />
        <meta property="og:description" content={category.description} />
        <script type="application/ld+json">
          {`{
          "@context": "https://schema.org/",
          "@type": "CollectionPage",
          "name": "${category.name}",
          "description": "${category.description}"
        }`}
        </script>
      </Helmet>
      <h3 className="title">{category.name}</h3>
      <div>{category.description}</div>
      <Pagination
        fetchMore={fetchMore}
        posts={category.posts}
        updateQuery={updateQuery}
        postsPerPage={postsPerPage}
      />
      <ul>
        {category.posts.nodes.map(({ title, date, link, databaseId }) => {
          const urlObj = getUrl(link);
          return (
            <li className="category" key={databaseId}>
              <Link to={urlObj.url}>{title}</Link>
              <div>Date: {date}</div>
              <br />
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Category;
