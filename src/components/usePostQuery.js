import { useEffect, useState } from "react";
import { useSettings } from "./useSettings";

export const usePostQuery = ({ query, variables }) => {
  const [
    postsQuery,
    { loading: isPostLoading, error: isPostError, data }
  ] = query;
  const [postsPerPage, setPostPerPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const {
    data: settingsData,
    loading: isSettingsLoading,
    error: isSettingError
  } = useSettings();
  useEffect(() => {
    if (!settingsData) return;
    const info = {
      last: null,
      after: null,
      before: null,
      first: settingsData.allSettings.readingSettingsPostsPerPage,
      ...variables
    };
    setPostPerPage(settingsData.allSettings.readingSettingsPostsPerPage);
    postsQuery({ variables: info });
  }, [settingsData]);

  useEffect(() => {
    if (!data) return;
    setLoading(false);
  }, [data]);

  return { data, loading, error: isPostError || isSettingError, postsPerPage };
};
