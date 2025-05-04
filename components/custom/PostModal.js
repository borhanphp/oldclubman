"use client";

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { FaTimes, FaImage } from 'react-icons/fa';

const PostModal = ({ isOpen, onClose }) => {
  const [postText, setPostText] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleTextChange = (e) => {
    setPostText(e.target.value);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setImage(file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };
  
  const handlePost = () => {
    // Here you would typically send the postText and image to your backend
    console.log('Posting:', { text: postText, image });
    
    // Reset form and close modal
    setPostText('');
    setImage(null);
    setImagePreview(null);
    onClose();
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
            <textarea
              value={postText}
              onChange={handleTextChange}
              placeholder="Share your thoughts..."
              className="flex-1 border-0 resize-none outline-none text-gray-700 p-2 bg-transparent"
              rows={3}
            />
          </div>
          
          <div className="mb-4">
            <p className="text-gray-500 mb-2">Upload attachment</p>
            <div 
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer bg-white/50 hover:bg-white/70 transition"
              onClick={() => fileInputRef.current?.click()}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              {imagePreview ? (
                <div className="relative">
                  <img 
                    src={imagePreview} 
                    alt="Upload preview" 
                    className="max-h-64 mx-auto"
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setImage(null);
                      setImagePreview(null);
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
                  >
                    <FaTimes size={16} />
                  </button>
                </div>
              ) : (
                <div>
                  <div className="flex justify-center mb-2">
                    <div className="w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center">
                      <FaImage className="text-gray-400 text-3xl" />
                    </div>
                  </div>
                  <p className="text-gray-500">Drag here or click to upload photo.</p>
                </div>
              )}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                className="hidden"
              />
            </div>
          </div>
        </div>
        
        <div className="flex justify-end gap-2 p-4 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md bg-red-50 text-red-500 hover:bg-red-100 transition"
          >
            Cancel
          </button>
          <button
            onClick={handlePost}
            className="px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 transition"
            disabled={!postText.trim() && !image}
          >
            Post
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostModal; 