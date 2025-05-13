import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { FaEllipsisH, FaBookmark, FaEdit, FaMegaphone } from 'react-icons/fa'
import { usePathname } from 'next/navigation'
import { getAllFollowers, getMyProfile } from '@/views/settings/store';
import { useDispatch, useSelector } from 'react-redux';

function FeedHeader() {
  const {myFollowers, personalPosts, totalFollowers, profileData} = useSelector(({settings}) => settings)
  const pathname = usePathname();
  const dispatch = useDispatch();
  const [showDropdown, setShowDropdown] = useState(false);

  console.log('profileData', profileData)
  useEffect(() => {
    dispatch(getAllFollowers())
    dispatch(getMyProfile())
  }, [])
  
  const isLinkActive = (path) => {
    return pathname.startsWith(path);
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <div className=''>
        {/* Cover Photo */}
      <div className="cover-photo rounded-t-md relative w-full h-60 overflow-hidden">
        <div className="absolute inset-0 w-full">
          <img src='/oldman-bg.jpg' className="w-full h-full object-cover"/>
        </div>
      </div>
      
      {/* Profile Section */}
      <div className="profile-section bg-white px-6 py-4 relative">
        <div className="flex justify-between ">
          <div className="flex items-end">
            {/* Profile Picture */}
            <div className="profile-pic relative -mt-16 mr-4">
              <div className="w-28 h-28 rounded-xl border-4 border-white overflow-hidden bg-blue-400 flex items-center justify-center text-white text-2xl">
                <img src='/common-avator.jpg'/>
              </div>
            </div>
            
            {/* Profile Info */}
            <div className="profile-info mb-2">
              <h2 className="text-xl font-bold">{profileData?.fname + " " + profileData?.last_name}</h2>
              <p className="text-gray-600 text-sm">
                <span>{totalFollowers && totalFollowers} Followers</span> · <span>0 Following</span>
              </p>
            </div>
          </div>
          
          {/* More Options */}
          <div className="relative ">
            <button 
              className="text-gray-600 bg-gray-200 hover:bg-gray-300 p-2 rounded-md cursor-pointer"
              onClick={toggleDropdown}
            >
              <FaEllipsisH />
            </button>
            
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg z-10">
                <div className="py-2">
                  <button className="w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-gray-100">
                    <span className="text-gray-700">View As</span>
                  </button>
                  <button className="w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-gray-100">
                    <span className="text-gray-700">Edit Profile</span>
                  </button>
                  <button className="w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-gray-100">
                    <span className="text-gray-700">Promote Profile</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Navigation Tabs */}
      <div className="profile-nav rounded-b-md bg-white border-t border-b border-gray-200">
        <div className="mx-auto">
          <div className="flex">
            <Link 
              href="/user/nfc" 
              className={`px-6 py-3 font-medium ${
                isLinkActive('/user/nfc') ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-600'
              }`}
            >
              NFC
            </Link>
            <Link 
              href="/user/about" 
              className={`px-6 py-3 font-medium ${
                isLinkActive('/user/about') ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-600'
              }`}
            >
              ABOUT
            </Link>
            <Link 
              href="/user/gathering" 
              className={`px-6 py-3 font-medium ${
                isLinkActive('/user/gathering') ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-600'
              }`}
            >
              GATHERING
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FeedHeader