"use client";

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { FaTimes, FaImage, FaGlobe, FaLock } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { bindPostData, getGathering, getPosts, initialPostData, storePost, updatePost } from '@/views/gathering/store';
import { getAllFollowers, getMyProfile } from '@/views/settings/store';

const PostModal = ({ isOpen, onClose, editMode = false, editPostId = null, editPostContent = "" }) => {
  const {myFollowers, personalPosts, totalFollowers, profileData} = useSelector(({settings}) => settings)

  const {singlePostData, basicPostData} = useSelector(({gathering}) => gathering)
  const dispatch = useDispatch();
  const [filePreviews, setFilePreviews] = useState([]);
  const [privacyMode, setPrivacyMode] = useState('public');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPrivacyDropdown, setShowPrivacyDropdown] = useState(false);
  const fileInputRef = useRef(null);
  const [removeFiles, setRemoveFiles] = useState([]);

  const {id} = basicPostData;

  useEffect(() => {
    dispatch(getAllFollowers())
    dispatch(getMyProfile())
    return () => {
      dispatch(bindPostData(initialPostData));
      setFilePreviews([]);
    }
  }, [dispatch])

  // Add effect to handle image previews in edit mode
  useEffect(() => {
    if (isOpen && id && basicPostData?.files?.length > 0) {
      const previews = basicPostData.files.map(file => ({
        id: file.id || (Date.now() + Math.random().toString(36).substring(2, 9)),
        src: `${process.env.NEXT_PUBLIC_FILE_PATH}/${file.file_path}`,
      }));
      setFilePreviews(previews);
    }
  }, [isOpen, editMode, basicPostData, dispatch]);

  const handleOnchange = (e) => {
    const {name, value} = e.target;
    dispatch(bindPostData({...basicPostData, [name]: value}))
  }

  const handleFilesChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length > 0) {
      dispatch(bindPostData({
        ...basicPostData, 
        files: [...(basicPostData.files || []), ...selectedFiles]
      }));
      
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
      dispatch(bindPostData({
        ...basicPostData,
        files: [...(basicPostData.files || []), ...droppedFiles]
      }));
      
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
      // If the file has an id (existing file), add to removeFiles
      if (previewToRemove.id && typeof previewToRemove.id === 'number') {
        setRemoveFiles(prev => [...prev, previewToRemove.id]);
      }
      // Remove from previews
      setFilePreviews(filePreviews.filter(preview => preview.id !== idToRemove));
      // Remove from basicPostData.files as well
      dispatch(bindPostData({
        ...basicPostData,
        files: basicPostData.files.filter(file => {
          // For new files, compare by object reference
          if (file instanceof File) {
            return file !== previewToRemove.file;
          }
          // For existing files, compare by id
          return file.id !== previewToRemove.id;
        })
      }));
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };
  
  const handlePrivacyChange = (mode) => {
    dispatch(bindPostData({...basicPostData, privacy_mode: mode}))
    setPrivacyMode(mode);
    setShowPrivacyDropdown(false);
  };
  
  const handlePost = async () => {    
    try {
      setIsSubmitting(true);
      
      // Create FormData for API request
      const formData = new FormData();
      formData.append('message', basicPostData.message);
      formData.append('privacy_mode', basicPostData.privacy_mode);
      
      // Add files if present
      if (basicPostData.files?.length > 0) {
        basicPostData.files.forEach((file, index) => {
          if (file instanceof File) {
            formData.append(`files[${index}]`, file);
          }
        });
      }

      // Add remove_files if any
      if (removeFiles.length > 0) {
        formData.append('removefiles', JSON.stringify(removeFiles));
      }

      const action = id ? updatePost({ id, ...Object.fromEntries(formData) }) : storePost(formData);
      dispatch(action).unwrap()
        .then(() => {
          dispatch(getPosts());
          dispatch(bindPostData(initialPostData));
          setFilePreviews([]);
          setRemoveFiles([]);
          onClose();
        });
    } catch (error) {
      console.error('Error posting:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30">
      <div className="bg-white backdrop-blur-md rounded-lg w-full max-w-lg mx-4 shadow-xl">
        <div className="flex justify-between items-center p-4">
          <h2 className="text-xl font-semibold">{editMode ? 'Edit Post' : 'Add post photo'}</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FaTimes size={20} />
          </button>
        </div>
        
        <div className="p-4">
          <div className="flex mb-2">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-blue-400 flex items-center justify-center text-white mr-3">
            <img src='/common-avator.jpg'/>
            </div>
            <div className="flex-1">
              <textarea
                name="message"
                value={basicPostData?.message}
                onChange={(e) => {handleOnchange(e)}}
                placeholder="Share your thoughts..."
                className="w-full border-0 resize-none outline-none text-gray-700 p-2 bg-transparent"
                rows={3}
              />
            </div>
          </div>
          <div className="flex items-center mb-5">
                <div className="relative">
                  <button 
                    onClick={() => setShowPrivacyDropdown(!showPrivacyDropdown)}
                    className="flex items-center text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full"
                  >
                    {basicPostData?.privacy_mode === 'public' ? (
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
                    <div className="absolute left-0 mt-1 bg-white shadow-md rounded-md z-10 w-36 overflow-hidden">
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
        
        <div className="flex justify-end gap-2 p-4">
          <button
            onClick={onClose}
            className="px-4 py-2 cursor-pointer rounded-md bg-red-50 text-red-500 hover:bg-red-100 transition"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            onClick={handlePost}
            className="px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 cursor-pointer transition"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Posting...' : (id ? 'Update' : 'Post')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostModal; 