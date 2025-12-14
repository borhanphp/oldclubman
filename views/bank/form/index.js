"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { FaArrowLeft, FaUpload } from 'react-icons/fa';
import CompanySidebar from '../CompanySidebar';

const CreateBankForm = () => {
  const [formData, setFormData] = useState({
    bank_name: '',
    branch_name: '',
    rtn_number: '',
    swift_code: '',
    contact_no: '',
    email: '',
    city: '',
    state: '',
    zip_code: '',
    bank_logo: null,
    bank_image: null,
    address: ''
  });
  
  const [logoPreview, setLogoPreview] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        [type]: file
      });
      
      // Create a preview of the image
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === 'bank_logo') {
          setLogoPreview(reader.result);
        } else {
          setImagePreview(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the data to your backend
    console.log('Form submitted:', formData);
  };
  
  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="mx-auto">
        <div className="flex flex-wrap">
          <CompanySidebar/>
          <div className="w-full lg:w-3/4">
            <div className="bg-gray-100 min-h-screen">
              <div className="container mx-auto">
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center mb-6">
                    <Link href="/user/bank" className="text-blue-500 mr-4">
                      <FaArrowLeft />
                    </Link>
                    <h1 className="text-xl font-bold text-gray-800">Add New Bank</h1>
                  </div>
                  
                  <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Left column */}
                      <div>
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Bank Name <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            name="bank_name"
                            value={formData.bank_name}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                          />
                        </div>
                        
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Branch Name <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            name="branch_name"
                            value={formData.branch_name}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                          />
                        </div>
                        
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            RTN Number <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            name="rtn_number"
                            value={formData.rtn_number}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                          />
                        </div>
                        
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Swift Code <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            name="swift_code"
                            value={formData.swift_code}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                          />
                        </div>
                        
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Contact no
                          </label>
                          <input
                            type="text"
                            name="contact_no"
                            value={formData.contact_no}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                          />
                        </div>
                      </div>
                      
                      {/* Right column */}
                      <div>
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            City <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                          />
                        </div>
                        
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            State <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            name="state"
                            value={formData.state}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                          />
                        </div>
                        
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Zip Code <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            name="zip_code"
                            value={formData.zip_code}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                          />
                        </div>
                        
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Bank Logo <span className="text-red-500">*</span>
                          </label>
                          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                            <div className="space-y-1 text-center">
                              {logoPreview ? (
                                <div className="relative">
                                  <img
                                    src={logoPreview}
                                    alt="Logo Preview"
                                    className="mx-auto h-32 w-auto object-contain"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setLogoPreview(null);
                                      setFormData({
                                        ...formData,
                                        bank_logo: null
                                      });
                                    }}
                                    className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full"
                                  >
                                    &times;
                                  </button>
                                </div>
                              ) : (
                                <>
                                  <FaUpload className="mx-auto h-12 w-12 text-gray-400" />
                                  <div className="flex text-sm text-gray-600">
                                    <label
                                      htmlFor="logo-upload"
                                      className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none"
                                    >
                                      <span>Upload logo</span>
                                      <input
                                        id="logo-upload"
                                        name="bank_logo"
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => handleFileChange(e, 'bank_logo')}
                                        className="sr-only"
                                        required
                                      />
                                    </label>
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Bank Image
                          </label>
                          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                            <div className="space-y-1 text-center">
                              {imagePreview ? (
                                <div className="relative">
                                  <img
                                    src={imagePreview}
                                    alt="Image Preview"
                                    className="mx-auto h-32 w-auto object-contain"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setImagePreview(null);
                                      setFormData({
                                        ...formData,
                                        bank_image: null
                                      });
                                    }}
                                    className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full"
                                  >
                                    &times;
                                  </button>
                                </div>
                              ) : (
                                <>
                                  <FaUpload className="mx-auto h-12 w-12 text-gray-400" />
                                  <div className="flex text-sm text-gray-600">
                                    <label
                                      htmlFor="image-upload"
                                      className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none"
                                    >
                                      <span>Upload image</span>
                                      <input
                                        id="image-upload"
                                        name="bank_image"
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => handleFileChange(e, 'bank_image')}
                                        className="sr-only"
                                      />
                                    </label>
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Address <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        rows="3"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      ></textarea>
                    </div>
                    
                    <div className="mt-6 flex justify-end space-x-4">
                      <Link href="/user/bank" className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
                        Cancel
                      </Link>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md"
                      >
                        Save Bank
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateBankForm; 