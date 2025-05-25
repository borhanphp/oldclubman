"use client";

import CommonLayout from '@/components/common/CommonLayout';
import CreateBankForm from '@/views/bank/form';
import CreateCompanyForm from '@/views/company/form';
import React from 'react';

export default function CreateBankPage() {
  return (
    <CommonLayout>
      <div className="create-company-page">
      <CreateBankForm />
    </div>
    </CommonLayout>
  );
} 