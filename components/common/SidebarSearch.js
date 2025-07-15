"use client";

import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchQuery, setSearchResults, setSearchLoading, removeQuery } from '@/views/search/store';
import api from '@/helpers/axios';
import { followTo, unFollowTo } from '@/views/settings/store';
import Link from 'next/link';
import { FaSearch, FaEllipsisV } from 'react-icons/fa';

const searchApi = async (query) => {
  const response = await api.get(`/client/search_by_people?search=${query}`);
  console.log('response of search', response);
  return response.data.data.follow_connections;
};

const SidebarSearch = () => {
  const dispatch = useDispatch();
  const { query, results, loading } = useSelector(state => state.search);
  const dropdownRef = useRef(null);
  const [loadingStates, setLoadingStates] = useState({});

  useEffect(() => {
    return () => (
      dispatch(removeQuery())
    );
  }, []);

  // Function to handle following a user
  const handleFollow = async (userId) => {
    try {
      setLoadingStates(prev => ({ ...prev, [userId]: true }));
      await dispatch(followTo({ following_id: userId }));

      // Reload search results after successful follow
      dispatch(setSearchLoading(true));
      const newResults = await searchApi(query);
      dispatch(setSearchResults(newResults));
    } catch (error) {
      console.error('Error following user:', error);
    } finally {
      dispatch(setSearchLoading(false));
      setLoadingStates(prev => ({ ...prev, [userId]: false }));
    }
  };

  // Function to handle unfollowing a user
  const handleUnFollow = async (userId) => {
    try {
      setLoadingStates(prev => ({ ...prev, [userId]: true }));
      await dispatch(unFollowTo({ following_id: userId }));

      // Reload search results after successful unfollow
      dispatch(setSearchLoading(true));
      const newResults = await searchApi(query);
      dispatch(setSearchResults(newResults));
    } catch (error) {
      console.error('Error unfollowing user:', error);
    } finally {
      dispatch(setSearchLoading(false));
      setLoadingStates(prev => ({ ...prev, [userId]: false }));
    }
  };

  useEffect(() => {
    if (query.trim() === '') {
      dispatch(setSearchResults([]));
      return;
    }
    dispatch(setSearchLoading(true));
    searchApi(query)
      .then(res => {
        dispatch(setSearchResults(res));
        dispatch(setSearchLoading(false));
      })
      .catch(() => {
        dispatch(setSearchResults([]));
        dispatch(setSearchLoading(false));
      });
  }, [query, dispatch]);

  // Optional: close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        dispatch(setSearchResults([]));
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dispatch]);

  return (
    <div className="p-4 border-b border-gray-200 relative" ref={dropdownRef}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-800">Peoples</h2>
        
      </div>

      {/* Search Box */}
      <div className="relative border border-gray-300 bg-white rounded-full">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FaSearch className="h-4 w-4 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search contacts..."
          className="bg-white border-none outline-none w-full pl-10 pr-4 py-3 rounded-full text-sm text-gray-700 placeholder-gray-500"
          value={query}
          onChange={e => dispatch(setSearchQuery(e.target.value))}
          autoComplete="off"
        />
      </div>

      {/* Search Results Dropdown */}
      {query && results.length > 0 && (
        <div className="absolute left-0 right-0 mt-2 z-50 rounded-md max-h-96 overflow-y-auto">
          <div className="py-2">
            <h3 className="text-sm font-semibold mb-2 px-4 text-gray-700">Search Results</h3>
            {loading ? (
              <div className="p-4 text-center text-gray-500 text-sm">Loading...</div>
            ) : (
              results?.map(result => (
                <div
                  key={result.id}
                  className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 gap-3"
                >
                  <div className="flex items-center flex-1 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden mr-3 flex-shrink-0">
                      {result?.image ? (
                        <img 
                          src={process.env.NEXT_PUBLIC_CLIENT_FILE_PATH + result?.image} 
                          alt={result.name} 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "/common-avator.jpg";
                          }}
                        />
                      ) : (
                        <img 
                          src="/common-avator.jpg" 
                          alt="Default avatar" 
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <Link href={`/user/user-profile/${result?.id}`}>
                        <div 
                          onClick={() => dispatch(removeQuery())} 
                          className="font-medium text-gray-900 text-sm hover:underline truncate"
                        >
                          {result.fname + " " + result.last_name}
                        </div>
                      </Link>
                      {result?.followers?.length > 0 && (
                        <div className="text-xs text-gray-500 truncate">
                          {result.followers.map(f => `${f.follower_client.display_name}`).join(', ')} Following
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex-shrink-0">
                    {result?.followed === "followed" ? (
                      <button
                        onClick={() => handleUnFollow(result.id)}
                        disabled={loadingStates[result.id]}
                        className="px-3 py-1 text-xs bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 disabled:opacity-50 whitespace-nowrap min-w-[70px]"
                      >
                        {loadingStates[result.id] ? 'Unfollowing...' : 'Unfollow'}
                      </button>
                    ) : (
                      <button
                        onClick={() => handleFollow(result.id)}
                        disabled={loadingStates[result.id]}
                        className="px-3 py-1 text-xs bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:opacity-50 whitespace-nowrap min-w-[70px]"
                      >
                        {loadingStates[result.id] ? 'Following...' : 'Follow'}
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* No results message */}
      {query && !loading && results.length === 0 && (
        <div className="absolute left-0 right-0 mt-2 z-50  rounded-md">
          <div className="p-4 text-center text-gray-500 text-sm">
            No results found for "{query}"
          </div>
        </div>
      )}
    </div>
  );
};

export default SidebarSearch; 