"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  FaSearch,
  FaChevronDown,
  FaCommentAlt,
  FaCog,
  FaBell,
  FaShippingFast,
  FaSignOutAlt,
  FaSun,
  FaMoon,
  FaAdjust,
  FaComment,
  FaMapMarkerAlt,
  FaShoppingBag,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { logout } from "@/utility";
import { useDispatch, useSelector } from "react-redux";
import { getMyProfile } from "@/views/settings/store";
import PostsSearch from "./PostsSearch";

const SocialNavbar = () => {
  const { profile } = useSelector(({ settings }) => settings);
  const dispatch = useDispatch();
  const [openProfileDropdown, setOpenProfileDropdown] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showCardDropdown, setShowCardDropdown] = useState(false);
  const [showShippingDropdown, setShowShippingDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    dispatch(getMyProfile());
  }, []);
  return (
   <>
    <nav className="sticky top-0 z-10 px-4 md:px-10 flex justify-between items-center bg-white p-2 shadow-sm">
      {/* Left section: Logo and Search */}
      <div className="flex items-center flex-1 md:flex-none">
        <Link href="/user/gathering" className="flex items-center">
          <div className="w-8 h-8 md:w-12 md:h-12 rounded-full overflow-hidden flex items-center justify-center mr-2">
            <img src="/oldman-logo.png" className="w-full h-full object-cover" />
          </div>
        </Link>
        {/* Search - Hidden on mobile, shown on tablet+ */}
        <div className="hidden md:flex flex-1 items-center justify-center ml-4">
          <PostsSearch />
        </div>
      </div>

      {/* Right section: Menu items - Hidden on mobile, shown on desktop */}
      <div className="hidden md:flex items-center">
        {/* MARKETPLACE Link */}
        <div className="relative mx-2 mr-5">
          <Link href="/marketplace" className="flex items-center cursor-pointer">
            <FaShoppingBag className="text-gray-600 mr-2" />
            <span className="text-gray-600 font-medium">MARKETPLACE</span>
          </Link>
        </div>

        {/* ACCOUNT Dropdown */}
        <div 
          className="relative mx-2 mr-5"
          onMouseEnter={() => setShowDropdown(true)}
          onMouseLeave={() => setShowDropdown(false)}
        >
          <div className="dropdown-menu flex items-center cursor-pointer">
            <span className="text-gray-600 text-[15px] font-medium mr-1">ACCOUNT</span>
            <FaChevronDown 
              size={10} 
              className={`text-gray-500 text-xs transition-transform ${showDropdown ? 'rotate-180' : ''}`} 
            />
          </div>

          {showDropdown && (
            <div className="absolute -left-10 pt-5 mt-0 w-48 bg-white rounded-md shadow-lg py-1 z-30">
              <Link
                href={`/user/user-profile/${profile?.client?.id}`}
                className="flex items-center px-4 py-2 text-[15px] font-medium text-gray-700 hover:bg-gray-100"
              >
                <span>Profile</span>
              </Link>

              <Link
                href="/user/account-settings"
                className="flex items-center  px-4 py-2 text-[15px] font-medium text-gray-700 hover:bg-gray-100"
              >
                <span className="hover:text-blue-600">Settings & Privacy</span>
              </Link>
              <Link
                href="/user/company"
                className="flex items-center px-4 py-2 text-[15px] font-medium text-gray-700 hover:bg-gray-100"
              >
                <span>Companies</span>
              </Link>
              <Link
                href="/user/bank"
                className="flex items-center px-4 py-2 text-[15px] font-medium text-gray-700 hover:bg-gray-100"
              >
                <span>Bank</span>
              </Link>
            </div>
          )}
        </div>

        {/* CARD Dropdown */}
        <div 
          className="relative mx-2 mr-5"
          onMouseEnter={() => setShowCardDropdown(true)}
          onMouseLeave={() => setShowCardDropdown(false)}
        >
          <div className="dropdown-menu flex items-center cursor-pointer">
            <span className="text-gray-600 font-medium mr-1">CARD</span>
            <FaChevronDown 
              size={10} 
              className={`text-gray-500 text-xs transition-transform ${showCardDropdown ? 'rotate-180' : ''}`} 
            />
          </div>

          {showCardDropdown && (
            <div className="absolute pt-5 -left-10 w-48 bg-white rounded-md shadow-lg py-1 z-30">
              <Link
                href="/user/nfc"
                className="flex items-center px-4 py-2 text-[15px] font-medium text-gray-700 hover:bg-gray-100"
              >
                <span>NFC CARD</span>
              </Link>
            </div>
          )}
        </div>

        {/* SHIPPING Dropdown */}
        <div 
          className="relative mx-2 mr-5"
          onMouseEnter={() => setShowShippingDropdown(true)}
          onMouseLeave={() => setShowShippingDropdown(false)}
        >
          <div className="dropdown-menu flex items-center cursor-pointer">
            <span className="text-gray-600 font-medium mr-1">SHIPPING</span>
            <FaChevronDown 
              size={10} 
              className={`text-gray-500 text-xs transition-transform ${showShippingDropdown ? 'rotate-180' : ''}`} 
            />
          </div>

          {showShippingDropdown && (
            <div className="absolute pt-5 -left-10 w-48 bg-white rounded-md shadow-lg py-1 z-30">
              <Link
                href="#"
                className="flex items-center px-4 py-2 text-[15px] font-medium text-gray-700 hover:bg-gray-100"
              >
                <FaShippingFast className="mr-2 text-gray-500" />
                <span>Shipping order</span>
              </Link>
              <Link
                href="#"
                className="flex items-center px-4 py-2 text-[15px] font-medium text-gray-700 hover:bg-gray-100"
              >
                <FaMapMarkerAlt className="mr-2 text-gray-500" />
                <span>Order List</span>
              </Link>
            </div>
          )}
        </div>

        {/* Messages Icon with Dropdown */}
        <div className="relative mr-2 p-3 rounded-md group bg-gray-200">
          <Link
            href="/user/messages"
            className="icon-button text-gray-600 hover:text-black cursor-pointer"
          >
            <FaCommentAlt size={14} />
          </Link>
        </div>

        {/* Settings Icon*/}
        <div className="relative mr-2 p-3 rounded-md group bg-gray-200">
          <Link
            href="/user/account-settings"
            className="icon-button text-gray-600 hover:text-black cursor-pointer"
          >
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
              <img
                src={
                  (process.env.NEXT_PUBLIC_CLIENT_FILE_PATH +
                  profile?.client?.image) || "/common-avator.jpg"
                }
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/common-avator.jpg";
                }}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {openProfileDropdown && (
            <div className="absolute p-3 right-0 mt-2 w-60 bg-white rounded-md shadow-lg py-1 z-30">
              <div className="">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                    <img
                      src={
                        process.env.NEXT_PUBLIC_CLIENT_FILE_PATH +
                        profile?.client?.image || "/common-avator.jpg"
                      }
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/common-avator.jpg";
                      }}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-[15px]">
                      {profile?.client?.fname +
                        " " +
                        profile?.client?.last_name}
                    </h3>
                  </div>
                </div>
              </div>

              <Link
                href={`/user/user-profile/${profile?.client?.id}`}
                className="block hover:text-white hover:bg-blue-700 bg-blue-100 py-[6px] mt-2 w-full text-blue-600 font-semibold text-sm text-center mx-auto mb-2"
              >
                View profile
              </Link>

              <Link
                href="/user/account-settings"
                className="flex items-center hover:text-blue-500 px-4 py-3 text-sm text-gray-600 "
              >
                <FaCog className="mr-2 text-gray-500" />
                <span className="font-[600] text-gray-500 hover:text-blue-500 text-[15px]">
                  Settings & Privacy
                </span>
              </Link>

              <Link
                href="/user/messages"
                className="flex items-center px-4  py-3 text-sm text-gray-600"
              >
                <FaComment className="mr-2 text-gray-500" />
                <span className="font-[600] text-gray-500 hover:text-blue-500 text-[15px]">
                  Chat
                </span>
              </Link>

              <div className="border-t border-gray-200 my-1"></div>

              <Link
                onClick={() => {
                  logout();
                }}
                href="/auth/login"
                className="flex items-center px-4 py-3 text-sm text-gray-600 hover:bg-gray-100 w-full text-left"
              >
                <FaSignOutAlt className="mr-2 text-gray-500" />
                <span className="font-[600] text-gray-500 text-[15px]">
                  Sign Out
                </span>
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

      {/* Mobile Menu Button and Icons */}
      <div className="flex md:hidden items-center gap-2">
        {/* Search Icon - Mobile only */}
        <button
          onClick={() => {/* You can add search modal here */}}
          className="p-2 rounded-md bg-gray-200 text-gray-600"
        >
          <FaSearch size={16} />
        </button>

        {/* Messages Icon - Mobile */}
        <Link
          href="/user/messages"
          className="p-2 rounded-md bg-gray-200 text-gray-600 relative"
        >
          <FaCommentAlt size={16} />
        </Link>

        {/* Notifications Icon - Mobile */}
        <div className="p-2 rounded-md bg-gray-200 text-gray-600 relative">
          <FaBell size={16} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </div>

        {/* Hamburger Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-md bg-gray-200 text-gray-600 transition-all duration-200 hover:bg-gray-300"
        >
          <div className="transition-transform duration-300">
            {mobileMenuOpen ? <FaTimes size={18} /> : <FaBars size={18} />}
          </div>
        </button>
      </div>

      {/* Close profile dropdown when clicking outside */}
      {openProfileDropdown && (
        <div
          className="fixed inset-0 z-20"
          onClick={() => setOpenProfileDropdown(false)}
        ></div>
      )}
    </nav>

    {/* Mobile Menu Drawer */}
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black z-40 md:hidden transition-opacity duration-300 ease-in-out ${
          mobileMenuOpen ? 'opacity-50' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setMobileMenuOpen(false)}
      ></div>
      
      {/* Drawer */}
      <div className={`fixed top-[0px] right-0 h-[calc(100vh-0px)] w-80 bg-white shadow-xl z-50 overflow-y-auto md:hidden transform transition-transform duration-300 ease-in-out ${
        mobileMenuOpen ? 'translate-x-0' : 'translate-x-full pointer-events-none'
      }`}>
          {/* Close Button Header */}
          <div className="flex justify-end items-center p-4 pb-2 border-b border-gray-200">
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
              aria-label="Close menu"
            >
              <FaTimes size={20} className="text-gray-600" />
            </button>
          </div>
          
          <div className="p-4 pt-2">
            {/* Profile Section */}
            <div className="flex items-center  pb-1 border-b border-gray-200">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-red-400 flex items-center justify-center text-white mr-3">
                <img
                  src={
                    (process.env.NEXT_PUBLIC_CLIENT_FILE_PATH +
                    profile?.client?.image) || "/common-avator.jpg"
                  }
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/common-avator.jpg";
                  }}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="font-bold text-base">
                  {profile?.client?.fname +
                    " " +
                    profile?.client?.last_name}
                </h3>
                <Link
                  href={`/${profile?.client?.username}`}
                  className="text-sm text-blue-600 hover:underline"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  View profile
                </Link>
              </div>
            </div>

            {/* Marketplace */}
            <Link
              href="/marketplace"
              className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-md mb-1"
              onClick={() => setMobileMenuOpen(false)}
            >
              <FaShoppingBag className="mr-3 text-gray-600" />
              <span className="font-medium">Marketplace</span>
            </Link>

            {/* Account Section */}
            <div className="border-t border-gray-200 my-2 pt-2">
              <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase">
                Account
              </div>
              <Link
                href={`/user/user-profile/${profile?.client?.id}`}
                className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-md"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span>Profile</span>
              </Link>
              <Link
                href="/user/account-settings"
                className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-md"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span>Settings & Privacy</span>
              </Link>
              <Link
                href="/user/company"
                className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-md"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span>Companies</span>
              </Link>
              <Link
                href="/user/bank"
                className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-md"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span>Bank</span>
              </Link>
            </div>

            {/* Card Section */}
            <div className="border-t border-gray-200 my-2 pt-2">
              <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase">
                Card
              </div>
              <Link
                href="/user/nfc"
                className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-md"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span>NFC CARD</span>
              </Link>
            </div>

            {/* Shipping Section */}
            <div className="border-t border-gray-200 my-2 pt-2">
              <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase">
                Shipping
              </div>
              <Link
                href="#"
                className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-md"
                onClick={() => setMobileMenuOpen(false)}
              >
                <FaShippingFast className="mr-3 text-gray-500" />
                <span>Shipping order</span>
              </Link>
              <Link
                href="#"
                className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-md"
                onClick={() => setMobileMenuOpen(false)}
              >
                <FaMapMarkerAlt className="mr-3 text-gray-500" />
                <span>Order List</span>
              </Link>
            </div>

            {/* Messages */}
            <div className="border-t border-gray-200 my-2 pt-2">
              <Link
                href="/user/messages"
                className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-md"
                onClick={() => setMobileMenuOpen(false)}
              >
                <FaComment className="mr-3 text-gray-500" />
                <span className="font-medium">Chat</span>
              </Link>
            </div>

            {/* Settings */}
            <div className="border-t border-gray-200 my-2 pt-2">
              <Link
                href="/user/account-settings"
                className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-md"
                onClick={() => setMobileMenuOpen(false)}
              >
                <FaCog className="mr-3 text-gray-500" />
                <span className="font-medium">Settings</span>
              </Link>
            </div>

            {/* Theme Mode */}
            <div className="border-t border-gray-200 my-2 pt-2">
              <div className="px-4 py-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Mode:</span>
                  <div className="flex space-x-2">
                    <button className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center text-white">
                      <FaSun size={14} />
                    </button>
                    <button className="w-8 h-8 bg-gray-200 rounded-md flex items-center justify-center text-gray-600">
                      <FaMoon size={14} />
                    </button>
                    <button className="w-8 h-8 bg-gray-200 rounded-md flex items-center justify-center text-gray-600">
                      <FaAdjust size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Sign Out */}
            <div className="border-t border-gray-200 my-2 pt-2">
              <Link
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                href="/auth/login"
                className="flex items-center px-4 py-3 text-red-600 hover:bg-red-50 rounded-md"
              >
                <FaSignOutAlt className="mr-3" />
                <span className="font-medium">Sign Out</span>
              </Link>
            </div>
          </div>
        </div>
    </>
     {/* <div className="fixed bottom-5 right-5">
        <Link href="/user/messages">
          <button className="bg-blue-500 text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg">
            <FaComment size={20} />
          </button>
        </Link>
      </div> */}
   </>
  );
};

export default SocialNavbar;
