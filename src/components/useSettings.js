import { gql, useQuery } from "@apollo/client";

const SETTING_QUERY = gql`
  {
    allSettings {
      readingSettingsPostsPerPage
    }
  }
`;
export const useSettings = () => {
  const { data, loading, error } = useQuery(SETTING_QUERY);
  return { data, loading, error };
};
