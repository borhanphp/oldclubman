"use client";

import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchQuery, setSearchResults, setSearchLoading, removeQuery } from '@/views/search/store';
import api from '@/helpers/axios';
import { followTo, unFollowTo } from '@/views/settings/store';
import Link from 'next/link';
import { FaSearch, FaEllipsisV, FaMapMarkerAlt, FaHeart, FaGraduationCap, FaUsers, FaTint, FaChevronDown, FaChevronUp } from 'react-icons/fa';

const searchApi = async (query) => {
  const response = await api.get(`/client/search_by_people?search=${query}`);
  console.log('response of search', response);
  return response.data.data.follow_connections;
};

// Advanced search APIs
const searchBloodDonors = async (filters) => {
  const response = await api.get(`/client/search_blood_donors?city=${filters.city}&country=${filters.country}&blood_type=${filters.bloodType}`);
  return response.data.data;
};

const searchByLocation = async (filters) => {
  const response = await api.get(`/client/search_by_location?city=${filters.city}&country=${filters.country}&radius=${filters.radius}`);
  return response.data.data;
};

const searchCommunity = async (filters) => {
  const response = await api.get(`/client/search_community?city=${filters.city}&country=${filters.country}&community=${filters.community}`);
  return response.data.data;
};

const searchNearby = async (filters) => {
  const response = await api.get(`/client/search_nearby?radius=${filters.radius}`);
  return response.data.data;
};

const searchSchoolFriends = async (filters) => {
  const response = await api.get(`/client/search_school_friends?school=${filters.school}&city=${filters.city}`);
  return response.data.data;
};

const searchSingles = async (filters) => {
  const response = await api.get(`/client/search_singles?city=${filters.city}&country=${filters.country}&min_age=${filters.ageRange.min}&max_age=${filters.ageRange.max}&community=${filters.community}`);
  return response.data.data;
};

