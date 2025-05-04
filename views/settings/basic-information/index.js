"use client";

import React from 'react';

const BasicInformation = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-8">Basic Information</h2>
      
      <form>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-600 mb-2">
              First name
            </label>
            <input
              type="text"
              id="firstName"
              className="w-full h-11 border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="First name"
              defaultValue="Borhan"
            />
          </div>
          
          <div>
            <label htmlFor="middleName" className="block text-sm font-medium text-gray-600 mb-2">
              Middle name
            </label>
            <input
              type="text"
              id="middleName"
              className="w-full h-11 border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Middle name"
            />
          </div>
          
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-600 mb-2">
              Last name
            </label>
            <input
              type="text"
              id="lastName"
              className="w-full h-11 border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Last name"
              defaultValue="Uddin"
            />
          </div>
        </div>
        
        <div className="mb-6">
          <label htmlFor="displayName" className="block text-sm font-medium text-gray-600 mb-2">
            Display name
          </label>
          <input
            type="text"
            id="displayName"
            className="w-full h-11 border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Display name"
          />
        </div>
        
        <div className="mb-6">
          <label htmlFor="username" className="block text-sm font-medium text-gray-600 mb-2">
            User name
          </label>
          <input
            type="text"
            id="username"
            className="w-full h-11 border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Username"
            defaultValue="uddin5"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-600 mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full h-11 border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Email address"
              defaultValue="borhanidb@gmail.com"
            />
          </div>
          
          <div>
            <label htmlFor="dob" className="block text-sm font-medium text-gray-600 mb-2">
              Date of Birth
            </label>
            <div className="relative">
              <input
                type="text"
                id="dob"
                className="w-full h-11 border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="MM/DD/YYYY"
                defaultValue="09/20/1996"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div>
            <label htmlFor="nationality" className="block text-sm font-medium text-gray-600 mb-2">
              Nationality
            </label>
            <select
              id="nationality"
              className="w-full h-11 border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
            >
              <option value="">Select country</option>
              <option value="us">United States</option>
              <option value="ca">Canada</option>
              <option value="uk">United Kingdom</option>
              <option value="au">Australia</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="countryCode" className="block text-sm font-medium text-gray-600 mb-2">
              Country Code
            </label>
            <input
              type="text"
              id="countryCode"
              className="w-full h-11 border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="+1"
            />
          </div>
          
          <div>
            <label htmlFor="contact" className="block text-sm font-medium text-gray-600 mb-2">
              Contact
            </label>
            <input
              type="text"
              id="contact"
              className="w-full h-11 border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Phone number"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label htmlFor="photoIdType" className="block text-sm font-medium text-gray-600 mb-2">
              Photo ID Type
            </label>
            <select
              id="photoIdType"
              className="w-full h-11 border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
              defaultValue="passport"
            >
              <option value="">Select ID type</option>
              <option value="passport">Passport</option>
              <option value="driver">Driver's License</option>
              <option value="national">National ID</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="photoIdNo" className="block text-sm font-medium text-gray-600 mb-2">
              Photo ID No
            </label>
            <input
              type="text"
              id="photoIdNo"
              className="w-full h-11 border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="ID number"
            />
          </div>
        </div>
        
        <div className="mt-8">
          <button type="submit" className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition">
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default BasicInformation;
