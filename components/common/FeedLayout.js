"use client";
import React from "react";
import FeedHeader from "./FeedHeader";
import ContactsList from "./ContactsList";

const FeedLayout = ({ 
  children,
  showMsgBtn, showFriends, userProfile,
 }) => {
  return (
    <div className="grid grid-cols-5 min-h-screen">
      <div className="col-span-1 sticky top-0 h-screen overflow-y-auto">
        {/* Left sidebar - can be used for navigation or other widgets */}
        
      </div>
      <div className="col-span-3 overflow-y-auto">
        <FeedHeader showMsgBtn={showMsgBtn} showFriends={showFriends} userProfile={userProfile}/>
        {children}
      </div>
      <div className="col-span-1 sticky top-0 h-screen">
        <ContactsList />
      </div>
    </div>
  );
};

export default FeedLayout;
