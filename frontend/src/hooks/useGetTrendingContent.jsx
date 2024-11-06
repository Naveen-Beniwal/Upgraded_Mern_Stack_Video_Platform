import { useEffect, useState } from "react";
import { useContentStore } from "../store/content";
import axios from "axios";

const useGetTrendingContent = () => {
  const [trendingContent, setTrendingContent] = useState(null);
  const [loading, setLoading] = useState(true); // Track loading state
  const [error, setError] = useState(null); // Track error state
  const { contentType } = useContentStore();

  useEffect(() => {
    const getTrendingContent = async () => {
      setLoading(true); // Set loading to true before making the request
      setError(null); // Reset any previous error

      const start = performance.now(); // Start measuring performance
      try {
        const res = await axios.get(`/api/v1/${contentType}/trending`);
        setTrendingContent(res.data.content);
      } catch (err) {
        setError(err); // Set error state if the request fails
        console.error("Error fetching trending content:", err); // Log error
      } finally {
        const end = performance.now(); // End measuring performance
        setLoading(false); // Set loading to false after the request completes
        console.log(
          `Fetching trending content took ${end - start} milliseconds`
        );
      }
    };

    getTrendingContent();
  }, [contentType]);

  return { trendingContent, loading, error }; // Return loading and error states
};

export default useGetTrendingContent;
