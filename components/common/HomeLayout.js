"use client";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import FeedHeader from "./FeedHeader";
import ContactsList from "./ContactsList";
import SidebarSearch from "./SidebarSearch";
import SearchResults from "./SearchResults";
import Intro from "./Intro";
import FollowSuggestion from "./FollowSuggestion";
import BodyLayout from "./BodyLayout";

const HomeLayout = ({ children, showMsgBtn, showFriends, userProfile }) => {
  const { query, results } = useSelector((state) => state.search);
  const isAdvancedMode = query === "Advanced Search";
  const showAdvancedOnly =
    isAdvancedMode && Array.isArray(results) && results.length > 0;

  const [bgColors, setBgColors] = useState({
    top: "rgb(212, 167, 154)",
    middle: "rgb(155, 117, 109)",
    bottom: "rgb(107, 79, 73)",
  });

  useEffect(() => {
    const handleColorExtraction = (event) => {
      const { colors } = event.detail;
      if (colors && colors.length >= 3) {
        setBgColors({
          top: colors[0],
          middle: colors[0],
          bottom: colors[2],
        });
      }
    };

    window.addEventListener("coverColorsExtracted", handleColorExtraction);
    return () =>
      window.removeEventListener("coverColorsExtracted", handleColorExtraction);
  }, []);

  return (
    <>
     <style jsx>{`
       .sidebar-scroll::-webkit-scrollbar {
         width: 6px;
       }
       .sidebar-scroll::-webkit-scrollbar-track {
         background: transparent;
       }
       .sidebar-scroll::-webkit-scrollbar-thumb {
         background: transparent;
         border-radius: 10px;
       }
       .sidebar-scroll:hover::-webkit-scrollbar-thumb {
         background: #CBD5E0;
       }
       .sidebar-scroll::-webkit-scrollbar-thumb:hover {
         background: #94A3B8;
       }
       .sidebar-scroll {
         scrollbar-width: thin;
         scrollbar-color: transparent transparent;
       }
       .sidebar-scroll:hover {
         scrollbar-color: #CBD5E0 #F7FAFC;
       }
     `}</style>
     <BodyLayout>
          <div className="flex flex-wrap">
            {/* Left Sidebar - Profile - Sticky */}
            <div className="hidden lg:block lg:w-1/4 lg:mb-0 lg:pr-2">
              <div className="sidebar-scroll sticky top-20 max-h-[calc(100vh-5rem)] overflow-y-auto">
                <Intro />
                <div className="mt-2">
                  <FollowSuggestion />
                </div>
              </div>
            </div>

            {/* Center Content - Scrollable */}
            <div className="w-full lg:w-2/4">{children}</div>

            {/* Right Sidebar - Search & Contacts - Sticky */}
            <div className="hidden lg:block lg:w-1/4 lg:mb-0 lg:pr-6">
              <div className="sidebar-scroll sticky top-20 max-h-[calc(100vh-5rem)] overflow-y-auto">
                <SidebarSearch />
                <ContactsList />
              </div>
            </div>
          </div>
          </BodyLayout>
    </>
  );
};

export default HomeLayout;
