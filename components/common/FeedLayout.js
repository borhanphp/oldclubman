"use client";
import React from "react";
import FeedHeader from "./FeedHeader";

const FeedLayout = ({ children }) => {
  return (
    <div className="">
      <div className="md:max-w-5xl mx-auto">
        <FeedHeader />
        {children}
      </div>
    </div>
  );
};

export default FeedLayout;
