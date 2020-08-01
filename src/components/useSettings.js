const { gql } = require("apollo-boost");
const { useQuery } = require("@apollo/react-hooks");

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
