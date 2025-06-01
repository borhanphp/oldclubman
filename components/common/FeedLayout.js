"use client";
import React from "react";
import FeedHeader from "./FeedHeader";

const FeedLayout = ({ children }) => {
  return (
    <div className="">
      <div className="mx-auto">
        <FeedHeader />
        {children}
      </div>
    </div>
  );
};

export default FeedLayout;
