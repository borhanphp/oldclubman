"use client";

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { FaTimes, FaImage, FaGlobe, FaLock, FaCaretDown, FaChevronLeft, FaChevronRight, FaBold, FaItalic, FaUnderline, FaHeading } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { bindPostData, getGathering, getPosts, initialPostData, setPostModalOpen, storePost, updatePost } from '@/views/gathering/store';
import { getMyProfile, getPostBackgrounds, getUserProfile } from '@/views/settings/store';
import { useParams } from 'next/navigation';
import toast from 'react-hot-toast';

const PostModal = () => {
  const {profile, backgroundOptions} = useSelector(({settings}) => settings)
  const { basicPostData, loading, isPostModalOpen} = useSelector(({gathering}) => gathering)
  const dispatch = useDispatch();
  const {id} = basicPostData;
  const [filePreviews, setFilePreviews] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPrivacyDropdown, setShowPrivacyDropdown] = useState(false);
  const fileInputRef = useRef(null);
  const messageEditorRef = useRef(null);
  const previousMessageRef = useRef(basicPostData?.message ?? '');
  const storedRichMessageRef = useRef('');
  const prevBackgroundActiveRef = useRef(false);
  const [removeFiles, setRemoveFiles] = useState([]);
  const [isShowImageSection, setIsShowImageSection] = useState(id ? true :false);
  const [selectedBackground, setSelectedBackground] = useState(/\/post_background\/.+/.test(basicPostData?.background_url) ? basicPostData?.background_url : null);
  const [backgroundScrollIndex, setBackgroundScrollIndex] = useState(0);
  const [isVisibleBg, setIsVisibleBg] = useState(true);

  const params = useParams();

  const isBackgroundActive = useMemo(() => {
    if (!selectedBackground) {
      return false;
    }

    if (typeof selectedBackground === 'string') {
      return true;
    }

    return selectedBackground?.id !== 'white';
  }, [selectedBackground]);

  const visibleBackgrounds = backgroundOptions.slice(backgroundScrollIndex, backgroundScrollIndex + 8);

  const handleBackgroundSelect = (background) => {
    // Preserve existing text and place it on background
    // if (messageEditorRef.current) {
    //   const currentHtml = messageEditorRef.current.innerHTML || '';
    //   const plainText = getPlainTextFromHtml(currentHtml);
    //   // Store the original HTML for later restoration
    //   storedRichMessageRef.current = "";
      
    //   // Switch to plain text mode for background
    //   messageEditorRef.current.innerText = plainText;
      
    //   // Update state with plain text
    //   dispatch(bindPostData({ ...basicPostData, message: plainText }));
    //   previousMessageRef.current = plainText;
    // }
    // console.log('sdfsdf',previousMessageRef.current)
    const plainText = getPlainTextFromHtml(messageEditorRef.current.innerHTML || "");
    messageEditorRef.current.innerText = "";
   
    dispatch(bindPostData({ ...basicPostData, message: plainText+" " }));
    setSelectedBackground(background);
  };

  const handleBackgroundClear = () => {
    // Restore text when removing background
    if (messageEditorRef.current) {
      const currentPlainText = messageEditorRef.current.innerText || '';
      
      // Convert plain text to HTML paragraphs
      let contentToRestore;
      if (currentPlainText.trim()) {
        contentToRestore = currentPlainText.split('\n').map(line => 
          line.trim() ? `<p>${line.trim()}</p>` : '<p><br></p>'
        ).join('');
      } else {
        // If no text, restore stored content
        contentToRestore = storedRichMessageRef.current || '';
      }
      
      messageEditorRef.current.innerHTML = contentToRestore;
      dispatch(bindPostData({ ...basicPostData, message: contentToRestore }));
      previousMessageRef.current = contentToRestore;
      storedRichMessageRef.current = '';
    }
    setSelectedBackground(null);
  };

  const scrollBackgrounds = (direction) => {
    if (direction === 'left' && backgroundScrollIndex > 0) {
      setBackgroundScrollIndex(backgroundScrollIndex - 1);
    } else if (direction === 'right' && backgroundScrollIndex < backgroundOptions.length - 8) {
      setBackgroundScrollIndex(backgroundScrollIndex + 1);
    }
  };

  const getPlainTextLength = (html) => {
    if (!html) {
      return 0;
    }

    return html
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<[^>]*>/g, '')
      .replace(/&nbsp;/gi, ' ')
      .length;
  };

  const getPlainTextFromHtml = (html) => {
    if (!html) {
      return '';
    }

    return html
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<\/(div|p|li|tr|h[1-6])>/gi, '\n')
      .replace(/<[^>]+>/g, '')
      .replace(/�/g, ' ')
      .replace(/\n{3,}/g, '\n\n')
      .trimEnd();
  };

  const normalizeEditorHtml = (html) => {
    if (!html) {
      return '';
    }

    const trimmed = html.trim();
    if (!trimmed) {
      return '';
    }

    const divToParagraph = trimmed
      .replace(/<div(\s|>)/gi, '<p$1')
      .replace(/<\/div>/gi, '</p>')
      .replace(/<p><\/p>/gi, '');

    const hasBlockTags = /<(p|div|ul|ol|li|blockquote|h[1-6]|pre|table|tbody|thead|tr|td|th)\b/i.test(divToParagraph);
    const hasAnyTag = /<[^>]+>/i.test(divToParagraph);

    if (!hasAnyTag || !hasBlockTags) {
      const rawSegments = divToParagraph.split(/(?:<br\s*\/?>|\r?\n)+/i);

      const paragraphs = rawSegments
        .map((segment) => {
          const content = segment.trim();

          if (!content) {
            return '<p><br></p>';
          }

          return `<p>${content}</p>`;
        });

      if (paragraphs.length === 0) {
        return '';
      }

      return paragraphs.join('');
    }

    return divToParagraph;
  };



  const plainMessageLength = useMemo(() => getPlainTextLength(basicPostData?.message), [basicPostData?.message]);

  
  useEffect(() => {
    dispatch(getMyProfile())
    dispatch(getPostBackgrounds())

    if (isPostModalOpen && id && basicPostData?.files?.length > 0) {
      const previews = basicPostData?.files?.map(file => ({
        id: file.id || (Date.now() + Math.random().toString(36).substring(2, 9)),
        src: `${process.env.NEXT_PUBLIC_FILE_PATH}/post/${file.file_path}`,
        file_type: file?.file_type
      }));
      setFilePreviews(previews);
    }

    return () => {
      setFilePreviews([]);
    }
  }, []);

  useEffect(() => {
    const editor = messageEditorRef.current;
    const nextHtml = basicPostData?.message ?? '';

    if (editor && editor.innerHTML !== nextHtml) {
      editor.innerHTML = nextHtml;
    }

    previousMessageRef.current = nextHtml;
  }, [basicPostData?.message, isPostModalOpen]);

  useEffect(() => {
    const wasBackgroundActive = prevBackgroundActiveRef.current;

    if (isBackgroundActive && !wasBackgroundActive) {
      const currentHtml = messageEditorRef.current?.innerHTML ?? basicPostData?.message ?? '';
      storedRichMessageRef.current = currentHtml;
      const plainText = getPlainTextFromHtml(currentHtml);

      if (messageEditorRef.current) {
        messageEditorRef.current.innerText = plainText;
      }

      previousMessageRef.current = plainText;

      if (basicPostData?.message !== plainText) {
        dispatch(bindPostData({ ...basicPostData, message: plainText }));
      }
    } else if (!isBackgroundActive && wasBackgroundActive) {
      const restoredHtml = storedRichMessageRef.current || basicPostData?.message || '';

      if (messageEditorRef.current) {
        messageEditorRef.current.innerHTML = restoredHtml;
      }

      previousMessageRef.current = restoredHtml;

      if (basicPostData?.message !== restoredHtml) {
        dispatch(bindPostData({ ...basicPostData, message: restoredHtml }));
      }

      storedRichMessageRef.current = '';
    }

    prevBackgroundActiveRef.current = isBackgroundActive;
  }, [basicPostData, dispatch, isBackgroundActive]);

  const handleEditorInput = () => {
  
    const editor = messageEditorRef.current;
    if (!editor) {
      return;
    }
    

    const html = editor.innerHTML;
    const plainLength = getPlainTextLength(html);

    if(selectedBackground){
      editor.style.color = "white"
      editor.style.fontWeight = "bold"
      editor.style.fontSize = "24px"
      editor.style.textAlign = "center"
    }
    
    if (plainLength > 280) {
      setIsVisibleBg(false);
      setSelectedBackground(null);
      storedRichMessageRef.current = '';
    }else{
      setIsVisibleBg(true);
    }

    previousMessageRef.current = html;

    if (basicPostData?.message !== html) {
      dispatch(bindPostData({ ...basicPostData, message: html }));
    }
  };

  const handleEditorPaste = (event) => {
    event.preventDefault();
    
    // Check if there are files (images) in the clipboard
    const items = event.clipboardData?.items;
    if (items) {
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        
        // Handle image files
        if (item.type.indexOf('image') !== -1) {
          const file = item.getAsFile();
          if (file) {
            // Add the image file to the post data
            dispatch(bindPostData({
              ...basicPostData, 
              files: [...(basicPostData.files || []), file]
            }));
            
            // Generate preview for the pasted image
            const reader = new FileReader();
            reader.onloadend = () => {
              setFilePreviews(prev => [...prev, {
                id: Date.now() + Math.random().toString(36).substring(2, 9),
                src: reader.result,
                file: file
              }]);
            };
            reader.readAsDataURL(file);
            
            // Show image section when image is pasted
            setIsShowImageSection(true);
            
            // Show success message
            toast.success('Image pasted successfully!');
            return;
          }
        }
      }
    }
    
    // If no images, handle text paste
    const textData = event.clipboardData?.getData('text/plain') ?? '';

    if (typeof document !== 'undefined') {
      document.execCommand('insertText', false, textData);
    }

    handleEditorInput();
  };

  const applyTextFormatting = (command, value = null) => {
    if (isBackgroundActive) {
      return;
    }

    const editor = messageEditorRef.current;

    if (!editor || typeof document === 'undefined') {
      return;
    }

    editor.focus();
    document.execCommand(command, false, value);
    handleEditorInput();
  };

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
      const editorContent = messageEditorRef.current ? messageEditorRef.current.innerHTML : basicPostData?.message ?? '';
      const editorPlainText = messageEditorRef.current ? messageEditorRef.current.innerText.replace(/\r/g, '') : getPlainTextFromHtml(editorContent);

      const normalizedContent = isBackgroundActive
        ? editorPlainText
        : normalizeEditorHtml(editorContent);

      const messageContent = isBackgroundActive
        ? editorPlainText.trim()
        : getPlainTextLength(normalizedContent) === 0 ? '' : normalizedContent;

      if (basicPostData?.message !== messageContent) {
        dispatch(bindPostData({ ...basicPostData, message: messageContent }));
      }


      const formData = new FormData();
      formData.append('message', messageContent);
      formData.append('privacy_mode', basicPostData.privacy_mode);
      if (messageContent?.length < 280 && selectedBackground) {
        formData.append('background_url', selectedBackground?.image?.path);
      }

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
          dispatch(getGathering());
          dispatch(getPosts());
          dispatch(bindPostData(initialPostData));
          setFilePreviews([]);
          setRemoveFiles([]);
          setSelectedBackground(null);
          setBackgroundScrollIndex(0);
          dispatch(setPostModalOpen(false));
          if (params?.id) {
            dispatch(getUserProfile(params?.id));
          }
          dispatch(getMyProfile());
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
    setSelectedBackground(null);
    setBackgroundScrollIndex(0);
   }
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30">
      <div className="bg-white backdrop-blur-md rounded-lg w-full max-w-lg mx-4 shadow-xl max-h-[90vh] flex flex-col">
        <div className="flex justify-center border-b border-b-gray-300 p-4 relative flex-shrink-0">
          <h2 className="text-xl font-semibold">{id ? 'Edit Post' : 'Create post'}</h2>
          <button 
            onClick={() => {close()}}
            className="absolute right-4 top-4 text-gray-500 bg-gray-200 p-2 rounded-full cursor-pointer hover:text-gray-700"
          >
            <FaTimes size={20} />
          </button>
        </div>
        
        <div className="p-4 overflow-y-auto flex-1">
          <div className="flex items-start mb-4">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-blue-400 flex items-center justify-center text-white mr-3 flex-shrink-0">
              <img 
                src={profile?.client?.image ? (process.env.NEXT_PUBLIC_CLIENT_FILE_PATH + profile?.client?.image) : "/common-avator.jpg"}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/common-avator.jpg";
                }}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <div className='font-semibold text-gray-900'>{profile?.client?.fname + " " + profile?.client?.last_name}</div>
              <div className="flex items-center mt-1">
                <div className="relative">
                  <button 
                    onClick={() => setShowPrivacyDropdown(!showPrivacyDropdown)}
                    className="flex items-center font-[500] text-[13px] bg-gray-200 px-2 py-1 rounded-md cursor-pointer hover:bg-gray-300 transition-colors"
                  >
                    {basicPostData?.privacy_mode === 'public' ? (
                      <>
                        <FaGlobe size={12} className="mr-1" /> 
                        <span>Public</span>
                      </>
                    ) : (
                      <>
                        <FaLock size={12} className="mr-1" /> 
                        <span>Private</span>
                      </>
                    )}
                    <FaCaretDown className='ml-1' />
                  </button>
                  
                  {showPrivacyDropdown && (
                    <div className="absolute left-0 mt-1 bg-white shadow-md rounded-md z-10 w-36 overflow-hidden border">
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
          <div className="flex-1 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={(e) => {
                  e.preventDefault();
                  applyTextFormatting('bold');
                }}
                className="p-2 rounded-md border border-gray-200 text-gray-600 hover:bg-gray-100 focus:outline-none"
                aria-label="Bold"
                title="Bold"
              >
                <FaBold size={14} />
              </button>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={(e) => {
                  e.preventDefault();
                  applyTextFormatting('italic');
                }}
                className="p-2 rounded-md border border-gray-200 text-gray-600 hover:bg-gray-100 focus:outline-none"
                aria-label="Italic"
                title="Italic"
              >
                <FaItalic size={14} />
              </button>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={(e) => {
                  e.preventDefault();
                  applyTextFormatting('underline');
                }}
                className="p-2 rounded-md border border-gray-200 text-gray-600 hover:bg-gray-100 focus:outline-none"
                aria-label="Underline"
                title="Underline"
              >
                <FaUnderline size={14} />
              </button>
              {/* <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={(e) => {
                  e.preventDefault();
                  applyTextFormatting('formatBlock', 'H1');
                }}
                className="p-2 rounded-md border border-gray-200 text-gray-600 hover:bg-gray-100 focus:outline-none"
                aria-label="Heading level 1"
                title="Heading 1"
              >
                <FaHeading size={14} />
              </button> */}
            </div>
            {selectedBackground && selectedBackground?.id !== 'white' && plainMessageLength < 280 ? (
              <div 
                className="relative w-full min-h-[400px] rounded-lg flex items-center justify-center bg-cover bg-center bg-no-repeat"
                style={{
                  backgroundImage: selectedBackground?.image?.url ? `url(${selectedBackground.image.url})` : `url(${basicPostData?.background_url})`,
                paddingBottom: "100px"
                }}
              >
                <div className="relative w-full max-w-md">
                  {!plainMessageLength && (
                    <span aria-hidden="true" className="pointer-events-none absolute left-30 top-10 text-white/70">{`What's on your mind, ${profile?.client?.fname}?`}</span>
                  )}
                  <div
                    ref={messageEditorRef}
                    className="w-full border-0 resize-none outline-none p-4 text-white text-center bg-transparent min-h-[120px] max-h-[200px] text-[24px] font-medium whitespace-pre-wrap break-words"
                    contentEditable
                    role="textbox"
                    aria-multiline="true"
                    onInput={handleEditorInput}
                    onBlur={handleEditorInput}
                    onPaste={handleEditorPaste}
                    suppressContentEditableWarning
                  />
                </div>

               
              </div>
            ) : (
              <div className="relative">
                {!plainMessageLength && (
                  <span aria-hidden="true" className="pointer-events-none absolute left-4 top-4 text-gray-400">{`What's on your mind, ${profile?.client?.fname}?`}</span>
                )}
                <div
                  ref={messageEditorRef}
                  className="w-full border-0 outline-none p-4 transition-all duration-200 text-lg text-gray-700 bg-transparent min-h-[120px] whitespace-pre-wrap break-words"
                  contentEditable
                  role="textbox"
                  aria-multiline="true"
                  onInput={handleEditorInput}
                  onBlur={handleEditorInput}
                  onPaste={handleEditorPaste}
                  suppressContentEditableWarning
                />
              </div>
            )}
          </div>

             {/* Background Selection Row */}
             <div className="mb-1">
              <div className="flex items-center space-x-2 overflow-x-auto py-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                {/* Left Arrow */}
                {backgroundScrollIndex > 0 && (
                  <button
                    onClick={() => scrollBackgrounds('left')}
                    className="flex-shrink-0 w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors"
                  >
                    <FaChevronLeft size={12} className="text-gray-600" />
                  </button>
                )}

                {/* White Background Option */}
                <div
                  onClick={handleBackgroundClear}
                  className={`flex-shrink-0 w-8 h-8 rounded-md border-2 transition-all duration-200 hover:scale-110 bg-white cursor-pointer ${
                    selectedBackground?.id === 'white' 
                      ? 'border-white scale-110 shadow-lg' 
                      : 'border-gray-300'
                  }`}
                  title="White"
                />

                {/* Background Swatches */}
                {isVisibleBg && visibleBackgrounds?.map((bg) => (
                  <img
                    key={bg.id}
                    src={bg?.image?.url}
                    onClick={() => handleBackgroundSelect(bg)}
                    className={`flex-shrink-0 w-8 h-8 rounded-md border-2 transition-all duration-200 hover:scale-110 ${
                      selectedBackground?.id === bg.id 
                        ? 'border-white scale-110 shadow-lg' 
                        : 'border-gray-300'
                    }`}
                    title={bg.name}
                  />
                ))}

                {/* Right Arrow */}
                {backgroundScrollIndex < backgroundOptions.length - 8 && (
                  <button
                    onClick={() => scrollBackgrounds('right')}
                    className="flex-shrink-0 w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors"
                  >
                    <FaChevronRight size={12} className="text-gray-600" />
                  </button>
                )}
              </div>
            </div>


         
          {!selectedBackground && (
            <div className="">
            <p 
              className={`text-gray-500 mb-2 text-center cursor-pointer ${!isShowImageSection ? "border py-2 pl-2 rounded-md" : ""}`}
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
          )}
          
        </div>
        
        <div className="px-4 pb-4 flex-shrink-0">
          <button
            onClick={handlePost}
            className={`px-4 py-2 w-full rounded-md transition font-medium ${
              (loading || (plainMessageLength === 0 && !basicPostData?.files?.length)) 
                ? "bg-gray-200 text-gray-500 cursor-not-allowed" 
                : "bg-blue-500 text-white hover:bg-blue-600 cursor-pointer"
            }`}
            disabled={loading || (plainMessageLength === 0 && !basicPostData?.files?.length)}
          >
            {loading ? 'Posting...' : 'Post'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostModal;



