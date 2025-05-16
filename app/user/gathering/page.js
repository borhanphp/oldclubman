"use client";

import React from 'react';
import GatheringContent from '@/views/gathering/feed';
import CommonLayout from '@/components/common/CommonLayout';
import { useSelector } from 'react-redux';

export default function GatheringPage() {
  return (
    <>
    <CommonLayout>
      <div className="gathering-page">
      <GatheringContent />
    </div>
    </CommonLayout>
    </>
  );
} 