import { useState, useEffect } from 'react';
/**
 * getFetch - Uses the fetch library to make API call's and store the status, status Text, data, error and loading information.
 * @param {string} url - URL for fetch call
 * @param {*} options - Options for Fetch API
 * @returns {Promise<Object>} The data from the URL.
 */
const getFetch = (url, options = {}) => {
  const [status, setStatus] = useState(0);
  const [statusText, setStatusText] = useState('');
  const [data, setData] = useState();
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(url, options);
      const json = await response.json();
      setStatus(response.status);
      setStatusText(response.statusText);
      setData(json);
    } catch (error) {
      setError(error);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);
  return { status, statusText, data, error, loading };
};

export default getFetch;
