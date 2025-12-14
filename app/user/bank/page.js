"use client";

import CommonLayout from '@/components/common/CommonLayout';
import BankContent from '@/views/bank/feed';
import CompanyContent from '@/views/company/feed';
import React from 'react';

export default function BankPage() {
  return (
    <CommonLayout>
    <div className="company-page">
      <BankContent />
    </div>
    </CommonLayout>
  );
} 