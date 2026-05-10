import { useState, useEffect } from 'react';
import { searchUsers } from '../services/userService';

export function useSearch(delay = 300) {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // If empty string, don't ping backend
    if (!searchTerm.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    setError(null);

    // Set up a timer to debounce
    const handler = setTimeout(async () => {
      try {
        const users = await searchUsers(searchTerm);
        setResults(users);
      } catch (err) {
        console.error("Hook search error:", err);
        setError("Failed to fetch search results.");
      } finally {
        setLoading(false);
      }
    }, delay);

    // Cancel timer if searchTerm changes again before `delay` is reached
    return () => clearTimeout(handler);
  }, [searchTerm, delay]);

  return {
    searchTerm,
    setSearchTerm,
    results,
    loading,
    error,
    clearSearch: () => {
      setSearchTerm('');
      setResults([]);
    }
  };
}
