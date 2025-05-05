"use client";

import CommonLayout from '@/components/common/CommonLayout';
import MessagingContent from '@/views/message/feed';
import React from 'react';

export default function MessagingPage() {
  return (
   <CommonLayout>
     <div className="messaging-page">
      <MessagingContent />
    </div>
   </CommonLayout>
  );
} 