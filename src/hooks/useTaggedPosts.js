import { useState, useEffect } from 'react';

const MOCK_DB_TAGGED = [
  { 
    id: 't1', 
    postId: 'p10', 
    taggedUserId: 'user_1', 
    post: { id: 'p10', image: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?q=80&w=500&auto=format&fit=crop", likes: 451, comments: 22 } 
  },
  { 
    id: 't2', 
    postId: 'p11', 
    taggedUserId: 'user_1', 
    post: { id: 'p11', image: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?q=80&w=500&auto=format&fit=crop", likes: 902, comments: 115 } 
  },
];

export function useTaggedPosts(userId = 'user_1') {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate Firebase fetch
    setLoading(true);
    setTimeout(() => {
      const tagged = MOCK_DB_TAGGED.filter(t => !userId || t.taggedUserId === userId).map(t => t.post);
      setPosts(tagged);
      setLoading(false);
    }, 400);
  }, [userId]);

  return { posts, loading };
}
