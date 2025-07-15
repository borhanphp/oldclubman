"use client";

import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setSearchQuery } from '@/views/search/store';
import { getPosts } from '@/views/gathering/store';

const PostsSearch = () => {
  const dispatch = useDispatch();
  const [query, setQuery] = useState('');

  // Handle search on typing with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query.trim()) {
        handleSearch();
      }
    }, 500); // 500ms delay to avoid too many API calls

    return () => clearTimeout(timeoutId);
  }, [query]);

  // Handle search function
  const handleSearch = async () => {
    try {
      // Use the getPosts function from gathering store with search parameter
      const response = await dispatch(getPosts({ page: 1, search: query.trim() }));
      console.log('Search results:', response);
      
      // You can dispatch the results to Redux store or handle them as needed
      // dispatch(setSearchResults(response.data.data.follow_connections));
      
    } catch (error) {
      console.error('Search error:', error);
    }
  };

  // Handle Enter key for immediate search
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && query.trim()) {
      handleSearch();
    }
  };

  return (
    <div className="relative w-full">
      <input
        type="text"
        placeholder="Search posts..."
        className="bg-gray-100 border-none outline-none w-full px-4 py-2 rounded-md"
        value={query}
        onChange={e => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        autoComplete="off"
      />
    </div>
  );
};

export default PostsSearch; 