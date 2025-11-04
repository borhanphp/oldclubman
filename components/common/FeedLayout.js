"use client";
import React from "react";
import { useSelector } from "react-redux";
import FeedHeader from "./FeedHeader";
import ContactsList from "./ContactsList";
import SidebarSearch from "./SidebarSearch";
import SearchResults from "./SearchResults";

const FeedLayout = ({ 
  children,
  showMsgBtn, showFriends, userProfile,
 }) => {
  const { query, results } = useSelector(state => state.search);
  const isAdvancedMode = query === 'Advanced Search';
  const showAdvancedOnly = isAdvancedMode && Array.isArray(results) && results.length > 0;
  return (
    <div className="grid grid-cols-11 min-h-screen">
      <div className="col-span-2 hidden md:block sticky top-0 h-screen overflow-y-auto">
        {/* Left sidebar - Search box */}
        <SidebarSearch />
      </div>
      <div className="col-span-11 md:col-span-7 overflow-y-auto">
        {showAdvancedOnly ? (
          <SearchResults />
        ) : (
          <>
            <FeedHeader showMsgBtn={showMsgBtn} showFriends={showFriends} userProfile={userProfile}/>
            {children}
          </>
        )}
      </div>
      <div className="col-span-2 hidden md:block sticky top-0 h-screen">
        <ContactsList />
      </div>
    </div>
  );
};

export default FeedLayout;
