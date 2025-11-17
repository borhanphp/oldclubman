"use client";

import React from 'react';
import SocialNavbar from '@/components/common/SocialNavbar';

const NFCLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <SocialNavbar />
      <main className="w-full">
        {children}
      </main>
    </div>
  );
};

export default NFCLayout;

