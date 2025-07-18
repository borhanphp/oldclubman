"use client";
import React from "react";
import FeedHeader from "./FeedHeader";
import ContactsList from "./ContactsList";
import SidebarSearch from "./SidebarSearch";

const FeedLayout = ({ 
  children,
  showMsgBtn, showFriends, userProfile,
 }) => {
  return (
    <div className="grid grid-cols-11 min-h-screen">
      <div className="col-span-2 sticky top-0 h-screen overflow-y-auto">
        {/* Left sidebar - Search box */}
        <SidebarSearch />
      </div>
      <div className="col-span-7 overflow-y-auto">
        <FeedHeader showMsgBtn={showMsgBtn} showFriends={showFriends} userProfile={userProfile}/>
        {children}
      </div>
      <div className="col-span-2 sticky top-0 h-screen">
        <ContactsList />
      </div>
    </div>
  );
};

export default FeedLayout;
