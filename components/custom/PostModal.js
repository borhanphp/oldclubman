"use client";

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { FaTimes, FaImage, FaGlobe, FaLock } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { getGathering, storePost } from '@/views/gathering/store';

const PostModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const [postText, setPostText] = useState('');
  const [files, setFiles] = useState([]);
  const [filePreviews, setFilePreviews] = useState([]);
  const [privacyMode, setPrivacyMode] = useState('public');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPrivacyDropdown, setShowPrivacyDropdown] = useState(false);
  const fileInputRef = useRef(null);

  const handleTextChange = (e) => {
    setPostText(e.target.value);
  };

  const handleFilesChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length > 0) {
      setFiles(prev => [...prev, ...selectedFiles]);
      
      // Generate previews for the new files
      selectedFiles.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFilePreviews(prev => [...prev, {
            id: Date.now() + Math.random().toString(36).substring(2, 9),
            src: reader.result,
            file: file
          }]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.dataTransfer.files.length > 0) {
      const droppedFiles = Array.from(e.dataTransfer.files);
      setFiles(prev => [...prev, ...droppedFiles]);
      
      // Generate previews for the new files
      droppedFiles.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFilePreviews(prev => [...prev, {
            id: Date.now() + Math.random().toString(36).substring(2, 9),
            src: reader.result,
            file: file
          }]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleRemoveFile = (idToRemove) => {
    const previewToRemove = filePreviews.find(preview => preview.id === idToRemove);
    if (previewToRemove) {
      // Remove the file from the files array
      setFiles(files.filter(file => file !== previewToRemove.file));
      // Remove the preview
      setFilePreviews(filePreviews.filter(preview => preview.id !== idToRemove));
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };
  
  const handlePrivacyChange = (mode) => {
    setPrivacyMode(mode);
    setShowPrivacyDropdown(false);
  };
  
  const handlePost = async () => {
    if (!postText.trim() && files.length === 0) return;
    
    try {
      setIsSubmitting(true);
      
      // Create FormData for API request
      const formData = new FormData();
      formData.append('message', postText);
      formData.append('privacy_mode', privacyMode);
      
      // Add files if present
      if (files.length > 0) {
        files.forEach((file, index) => {
          formData.append(`files[${index}]`, file);
        });
      }
      
      // Dispatch action to store post
      await dispatch(storePost(formData)).unwrap()
      .then((res) => {
        dispatch(getGathering())
      })
      
      // Reset form and close modal
      setPostText('');
      setFiles([]);
      setFilePreviews([]);
      setPrivacyMode('public');
      onClose();
    } catch (error) {
      console.error('Error posting:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30">
      <div className="bg-white/95 backdrop-blur-md rounded-lg w-full max-w-lg mx-4 shadow-xl">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">Add post photo</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FaTimes size={20} />
          </button>
        </div>
        
        <div className="p-4">
          <div className="flex mb-4">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-blue-400 flex items-center justify-center text-white mr-3">
              BU
            </div>
            <div className="flex-1">
              <textarea
                value={postText}
                onChange={handleTextChange}
                placeholder="Share your thoughts..."
                className="w-full border-0 resize-none outline-none text-gray-700 p-2 bg-transparent"
                rows={3}
              />
              
              <div className="flex items-center mt-1">
                <div className="relative">
                  <button 
                    onClick={() => setShowPrivacyDropdown(!showPrivacyDropdown)}
                    className="flex items-center text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full"
                  >
                    {privacyMode === 'public' ? (
                      <>
                        <FaGlobe className="mr-1" /> 
                        <span>Public</span>
                      </>
                    ) : (
                      <>
                        <FaLock className="mr-1" /> 
                        <span>Private</span>
                      </>
                    )}
                  </button>
                  
                  {showPrivacyDropdown && (
                    <div className="absolute top-full left-0 mt-1 bg-white shadow-md rounded-md z-10 w-36 overflow-hidden">
                      <button 
                        onClick={() => handlePrivacyChange('public')}
                        className="flex items-center w-full px-3 py-2 text-sm hover:bg-gray-100"
                      >
                        <FaGlobe className="mr-2" /> 
                        <span>Public</span>
                      </button>
                      <button 
                        onClick={() => handlePrivacyChange('private')}
                        className="flex items-center w-full px-3 py-2 text-sm hover:bg-gray-100"
                      >
                        <FaLock className="mr-2" /> 
                        <span>Private</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <div className="mb-4">
            <p className="text-gray-500 mb-2">Upload attachments</p>
            <div 
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer bg-white/50 hover:bg-white/70 transition"
              onClick={() => fileInputRef.current?.click()}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              {filePreviews.length > 0 ? (
                <div>
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    {filePreviews.map(preview => (
                      <div key={preview.id} className="relative">
                        <img 
                          src={preview.src} 
                          alt="Upload preview" 
                          className="h-32 w-full object-cover rounded"
                        />
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveFile(preview.id);
                          }}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
                        >
                          <FaTimes size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                  <p className="text-blue-500 text-sm mt-2">Add more files</p>
                </div>
              ) : (
                <div>
                  <div className="flex justify-center mb-2">
                    <div className="w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center">
                      <FaImage className="text-gray-400 text-3xl" />
                    </div>
                  </div>
                  <p className="text-gray-500">Drag here or click to upload photos.</p>
                </div>
              )}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFilesChange}
                accept="image/*"
                className="hidden"
                multiple
              />
            </div>
          </div>
        </div>
        
        <div className="flex justify-end gap-2 p-4 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md bg-red-50 text-red-500 hover:bg-red-100 transition"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            onClick={handlePost}
            className="px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 transition"
            disabled={(!postText.trim() && files.length === 0) || isSubmitting}
          >
            {isSubmitting ? 'Posting...' : 'Post'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostModal; 