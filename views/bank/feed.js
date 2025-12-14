"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaChevronDown, FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import CompanySidebar from './CompanySidebar';

const CompanyCard = ({ company }) => {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm mb-6">
      <div className="relative h-36 w-full bg-gray-200">
        {company.image ? (
          <Image
            src={company.image}
            alt={company.name}
            fill
            className="object-cover"
            loading="lazy"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-blue-50">
            <div className="text-blue-500 font-bold text-4xl">
              {company.name ? company.name.charAt(0).toUpperCase() : 'C'}
            </div>
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 flex justify-center">
          <div className="flex space-x-1 pb-2">
            <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
            <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
          </div>
        </div>
      </div>
      <div className="p-4 text-center">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">{company.name}</h3>
        <div className="text-blue-500">{company.email}</div>
        <div className="text-blue-500">{company.phone1}</div>
        {company.phone2 && <div className="text-blue-500">{company.phone2}</div>}
      </div>
      <div className="grid grid-cols-2">
        <button className="py-3 text-center border-t bg-blue-50 text-green-600 hover:bg-blue-100 transition">
          <FaEdit className="inline mr-2" />
          Edit
        </button>
        <button className="py-3 text-center border-t bg-red-50 text-red-600 hover:bg-red-100 transition">
          <FaTrash className="inline mr-2" />
          Delete
        </button>
      </div>
    </div>
  );
};

const BankContent = () => {
  const [sortOrder, setSortOrder] = useState('Alphabetical');
  
  // Mock company data
  const companies = [
    {
      id: 1,
      name: 'test',
      email: 'borh200@gmail.com',
      phone1: '01524147845',
      phone2: '01829-521200',
      image: null
    },
    // You can add more mock companies as needed
  ];

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="mx-auto">
        <div className="flex flex-wrap">
          {/* Left Sidebar - User Profile */}
         
          <CompanySidebar/>
          {/* Main Content - Company List */}
          <div className="w-full lg:w-3/4">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-xl font-bold text-gray-800">BANK LIST</h1>
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <button className="flex items-center bg-white border rounded-md px-4 py-2 text-gray-700">
                      {sortOrder}
                      <FaChevronDown className="ml-2 text-gray-500 text-xs" />
                    </button>
                    {/* Sort order dropdown would go here */}
                  </div>
                  <Link href="/user/bank/create" className="bg-blue-500 hover:bg-blue-600 text-white rounded-md px-4 py-2 flex items-center">
                    <FaPlus className="mr-2" />
                    CREATE BANK
                  </Link>
                </div>
              </div>
              
              {/* Company Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {companies.map(company => (
                  <CompanyCard key={company.id} company={company} />
                ))}
                
                {/* If no companies */}
                {companies.length === 0 && (
                  <div className="col-span-3 text-center py-10 text-gray-500">
                    <p>No companies found. Create your first bank.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BankContent; 