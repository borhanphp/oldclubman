"use client";

import CommonLayout from '@/components/common/CommonLayout';
import CompanyContent from '@/views/company/feed';
import React from 'react';

export default function CompanyPage() {
  return (
    <CommonLayout>
    <div className="company-page">
      <CompanyContent />
    </div>
    </CommonLayout>
  );
} 