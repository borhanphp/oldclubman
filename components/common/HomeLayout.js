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
     <BodyLayout>
          <div className="flex flex-wrap">
            {/* Left Sidebar - Profile */}
            <div className="hidden lg:block lg:w-1/4 lg:mb-0 lg:pr-2">
              <Intro />
              <div className="mt-2">
                <FollowSuggestion />
              </div>
            </div>

            {/* Center Content */}
            <div className="w-full lg:w-2/4">{children}</div>

            {/* Right Sidebar - Search & Contacts */}
            <div className="hidden lg:block lg:w-1/4 lg:mb-0 lg:pr-6">
              <SidebarSearch />
              <ContactsList />
            </div>
          </div>
          </BodyLayout>
    </>
  );
};

export default HomeLayout;
