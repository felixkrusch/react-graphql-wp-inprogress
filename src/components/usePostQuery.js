import { useEffect, useState } from "react";
import { useSettings } from "./useSettings";

export const usePostQuery = ({ query, variables, search }) => {
  const [postsQuery, { error: isPostError, data }] = query;
  const [postsPerPage, setPostPerPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const { data: settingsData, error: isSettingError } = useSettings();
  useEffect(() => {
    if (!settingsData) return;
    const info = {
      last: null,
      after: null,
      before: null,
      first: settingsData.allSettings.readingSettingsPostsPerPage,
      ...variables,
      search
    };
    setLoading(true);
    setPostPerPage(settingsData.allSettings.readingSettingsPostsPerPage);
    postsQuery({ variables: info });
  }, [settingsData, search]);

  useEffect(() => {
    if (!data) {
      setLoading(true);
      return;
    }
    setLoading(false);
  }, [data]);

  return { data, loading, error: isPostError || isSettingError, postsPerPage };
};
