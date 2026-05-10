import { useState, useEffect } from 'react';
import { getUsersByIds } from '../services/userService';

/**
 * Hook to manage fetching and state for a list of users (Followers/Following)
 * @param {Array} userIds - List of UIDs to fetch
 */
export function useFollowList(userIds) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // We stringify the userIds array to create a stable dependency.
  // This prevents infinite re-renders if the parent passes a new array reference [] on every render.
  const serializedIds = JSON.stringify(userIds || []);

  useEffect(() => {
    const fetchUsers = async () => {
      const ids = JSON.parse(serializedIds);
      
      if (!ids || ids.length === 0) {
        setUsers([]);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const data = await getUsersByIds(ids);
        setUsers(data);
      } catch (err) {
        console.error("Failed to fetch follow list:", err);
        setError("Failed to load users.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [serializedIds]);

  return { users, loading, error };
}
