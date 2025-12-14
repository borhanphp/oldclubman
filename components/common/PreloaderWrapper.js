"use client";

import React from "react";
import { useSelector } from "react-redux";
import Preloader from "./PreLoader";

const PreloaderWrapper = () => {
  const { isLoading } = useSelector((state) => state.common);
  
  return <Preloader isLoading={isLoading} />;
};

export default PreloaderWrapper; 