"use client";

import CommonLayout from '@/components/common/CommonLayout';
import NotificationsView from '@/views/notification/NotificationsView';
import React, { Suspense } from 'react';

export default function NotificationsPage() {
  return (
    <CommonLayout>
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading notifications...</p>
          </div>
        </div>
      }>
        <NotificationsView />
      </Suspense>
    </CommonLayout>
  );
}

