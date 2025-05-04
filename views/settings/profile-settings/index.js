"use client";

import React, { useState, useRef } from 'react';

const ProfileSettings = () => {
  const [profileOverview, setProfileOverview] = useState('');
  const [tagline, setTagline] = useState('');
  const profilePhotoRef = useRef(null);
  const coverPhotoRef = useRef(null);
  
  const handleProfileOverviewChange = (e) => {
    if (e.target.value.length <= 300) {
      setProfileOverview(e.target.value);
    }
  };
  
  const handleTaglineChange = (e) => {
    if (e.target.value.length <= 14) {
      setTagline(e.target.value);
    }
  };
  
  const triggerProfilePhotoUpload = () => {
    profilePhotoRef.current.click();
  };
  
  const triggerCoverPhotoUpload = () => {
    coverPhotoRef.current.click();
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-8">Profile Settings</h2>
      
      <form>
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-600">
              Profile Photo <span className="text-gray-500 text-sm font-normal">Recomended Size (128×128)</span>
            </label>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              type="button" 
              onClick={triggerProfilePhotoUpload}
              className="px-4 py-2 border border-gray-300 rounded-md bg-white text-sm text-gray-700 hover:bg-gray-50 focus:outline-none"
            >
              Choose File
            </button>
            <span className="text-gray-500 text-sm">No file chosen</span>
            <input 
              type="file" 
              ref={profilePhotoRef} 
              className="hidden" 
              accept="image/*"
            />
          </div>
        </div>
        
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-600">
              Cover Photo <span className="text-gray-500 text-sm font-normal">Recomended Size (1090×250)</span>
            </label>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              type="button" 
              onClick={triggerCoverPhotoUpload}
              className="px-4 py-2 border border-gray-300 rounded-md bg-white text-sm text-gray-700 hover:bg-gray-50 focus:outline-none"
            >
              Choose File
            </button>
            <span className="text-gray-500 text-sm">No file chosen</span>
            <input 
              type="file" 
              ref={coverPhotoRef} 
              className="hidden" 
              accept="image/*"
            />
          </div>
        </div>
        
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="profileOverview" className="block text-sm font-medium text-gray-600">
              Profile Overview <span className="text-gray-500 text-sm font-normal">(For Intro)</span>
            </label>
          </div>
          
          <textarea
            id="profileOverview"
            rows={5}
            className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Profile Overview (Required)"
            value={profileOverview}
            onChange={handleProfileOverviewChange}
          ></textarea>
          
          <div className="text-right mt-1">
            <span className="text-sm text-gray-500">Character limit: {300 - profileOverview.length}</span>
          </div>
        </div>
        
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="tagline" className="block text-sm font-medium text-gray-600">
              Tagline <span className="text-gray-500 text-sm font-normal">(For Intro)</span>
            </label>
          </div>
          
          <textarea
            id="tagline"
            rows={3}
            className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Tagline (Required)"
            value={tagline}
            onChange={handleTaglineChange}
          ></textarea>
          
          <div className="text-right mt-1">
            <span className="text-sm text-gray-500">Character limit: {14 - tagline.length}</span>
          </div>
        </div>
        
        <div className="mt-8">
          <button 
            type="submit" 
            className="bg-blue-500 text-white px-6 py-2.5 rounded-md hover:bg-blue-600 transition"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileSettings;
