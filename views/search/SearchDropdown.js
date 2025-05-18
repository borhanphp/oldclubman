import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchQuery, setSearchResults, setSearchLoading, removeQuery } from './store';
import api from '@/helpers/axios';
import { followTo, unFollowTo } from '../settings/store';
import Link from 'next/link';

const searchApi = async (query) => {
  const response = await api.get(`/client/search_by_people?search=${query}`);
  console.log('response of search',response)
  return response.data.data.follow_connections;
};

const SearchDropdown = () => {
  const dispatch = useDispatch();
  const { query, results, loading } = useSelector(state => state.search);
  const dropdownRef = useRef(null);
  const [loadingStates, setLoadingStates] = useState({});

  useEffect(() => {
    return () => (
      dispatch(removeQuery())
    )
  }, [])

   // Function to handle following a user
   const handleFollow = async (userId) => {
    try {
      setLoadingStates(prev => ({ ...prev, [userId]: true }));
      await dispatch(followTo({following_id: userId}));
      
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
      await dispatch(unFollowTo({following_id: userId}));
      
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
    <div className="relative w-full" ref={dropdownRef}>
      <input
        type="text"
        placeholder="Search..."
        className="bg-gray-100 border-none outline-none w-full px-4 py-2 rounded-md"
        value={query}
        onChange={e => dispatch(setSearchQuery(e.target.value))}
        autoComplete="off"
      />
      {query && results.length > 0 && (
        <div
          className="fixed left-1/2 top-[70px] w-[80rem] transform -translate-x-1/2 bg-white shadow-lg z-50 border-gray-200 px-4"
          style={{ maxHeight: '60vh', overflowY: 'auto' }}
        >
          <div className="py-4">
            <h2 className="text-lg font-semibold mb-4 px-4">Connections</h2>
            {loading ? (
              <div className="p-4 text-center text-gray-500">Loading...</div>
            ) : (
              results?.map(result => (
                <div
                  key={result.id}
                  className="flex items-center justify-between px-6 py-4 hover:bg-gray-100 last:border-b-0"
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden mr-4">
                      {result?.image ? (
                        <img src={process.env.NEXT_PUBLIC_CLIENT_FILE_PATH + result?.image} alt={result.name} className="w-full h-full object-cover" />
                      ) : (
                        <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                          <circle cx="12" cy="8" r="4" />
                          <path d="M12 14c-4.418 0-8 1.79-8 4v2h16v-2c0-2.21-3.582-4-8-4z" />
                        </svg>
                      )}
                    </div>
                    <div>
                    <Link href={`/user/user-profile/${result?.id}`}>
                      <div onClick={() => dispatch(removeQuery())} className="flex items-center hover:underline font-semibold text-gray-900">
                        {result.fname + " " + result.last_name}
                      </div>
                      </Link>
                      {result?.followers?.length > 0 && (
                        <div className="text-sm text-gray-500">
                          {result.followers.map(f => `${f.follower_client.display_name}`).join(', ')} Following
                        </div>
                      )}
                    </div>
                  </div>

                  {result.followed === "followed" ? 
                   <button 
                   className={`px-4 py-2 rounded font-semibold transition cursor-pointer bg-blue-100 text-red-400 hover:bg-red-200`}
                   onClick={() => handleUnFollow(result.id)}
                   disabled={loadingStates[result.id]}
                 >
                   {loadingStates[result.id] ? "UnFollowing..." : "UnFollow"}
                 </button>
                  : 
                   <button 
                   className={`px-4 py-2 rounded font-semibold transition cursor-pointer bg-blue-100 text-blue-600 hover:bg-blue-200`}
                   onClick={() => handleFollow(result.id)}
                   disabled={loadingStates[result.id]}
                 >
                   {loadingStates[result.id] ? "Following..." : "Follow"}
                 </button>
                  }
                 
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchDropdown;