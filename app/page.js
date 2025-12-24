"use client";

import React from 'react';
import GatheringContent from '@/views/gathering/feed';
import CommonLayout from '@/components/common/CommonLayout';

export default function Home() {
  return (
    <CommonLayout>
      <div className="gathering-page">
        <GatheringContent />
      </div>
    </CommonLayout>
  );
}
