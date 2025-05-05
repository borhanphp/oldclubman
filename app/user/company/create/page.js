"use client";

import CommonLayout from '@/components/common/CommonLayout';
import CreateCompanyForm from '@/views/company/form';
import React from 'react';

export default function CreateCompanyPage() {
  return (
    <CommonLayout>
      <div className="create-company-page">
      <CreateCompanyForm />
    </div>
    </CommonLayout>
  );
} 