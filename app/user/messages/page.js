"use client";

import CommonLayout from '@/components/common/CommonLayout';
import MessagingContent from '@/views/message/feed';
import React from 'react';

export default function MessagingPage() {
  return (
   <CommonLayout>
     <div className="fixed top-[64px] left-0 right-0 bottom-0 w-screen h-[calc(100vh-64px)]  z-[5]">
      <MessagingContent />
    </div>
   </CommonLayout>
  );
} 