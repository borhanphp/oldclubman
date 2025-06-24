"use client";

import React, { useState, useRef, useEffect } from 'react';
import { FaTimes, FaImage, FaGlobe, FaLock, FaCaretDown } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { bindPostData, getGathering, getPosts, initialPostData, setPostModalOpen, storePost, updatePost } from '@/views/gathering/store';
import { getMyProfile } from '@/views/settings/store';

const PostModal = () => {
  const {profile} = useSelector(({settings}) => settings)
  const { basicPostData, loading, isPostModalOpen} = useSelector(({gathering}) => gathering)
  const dispatch = useDispatch();
  const {id} = basicPostData;
  const [filePreviews, setFilePreviews] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPrivacyDropdown, setShowPrivacyDropdown] = useState(false);
  const fileInputRef = useRef(null);
  const [removeFiles, setRemoveFiles] = useState([]);
  const [isShowImageSection, setIsShowImageSection] = useState(id ? true :false);

  
  useEffect(() => {
    dispatch(getMyProfile())

    if (isPostModalOpen && id && basicPostData?.files?.length > 0) {
      const previews = basicPostData?.files?.map(file => ({
        id: file.id || (Date.now() + Math.random().toString(36).substring(2, 9)),
        src: `${process.env.NEXT_PUBLIC_FILE_PATH}/${file.file_path}`,
        file_type: file?.file_type
      }));
      setFilePreviews(previews);
    }

    return () => {
      setFilePreviews([]);
    }
  }, []);

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
        formData.append('removefiles', removeFiles);
      }

      const action = id ? updatePost({ id, ...Object.fromEntries(formData) }) : storePost(formData);
      dispatch(action)
        .then(() => {
          dispatch(getGathering())
          dispatch(getPosts());
          dispatch(bindPostData(initialPostData));
          setFilePreviews([]);
          setRemoveFiles([]);
          dispatch(setPostModalOpen(false))
        });
    } catch (error) {
      console.error('Error posting:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
   const close = () => {
    dispatch(setPostModalOpen(false));
      dispatch(bindPostData(initialPostData));

   }
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30">
      <div className="bg-white backdrop-blur-md rounded-lg w-full max-w-lg mx-4 shadow-xl">
        <div className="flex justify-center border-b border-b-gray-300 p-4">
          <h2 className="relative text-xl font-semibold">{id ? 'Edit Post' : 'Create post'}</h2>
          <button 
            onClick={() => {close()}}
            className="text-gray-500 absolute right-3 top-3 bg-gray-200 p-2 rounded-full cursor-pointer hover:text-gray-700"
          >
            <FaTimes size={20} />
          </button>
        </div>
        
        <div className="p-4">
          <div className="flex">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-blue-400 flex items-center justify-center text-white mr-3">
            <img 
            src={process.env.NEXT_PUBLIC_CLIENT_FILE_PATH + profile?.client?.image || "/common-avator.jpg"}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/common-avator.jpg";
            }}
            />
            </div>
            <div className="flex-1">
              <div className='font-semibold'>{profile?.client?.fname + " " + profile?.client?.last_name}</div>
              <div className="flex items-center">
                <div className="relative">
                  <button 
                    onClick={() => setShowPrivacyDropdown(!showPrivacyDropdown)}
                    className="flex items-center font-[500] text-[13px] bg-gray-200 px-2 py-1 rounded-md cursor-pointer"
                  >
                    {basicPostData?.privacy_mode === 'public' ? (
                      <>
                        <FaGlobe size={12} className="mr-1" /> 
                        <span className='-mt-[2px]'>Public</span>
                      </>
                    ) : (
                      <>
                        <FaLock size={12} className="mr-1" /> 
                        <span className='-mt-[2px]'>Private</span>
                      </>
                    )}
                    <FaCaretDown className='ml-1' />
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
            </div>
          </div>
          <div className="flex-1">
              <textarea
                name="message"
                value={basicPostData?.message}
                onChange={(e) => {handleOnchange(e)}}
                placeholder={`What's on your mind ${profile?.client?.fname}?`} 
                className="w-full border-0 resize-none outline-none text-gray-700 p-2 bg-transparent"
                rows={3}
              />
            </div>
         
          
          <div className="mb-4">
            <p 
              className={`text-gray-500 mb-2 cursor-pointer ${!isShowImageSection ? "border py-2 pl-2 rounded-md" : ""}`}
              onClick={() => {setIsShowImageSection(!isShowImageSection)}}
            >Upload Photos/Videos</p>
            {isShowImageSection && (
            <div 
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer bg-white/50 hover:bg-white/70 transition"
            onClick={() => fileInputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            >
            {filePreviews?.length > 0 ? (
              <div>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  {filePreviews?.map(preview => (
                    <div key={preview.id} className="relative">
                      {preview?.file?.type.startsWith("video/") ? (
                        <video controls className="h-32 w-full object-cover rounded">
                          <source src={preview?.src} />
                        </video>
                      ) : (
                        <img 
                          src={preview?.src} 
                          alt="Upload preview" 
                          className="h-32 w-full object-cover rounded"
                        />
                      )}
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
                <p className="text-gray-500">Drag here or click to upload photos/videos.</p>
              </div>
            )}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFilesChange}
              accept="image/*,video/*"
              className="hidden"
              multiple
            />
            </div>
            )}
           
          </div>
        </div>
        
        <div className=" gap-2 p-4">
          {/* <button
            onClick={() => {close()}}    
            className="px-4 py-2 cursor-pointer rounded-md bg-red-50 text-red-500 hover:bg-red-100 transition"
            disabled={loading}
          >
            Cancel
          </button> */}
          <button
            onClick={handlePost}
            className={`px-4 py-2 w-full rounded-md transition ${(loading || (!basicPostData?.message && !basicPostData?.files?.length)) ? "bg-gray-200 text-gray-500" : "bg-blue-500 text-white hover:bg-blue-600 cursor-pointer"}`}
            disabled={loading || (!basicPostData?.message && !basicPostData?.files?.length)}
          >
            {loading ? 'Posting...' : 'Post'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostModal; 