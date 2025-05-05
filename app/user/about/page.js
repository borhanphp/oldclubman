"use client";

import React from 'react';
import AboutContent from '@/views/about/feed';
import CommonLayout from '@/components/common/CommonLayout';

export default function AboutPage() {
  return (
   <CommonLayout>
     <div className="about-page">
      <AboutContent />
    </div>
   </CommonLayout>
  );
} 