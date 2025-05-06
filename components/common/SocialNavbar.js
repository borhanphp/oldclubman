"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  FaSearch, FaChevronDown, FaCommentAlt, FaCog, FaBell, 
  FaShippingFast, FaSignOutAlt, 
  FaSun, FaMoon, FaAdjust, 
  FaComment, FaMapMarkerAlt
} from 'react-icons/fa';
import { logout } from '@/utility';

const SocialNavbar = () => {
  const [openProfileDropdown, setOpenProfileDropdown] = useState(false);

  return (
    <nav className="sticky top-0 z-10 px-10 flex justify-between items-center bg-white p-2 shadow-sm">
      <div className="flex items-center">
        <Link href="/user/gathering" className="flex items-center">
          <div className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center mr-2">
            <img src='/oldman-logo.png'/>
          </div>
        </Link>
        <div className="relative flex items-center bg-gray-100 rounded-md px-3 py-2 ml-2">
          <FaSearch className="text-gray-500 mr-2" />
          <input 
            type="text" 
            placeholder="Search..." 
            className="bg-transparent border-none outline-none w-64"
          />
        </div>
      </div>
      
      <div className="flex items-center">
        {/* ACCOUNT Dropdown */}
        <div className="relative mx-2 group">
          <div className="dropdown-menu flex items-center cursor-pointer">
            <span className="text-gray-600 font-medium mr-1">ACCOUNT</span>
            <FaChevronDown className="text-gray-500 text-xs transition-transform group-hover:rotate-180" />
          </div>
          
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20 hidden group-hover:block">
            <Link href="/user/social" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
              <span>Profile</span>
            </Link>
            
            <Link href="/user/about" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
              <span>Settings & Privacy</span>
            </Link>
            <Link href="/user/company" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
              <span>Companies</span>
            </Link>
            <Link href="/user/bank" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
              <span>Bank</span>
            </Link>
            
          </div>
        </div>
        
        {/* CARD Dropdown */}
        <div className="relative mx-2 group">
          <div className="dropdown-menu flex items-center cursor-pointer">
            <span className="text-gray-600 font-medium mr-1">CARD</span>
            <FaChevronDown className="text-gray-500 text-xs transition-transform group-hover:rotate-180" />
          </div>
          
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20 hidden group-hover:block">
            <Link href="#" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
              <span>NFC CARD</span>
            </Link>
          </div>
        </div>
        
        {/* SHIPPING Dropdown */}
        <div className="relative mx-2 group">
          <div className="dropdown-menu flex items-center cursor-pointer">
            <span className="text-gray-600 font-medium mr-1">SHIPPING</span>
            <FaChevronDown className="text-gray-500 text-xs transition-transform group-hover:rotate-180" />
          </div>
          
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20 hidden group-hover:block">
            <Link href="#" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
              <FaShippingFast className="mr-2 text-gray-500" />
              <span>Shipping order</span>
            </Link>
            <Link href="#" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
              <FaMapMarkerAlt className="mr-2 text-gray-500" />
              <span>Order List</span>
            </Link>
          </div>
        </div>
        
        {/* Messages Icon with Dropdown */}
        <div className="relative mr-2 p-3 rounded-md group bg-gray-200">
          <Link href="/user/messages" className="icon-button text-gray-600 hover:text-black cursor-pointer">
            <FaCommentAlt size={14} />
          </Link>
        </div>
        
        {/* Settings Icon*/}
        <div className="relative mr-2 p-3 rounded-md group bg-gray-200">
          <Link href='/user/account-settings' className="icon-button text-gray-600 hover:text-black cursor-pointer">
            <FaCog size={14} />
          </Link>
        </div>
        
        {/* Notifications Icon with Dropdown */}
        <div className="relative mr-2 p-3 rounded-md group bg-gray-200">
          <div className="icon-button text-gray-600 hover:text-black cursor-pointer relative">
            <FaBell size={14} />
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
          </div>
        </div>
        
        {/* User Profile Icon with Dropdown - Click based */}
        <div className="relative ml-2">
          <div 
            className="profile-icon cursor-pointer"
            onClick={() => setOpenProfileDropdown(!openProfileDropdown)}
          >
            <div className="w-8 h-8 rounded-full overflow-hidden bg-red-400 flex items-center justify-center text-white">
              <img src='/common-avator.jpg'/>
            </div>
          </div>
          
          {openProfileDropdown && (
            <div className="absolute p-3 right-0 mt-2 w-60 bg-white rounded-md shadow-lg py-1 z-20">
              <div className="">
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full overflow-hidden mr-3">
                    <img src='/common-avator.jpg' className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[15px]">Borhan Uddin</h3>
                   
                  </div>
                  
                </div>
                
              </div>

              <Link href="/user/about" className="block hover:text-white hover:bg-blue-700 bg-blue-100 py-[6px] mt-2 w-full text-blue-600 font-semibold text-sm text-center mx-auto mb-2">
                View profile
              </Link>
              
              <Link href="/user/account-settings" className="flex items-center hover:text-blue-500 px-4 py-3 text-sm text-gray-600 ">
                <FaCog className="mr-2 text-gray-500" />
                <span className='font-[600] text-gray-500 text-[15px]'>Settings & Privacy</span>
              </Link>
              
              <Link href="/user/messages" className="flex items-center px-4 py-3 text-sm text-gray-600">
                <FaComment className="mr-2 text-gray-500" />
                <span className='font-[600] text-gray-500 text-[15px]'>Chat</span>
              </Link>
              
              <div className="border-t border-gray-200 my-1"></div>
              
              <Link onClick={() => {logout()}} href="/auth/login" className="flex items-center px-4 py-3 text-sm text-gray-600 hover:bg-gray-100 w-full text-left">
                <FaSignOutAlt className="mr-2 text-gray-500" />
                <span className='font-[600] text-gray-500 text-[15px]'>Sign Out</span>
              </Link>
              
              <div className="border-t border-gray-200 mt-1 mb-2"></div>
              
              <div className="px-4 pt-2 pb-3">
                <div className="flex items-center mb-2">
                  <span className="text-sm text-gray-600 mr-3">Mode:</span>
                  <div className="flex space-x-2">
                    <button className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center text-white">
                      <FaSun />
                    </button>
                    <button className="w-8 h-8 bg-gray-200 rounded-md flex items-center justify-center text-gray-600 hover:bg-gray-300">
                      <FaMoon />
                    </button>
                    <button className="w-8 h-8 bg-gray-200 rounded-md flex items-center justify-center text-gray-600 hover:bg-gray-300">
                      <FaAdjust />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Close profile dropdown when clicking outside */}
      {openProfileDropdown && (
        <div 
          className="fixed inset-0 z-10"
          onClick={() => setOpenProfileDropdown(false)}
        ></div>
      )}
    </nav>
  );
};

export default SocialNavbar; 