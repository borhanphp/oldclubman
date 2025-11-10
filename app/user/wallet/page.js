"use client";

import CommonLayout from '@/components/common/CommonLayout';
import WalletDashboard from '@/views/wallet/feed';
import React from 'react';

export default function WalletPage() {
  return (
    <CommonLayout>
      <div className="wallet-page">
        <WalletDashboard />
      </div>
    </CommonLayout>
  );
}

