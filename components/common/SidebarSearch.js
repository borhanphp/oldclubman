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

// Advanced search profile API
const advanceSearchProfile = async (filters) => {
  const params = new URLSearchParams();
  
  if (filters.state_id) params.append('state_id', filters.state_id);
  if (filters.city_id) params.append('city_id', filters.city_id);
  if (filters.country_id) params.append('country_id', filters.country_id);
  if (filters.school) params.append('school', filters.school);
  if (filters.blood_group) params.append('blood_group', filters.blood_group);
  if (filters.community) params.append('community', filters.community);
  if (filters.is_single) params.append('is_single', filters.is_single);
  
  const response = await api.get(`/client/advance_search_profile?${params.toString()}`);
  return response?.data?.data?.search_results || [];
};

const SidebarSearch = () => {
  const dispatch = useDispatch();
  const { query, results, loading } = useSelector(state => state.search);
  const { profileData } = useSelector(({ settings }) => settings);
  const dropdownRef = useRef(null);
  const [loadingStates, setLoadingStates] = useState({});
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [searchCategory, setSearchCategory] = useState('general');
  const [locationCountries, setLocationCountries] = useState([]);
  const [locationStates, setLocationStates] = useState([]);
  const [locationCities, setLocationCities] = useState([]);
  const [advancedFilters, setAdvancedFilters] = useState({
    city: '',
    country: '',
    community: '',
    school: '',
    ageRange: { min: 18, max: 65 },
    bloodType: '',
    relationshipStatus: 'single',
    radius: 10, // km
    state_id: '',
    city_id: '',
    country_id: '',
    blood_group: ''
  });

  useEffect(() => {
    return () => (
      dispatch(removeQuery())
    );
  }, []);

  // Fetch location options for By Location category
  useEffect(() => {
    if (!showAdvancedSearch || searchCategory !== 'location') return;
    const fetchCountries = async () => {
      try {
        const response = await api.get(`${process.env.NEXT_PUBLIC_API_URL}/location/country`);
        const options = response?.data?.data?.map(c => ({ value: String(c.id), label: c.name })) || [];
        setLocationCountries(options);
      } catch (e) {
        console.error('Failed to load countries', e);
      }
    };
    fetchCountries();
  }, [showAdvancedSearch, searchCategory]);

  const fetchStates = async (countryId) => {
    try {
      const response = await api.get(`${process.env.NEXT_PUBLIC_API_URL}/location/state?country_id=${countryId}`);
      const options = response?.data?.data?.map(s => ({ value: String(s.id), label: s.name })) || [];
      setLocationStates(options);
    } catch (e) {
      console.error('Failed to load states', e);
    }
  };

  const fetchCities = async (stateId) => {
    try {
      const response = await api.get(`${process.env.NEXT_PUBLIC_API_URL}/location/city?state_id=${stateId}`);
      const options = response?.data?.data?.map(c => ({ value: String(c.id), label: c.name })) || [];
      setLocationCities(options);
    } catch (e) {
      console.error('Failed to load cities', e);
    }
  };

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
      
      // Use the new advance search API for advance category
      if (searchCategory === 'advance') {
        searchResults = await advanceSearchProfile(advancedFilters);
        dispatch(setSearchQuery('Advanced Search'));
      } else {
        switch (searchCategory) {
          case 'singles': {
            // Only is_single filter
            const params = { is_single: 'yes' };
            searchResults = await advanceSearchProfile(params);
            dispatch(setSearchQuery('Advanced Search'));
            break;
          }
          case 'blood_donors': {
            if (!advancedFilters.blood_group) {
              // Wait for user to choose a group; don't call yet
              searchResults = [];
              break;
            }
            // Only blood_group filter
            const params = { blood_group: advancedFilters?.blood_group };
            searchResults = await advanceSearchProfile(params);
            dispatch(setSearchQuery('Advanced Search'));
            break;
          }
          case 'location': {
            if (!advancedFilters.country_id || !advancedFilters.state_id || !advancedFilters.city_id) {
              searchResults = [];
              break;
            }
            const params = {
              country_id: advancedFilters.country_id,
              state_id: advancedFilters.state_id,
              city_id: advancedFilters.city_id
            };
            searchResults = await advanceSearchProfile(params);
            dispatch(setSearchQuery('Advanced Search'));
            break;
          }
          case 'school': {
            // Only school filter
            const params = { school: 'yes' };
            searchResults = await advanceSearchProfile(params);
            dispatch(setSearchQuery('Advanced Search'));
            break;
          }
          case 'community': {
            // Only community filter
            const params = { community: 'yes' };
            searchResults = await advanceSearchProfile(params);
            dispatch(setSearchQuery('Advanced Search'));
            break;
          }
          default: {
            // Fallback to basic search for other categories
            searchResults = await searchApi(query);
          }
        }
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

  // Auto-trigger advanced search for category shortcuts
  useEffect(() => {
    if (!showAdvancedSearch) return;
    // Auto trigger only the selected category's call
    if (['singles', 'school', 'community'].includes(searchCategory)) {
      handleAdvancedSearch();
    } else if (searchCategory === 'blood_donors' && advancedFilters.blood_group) {
      handleAdvancedSearch();
    } else if (searchCategory === 'location' && advancedFilters.country_id && advancedFilters.state_id && advancedFilters.city_id) {
      handleAdvancedSearch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchCategory, showAdvancedSearch, advancedFilters.blood_group, advancedFilters.country_id, advancedFilters.state_id, advancedFilters.city_id]);

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
        
        {query && (
          <button
            onClick={() => {
              dispatch(setSearchResults([]));
              dispatch(removeQuery());
            }}
            className="text-red-600 hover:text-red-800 text-sm"
          >
            Clear Search
          </button>
        )}
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
            {/* {(searchCategory === 'location' || searchCategory === 'community' || searchCategory === 'singles') && (
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
            )} */}

            {searchCategory === 'blood_donors' && (
              <select
                value={advancedFilters.blood_group}
                onChange={(e) => setAdvancedFilters({...advancedFilters, blood_group: e.target.value})}
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

            {/* No extra inputs for School Friends; it triggers school=yes */}

            {/* {searchCategory === 'singles' && (
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
            )} */}

         

            {searchCategory === 'advance' && (
              <>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    placeholder="State ID"
                    value={advancedFilters.state_id}
                    onChange={(e) => setAdvancedFilters({...advancedFilters, state_id: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-md text-sm"
                  />
                  <input
                    type="number"
                    placeholder="City ID"
                    value={advancedFilters.city_id}
                    onChange={(e) => setAdvancedFilters({...advancedFilters, city_id: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-md text-sm"
                  />
                </div>
                <input
                  type="number"
                  placeholder="Country ID"
                  value={advancedFilters.country_id}
                  onChange={(e) => setAdvancedFilters({...advancedFilters, country_id: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="School (yes/no)"
                    value={advancedFilters.school}
                    onChange={(e) => setAdvancedFilters({...advancedFilters, school: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-md text-sm"
                  />
                  <input
                    type="text"
                    placeholder="Blood Group (yes/no)"
                    value={advancedFilters.blood_group}
                    onChange={(e) => setAdvancedFilters({...advancedFilters, blood_group: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-md text-sm"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Community (yes/no)"
                  value={advancedFilters.community}
                  onChange={(e) => setAdvancedFilters({...advancedFilters, community: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                />
              </>
            )}

            {searchCategory === 'location' && (
              <>
                <select
                  value={advancedFilters.country_id}
                  onChange={(e) => {
                    const val = e.target.value;
                    setAdvancedFilters({ ...advancedFilters, country_id: val, state_id: '', city_id: '' });
                    if (val) fetchStates(val);
                  }}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="">Select Country</option>
                  {locationCountries.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                <select
                  value={advancedFilters.state_id}
                  onChange={(e) => {
                    const val = e.target.value;
                    setAdvancedFilters({ ...advancedFilters, state_id: val, city_id: '' });
                    if (val) fetchCities(val);
                  }}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                  disabled={!advancedFilters.country_id}
                >
                  <option value="">Select State</option>
                  {locationStates.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                <select
                  value={advancedFilters.city_id}
                  onChange={(e) => setAdvancedFilters({ ...advancedFilters, city_id: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                  disabled={!advancedFilters.state_id}
                >
                  <option value="">Select City</option>
                  {locationCities.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </>
            )}

            <button
              onClick={handleAdvancedSearch}
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 text-sm font-medium"
            >
              Search {searchCategory.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </button>
            
          
            
            {searchCategory === 'advance' && (
              <button
                onClick={() => {
                  // Set example values based on the provided API URL
                  setAdvancedFilters({
                    ...advancedFilters,
                    state_id: '4',
                    city_id: '1',
                    country_id: '1',
                    school: 'yes',
                    blood_group: 'yes',
                    community: 'yes'
                  });
                }}
                className="w-full bg-purple-500 text-white py-2 px-4 rounded-md hover:bg-purple-600 text-sm font-medium mt-2"
              >
                Load Example Filters
              </button>
            )}
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

      {/* Search Results Dropdown - Only show for normal search, not advanced search */}
      {query && results.length > 0 && !showAdvancedSearch && !results.some(result => result.is_blood_donor !== undefined || result.is_spouse_need !== undefined) && query !== 'Demo Search' && query !== 'Advanced Search' && (
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