const SidebarSearch = () => {
  const dispatch = useDispatch();
  const { query, results, loading } = useSelector(state => state.search);
  const dropdownRef = useRef(null);
  const [loadingStates, setLoadingStates] = useState({});
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [searchCategory, setSearchCategory] = useState('general');
  const [advancedFilters, setAdvancedFilters] = useState({
    city: '',
    country: '',
    community: '',
    school: '',
    ageRange: { min: 18, max: 65 },
    bloodType: '',
    relationshipStatus: 'single',
    radius: 10 // km
  });

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

  // Handle advanced search
  const handleAdvancedSearch = async () => {
    dispatch(setSearchLoading(true));
    try {
      let searchResults = [];
      
      switch (searchCategory) {
        case 'blood_donors':
          searchResults = await searchBloodDonors(advancedFilters);
          break;
        case 'location':
          searchResults = await searchByLocation(advancedFilters);
          break;
        case 'community':
          searchResults = await searchCommunity(advancedFilters);
          break;
        case 'nearby':
          searchResults = await searchNearby(advancedFilters);
          break;
        case 'school':
          searchResults = await searchSchoolFriends(advancedFilters);
          break;
        case 'singles':
          searchResults = await searchSingles(advancedFilters);
          break;
        default:
          searchResults = await searchApi(query);
      }
      
      dispatch(setSearchResults(searchResults));
    } catch (error) {
      console.error('Advanced search error:', error);
      dispatch(setSearchResults([]));
    } finally {
      dispatch(setSearchLoading(false));
    }
  };

  useEffect(() => {
    if (query.trim() === '') {
      dispatch(setSearchResults([]));
      return;
    }
    
    // Only do general search if not in advanced mode
    if (!showAdvancedSearch) {
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
    }
  }, [query, dispatch, showAdvancedSearch]);

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
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold text-gray-800">
          {showAdvancedSearch ? 'Advanced Search' : 'People'}
        </h2>
        <button
          onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
          className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 text-sm"
        >
          <span>Advanced</span>
          {showAdvancedSearch ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
        </button>
      </div>

      {/* Advanced Search Options */}
      {showAdvancedSearch && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="grid grid-cols-2 gap-2 mb-3">
            <button
              onClick={() => setSearchCategory('blood_donors')}
              className={`flex items-center space-x-2 p-2 rounded-md text-sm ${
                searchCategory === 'blood_donors' ? 'bg-red-100 text-red-700' : 'bg-white text-gray-700'
              }`}
            >
              <FaTint size={14} />
              <span>Blood Donors</span>
            </button>
            <button
              onClick={() => setSearchCategory('location')}
              className={`flex items-center space-x-2 p-2 rounded-md text-sm ${
                searchCategory === 'location' ? 'bg-blue-100 text-blue-700' : 'bg-white text-gray-700'
              }`}
            >
              <FaMapMarkerAlt size={14} />
              <span>By Location</span>
            </button>
            <button
              onClick={() => setSearchCategory('community')}
              className={`flex items-center space-x-2 p-2 rounded-md text-sm ${
                searchCategory === 'community' ? 'bg-green-100 text-green-700' : 'bg-white text-gray-700'
              }`}
            >
              <FaUsers size={14} />
              <span>Community</span>
            </button>
            <button
              onClick={() => setSearchCategory('nearby')}
              className={`flex items-center space-x-2 p-2 rounded-md text-sm ${
                searchCategory === 'nearby' ? 'bg-purple-100 text-purple-700' : 'bg-white text-gray-700'
              }`}
            >
              <FaMapMarkerAlt size={14} />
              <span>Nearby</span>
            </button>
            <button
              onClick={() => setSearchCategory('school')}
              className={`flex items-center space-x-2 p-2 rounded-md text-sm ${
                searchCategory === 'school' ? 'bg-yellow-100 text-yellow-700' : 'bg-white text-gray-700'
              }`}
            >
              <FaGraduationCap size={14} />
              <span>School Friends</span>
            </button>
            <button
              onClick={() => setSearchCategory('singles')}
              className={`flex items-center space-x-2 p-2 rounded-md text-sm ${
                searchCategory === 'singles' ? 'bg-pink-100 text-pink-700' : 'bg-white text-gray-700'
              }`}
            >
              <FaHeart size={14} />
              <span>Singles</span>
            </button>
          </div>

          {/* Dynamic Filter Fields */}
          <div className="space-y-2">
            {(searchCategory === 'blood_donors' || searchCategory === 'location' || searchCategory === 'community' || searchCategory === 'singles') && (
              <>
                <input
                  type="text"
                  placeholder="City"
                  value={advancedFilters.city}
                  onChange={(e) => setAdvancedFilters({...advancedFilters, city: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                />
                <input
                  type="text"
                  placeholder="Country"
                  value={advancedFilters.country}
                  onChange={(e) => setAdvancedFilters({...advancedFilters, country: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                />
              </>
            )}

            {searchCategory === 'blood_donors' && (
              <select
                value={advancedFilters.bloodType}
                onChange={(e) => setAdvancedFilters({...advancedFilters, bloodType: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="">Select Blood Type</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            )}

            {searchCategory === 'community' && (
              <input
                type="text"
                placeholder="Community Name"
                value={advancedFilters.community}
                onChange={(e) => setAdvancedFilters({...advancedFilters, community: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-md text-sm"
              />
            )}

            {searchCategory === 'school' && (
              <input
                type="text"
                placeholder="School Name"
                value={advancedFilters.school}
                onChange={(e) => setAdvancedFilters({...advancedFilters, school: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-md text-sm"
              />
            )}

            {searchCategory === 'singles' && (
              <>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    placeholder="Min Age"
                    value={advancedFilters.ageRange.min}
                    onChange={(e) => setAdvancedFilters({...advancedFilters, ageRange: {...advancedFilters.ageRange, min: parseInt(e.target.value)}})}
                    className="w-full p-2 border border-gray-300 rounded-md text-sm"
                  />
                  <input
                    type="number"
                    placeholder="Max Age"
                    value={advancedFilters.ageRange.max}
                    onChange={(e) => setAdvancedFilters({...advancedFilters, ageRange: {...advancedFilters.ageRange, max: parseInt(e.target.value)}})}
                    className="w-full p-2 border border-gray-300 rounded-md text-sm"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Community/Area"
                  value={advancedFilters.community}
                  onChange={(e) => setAdvancedFilters({...advancedFilters, community: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                />
              </>
            )}

            {(searchCategory === 'nearby' || searchCategory === 'location') && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Radius:</span>
                <input
                  type="number"
                  placeholder="10"
                  value={advancedFilters.radius}
                  onChange={(e) => setAdvancedFilters({...advancedFilters, radius: parseInt(e.target.value)})}
                  className="w-20 p-2 border border-gray-300 rounded-md text-sm"
                />
                <span className="text-sm text-gray-600">km</span>
              </div>
            )}

            <button
              onClick={handleAdvancedSearch}
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 text-sm font-medium"
            >
              Search {searchCategory.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </button>
          </div>
        </div>
      )}

      {/* General Search Box */}
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
            No results found for {query}
          </div>
        </div>
      )}
    </div>
  );
};

export default SidebarSearch; 