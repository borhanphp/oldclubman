"use client";

import React, { useState, useRef } from 'react';
import { storeProfileSetting } from '../store';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';

const ProfileSettings = () => {
  const {profileData} = useSelector(({settings}) => settings)
  const [profileOverview, setProfileOverview] = useState('');
  const [tagline, setTagline] = useState('');
  const [profilePhotoFile, setProfilePhotoFile] = useState(null);
  const [coverPhotoFile, setCoverPhotoFile] = useState(null);
  const [profilePhotoPreview, setProfilePhotoPreview] = useState(null);
  const [coverPhotoPreview, setCoverPhotoPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const dispatch = useDispatch();
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
  
  const handleProfilePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePhotoFile(file);
      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        setProfilePhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleCoverPhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverPhotoFile(file);
      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        setCoverPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const triggerProfilePhotoUpload = () => {
    profilePhotoRef.current.click();
  };
  
  const triggerCoverPhotoUpload = () => {
    coverPhotoRef.current.click();
  };
  
  const storeProfileSettings = async (e) => {
    e.preventDefault();
    
    try {
      setIsSubmitting(true);
      setErrorMessage('');
      
      // Create FormData object
      const formData = new FormData();
      
      // Add text fields
      formData.append('profile_overview', profileOverview);
      formData.append('tagline', tagline);
      
      // Add files if they exist
      if (profilePhotoFile) {
        formData.append('profilePhoto', profilePhotoFile);
      }
      
      if (coverPhotoFile) {
        formData.append('coverPhoto', coverPhotoFile);
      }
      
      dispatch(storeProfileSetting(formData))
      .then((res) => {
        toast.success("Successfully Updated")
      })
    } catch (error) {
      console.error('Error saving profile settings:', error);
      setErrorMessage('Failed to save profile settings. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-8">Profile Settings</h2>
      
      {successMessage && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
          {successMessage}
        </div>
      )}
      
      {errorMessage && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {errorMessage}
        </div>
      )}
      
      <form onSubmit={storeProfileSettings}>
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-600">
              Profile Photo <span className="text-gray-500 text-sm font-normal">Recommended Size (128×128)</span>
            </label>
          </div>
          
          <div className="flex items-center gap-3">
            {profilePhotoPreview && (
              <div className="w-16 h-16 rounded-full overflow-hidden mr-2">
                <img src={profilePhotoPreview} alt="Profile Preview" className="w-full h-full object-cover" />
              </div>
            )}
            <button 
              type="button" 
              onClick={triggerProfilePhotoUpload}
              className="px-4 py-2 border border-gray-300 rounded-md bg-white text-sm text-gray-700 hover:bg-gray-50 focus:outline-none"
            >
              Choose File
            </button>
            <span className="text-gray-500 text-sm">
              {profilePhotoFile ? profilePhotoFile.name : 'No file chosen'}
            </span>
            <input 
              type="file" 
              ref={profilePhotoRef} 
              className="hidden" 
              accept="image/*"
              onChange={handleProfilePhotoChange}
            />
          </div>
        </div>
        
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-600">
              Cover Photo <span className="text-gray-500 text-sm font-normal">Recommended Size (1090×250)</span>
            </label>
          </div>
          
          <div className="flex items-center gap-3">
            {coverPhotoPreview && (
              <div className="w-24 h-12 rounded overflow-hidden mr-2">
                <img src={coverPhotoPreview} alt="Cover Preview" className="w-full h-full object-cover" />
              </div>
            )}
            <button 
              type="button" 
              onClick={triggerCoverPhotoUpload}
              className="px-4 py-2 border border-gray-300 rounded-md bg-white text-sm text-gray-700 hover:bg-gray-50 focus:outline-none"
            >
              Choose File
            </button>
            <span className="text-gray-500 text-sm">
              {coverPhotoFile ? coverPhotoFile.name : 'No file chosen'}
            </span>
            <input 
              type="file" 
              ref={coverPhotoRef} 
              className="hidden" 
              accept="image/*"
              onChange={handleCoverPhotoChange}
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
            required
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
            required
          ></textarea>
          
          <div className="text-right mt-1">
            <span className="text-sm text-gray-500">Character limit: {14 - tagline.length}</span>
          </div>
        </div>
        
        <div className="mt-8">
          <button 
            type="submit" 
            className={`${isSubmitting ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'} text-white px-6 py-2.5 rounded-md transition`}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileSettings;
