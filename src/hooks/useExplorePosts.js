import { useState, useMemo } from 'react';

// { id: 1, caption: "Gaming clip", category: "clips", user: "john", image: "..." }
const MOCK_EXPLORE_POSTS = [
  {
    id: "e1",
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800&auto=format&fit=crop",
    caption: "Cyber City Overlook",
    category: "trending",
    user: "neon_rider99",
    likes: "12.4K",
    comments: "420",
    aspect: "aspect-[4/3]",
  },
  {
    id: "e2",
    image: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?q=80&w=800&auto=format&fit=crop",
    caption: "Neon Nights",
    category: "hot",
    user: "cyber_punk",
    likes: "8.9K",
    comments: "121",
    aspect: "aspect-[3/4]",
  },
  {
    id: "e3",
    image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=800&auto=format&fit=crop",
    caption: "Arcade Final Boss",
    category: "esports",
    user: "arcade_king",
    likes: "25K",
    comments: "889",
    aspect: "aspect-square",
  },
  {
    id: "e4",
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800&auto=format&fit=crop",
    caption: "Retro Console Collector",
    category: "trending",
    user: "retro_fanatic",
    likes: "4.3K",
    comments: "105",
    aspect: "aspect-[4/5]",
  },
  {
    id: "e5",
    image: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?q=80&w=800&auto=format&fit=crop",
    caption: "The Next Generation",
    category: "hot",
    user: "next_gen",
    likes: "56K",
    comments: "4.2K",
    aspect: "aspect-[16/9]",
  },
  {
    id: "e6",
    image: "https://images.unsplash.com/photo-1493711662062-fa541abbe5de?q=80&w=800&auto=format&fit=crop",
    caption: "Synthwave Setup",
    category: "trending",
    user: "synth_lover",
    likes: "7.8K",
    comments: "231",
    aspect: "aspect-[3/4]",
  },
  {
    id: "e7",
    image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=800&auto=format&fit=crop",
    caption: "Glitch Art Framework",
    category: "clips",
    user: "glitch_master",
    likes: "11K",
    comments: "82",
    aspect: "aspect-square",
  },
  {
    id: "e8",
    image: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?q=80&w=800&auto=format&fit=crop",
    caption: "Virtual Reality Immersion",
    category: "esports",
    user: "vr_world",
    likes: "3.4K",
    comments: "67",
    aspect: "aspect-[4/3]",
  },
];

export function useExplorePosts() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredPosts = useMemo(() => {
    let result = MOCK_EXPLORE_POSTS;

    if (activeCategory !== 'all') {
      result = result.filter(post => post.category === activeCategory);
    }

    if (searchQuery.trim() !== "") {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter(post => 
        post.caption.toLowerCase().includes(lowerQuery) ||
        post.user.toLowerCase().includes(lowerQuery)
      );
    }

    return result;
  }, [searchQuery, activeCategory]);

  return {
    searchQuery,
    setSearchQuery,
    activeCategory,
    setActiveCategory,
    filteredPosts
  };
}
