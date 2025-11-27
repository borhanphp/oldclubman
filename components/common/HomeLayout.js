"use client";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import FeedHeader from "./FeedHeader";
import ContactsList from "./ContactsList";
import SidebarSearch from "./SidebarSearch";
import SearchResults from "./SearchResults";
import Intro from "./Intro";
import FollowSuggestion from "./FollowSuggestion";

const HomeLayout = ({ children, showMsgBtn, showFriends, userProfile }) => {
  const { query, results } = useSelector((state) => state.search);
  const isAdvancedMode = query === "Advanced Search";
  const showAdvancedOnly =
    isAdvancedMode && Array.isArray(results) && results.length > 0;
  
  const [bgColors, setBgColors] = useState({
    top: 'rgb(212, 167, 154)',
    middle: 'rgb(155, 117, 109)',
    bottom: 'rgb(107, 79, 73)'
  });

  useEffect(() => {
    const handleColorExtraction = (event) => {
      const { colors } = event.detail;
      if (colors && colors.length >= 3) {
        setBgColors({
          top: colors[0],
          middle: colors[0],
          bottom: colors[2]
        });
      }
    };

    window.addEventListener('coverColorsExtracted', handleColorExtraction);
    return () => window.removeEventListener('coverColorsExtracted', handleColorExtraction);
  }, []);

  return (
    <div className="grid grid-cols-11 min-h-screen p-4 gap-4">
      <div className="col-span-11 md:col-span-11 overflow-y-auto">
        {showAdvancedOnly ? (
          <SearchResults />
        ) : (
          <>
            <div 
              className="relative border-b transition-all duration-500"
              style={{
                background: `linear-gradient(to bottom, ${bgColors.top} 0%, ${bgColors.middle} 30%, rgba(255, 255, 255, 0.7) 70%, #EFF2F6 100%)`,
                borderColor: '#EFF2F6'
              }}
            >
            </div>
            <div className="grid grid-cols-11">
              
              <div className="col-span-2 hidden pt-2 md:block sticky top-0 h-screen overflow-y-auto">
                {/* Left sidebar - Search box */}
                {/* <SidebarSearch /> */}
                <Intro/>

                <div className="mt-2">
                <FollowSuggestion/>
                </div>
               
              </div>
            
              <div className="col-span-11 md:col-span-7 overflow-y-auto p-0 md:p-2">
                {children}
              </div>
              <div className="col-span-2 hidden md:block sticky top-0 h-screen">
              <SidebarSearch />
              <ContactsList />
                
              </div>
              
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default HomeLayout;
