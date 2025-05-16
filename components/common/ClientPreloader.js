"use client";

import React from "react";
import dynamic from "next/dynamic";

const PreloaderWrapper = dynamic(() => import("./PreloaderWrapper"), {
  ssr: false,
});

const ClientPreloader = () => {
  return <PreloaderWrapper />;
};

export default ClientPreloader; 