"use client";

import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { getGathering, getPosts } from '@/views/gathering/store';
import { getMyProfile } from '@/views/settings/store';

const VideoUploadContext = createContext(null);

export const useVideoUpload = () => {
    const context = useContext(VideoUploadContext);
    if (!context) {
        throw new Error('useVideoUpload must be used within VideoUploadProvider');
    }
    return context;
};

export const VideoUploadProvider = ({ children }) => {
    const dispatch = useDispatch();
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [notification, setNotification] = useState(null); // { type: 'success' | 'error', message: string }
    const abortControllerRef = useRef(null);

    const clearNotification = useCallback(() => {
        setNotification(null);
    }, []);

    const uploadVideoToS3 = async (presignedData, file, onProgress) => {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();

            xhr.upload.onprogress = (e) => {
                if (e.lengthComputable) {
                    const percent = (e.loaded / e.total) * 100;
                    onProgress(percent);
                }
            };

            xhr.onload = async () => {
                if (xhr.status >= 200 && xhr.status < 300) {
                    resolve();
                } else {
                    reject(new Error(`Upload failed: ${xhr.status}`));
                }
            };

            xhr.onerror = () => reject(new Error('Network error during S3 upload'));
            xhr.onabort = () => reject(new Error('Upload cancelled'));

            xhr.open(presignedData.method, presignedData.upload_url);

            // Set headers from presigned data
            if (presignedData.headers) {
                Object.entries(presignedData.headers).forEach(([key, value]) => {
                    xhr.setRequestHeader(key, value);
                });
            }

            xhr.send(file);

            // Connect abort signal
            if (abortControllerRef.current) {
                abortControllerRef.current.signal.addEventListener('abort', () => xhr.abort());
            }
        });
    };

    const confirmUpload = async (fileId, s3Key) => {
        const token = typeof window !== 'undefined' ? localStorage.getItem('old_token') : null;
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/s3/confirm-upload`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
                type: 'post',
                file_id: fileId,
                s3_key: s3Key
            })
        });

        if (!response.ok) {
            throw new Error('Failed to confirm upload');
        }
    };

    const startUpload = useCallback(async (formData, postId = null, originalFiles = []) => {
        setIsUploading(true);
        setUploadProgress(0);
        setNotification({ type: 'info', message: 'Starting upload...' });

        // Create abort controller for potential cancellation
        abortControllerRef.current = new AbortController();

        try {
            const token = typeof window !== 'undefined' ? localStorage.getItem('old_token') : null;
            const baseUrl = process.env.NEXT_PUBLIC_API_URL;

            const url = postId
                ? `${baseUrl}/post/update/${postId}`
                : `${baseUrl}/post/store`;

            // Step 1: Initial Post Creation / Update
            // Images are uploaded here directly. Video placeholders are created.
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formData,
                signal: abortControllerRef.current.signal,
            });

            if (!response.ok) {
                throw new Error('Initial upload failed');
            }

            const result = await response.json();

            // Check for videos that need direct S3 upload
            if (result.data && result.data.presigned_videos && result.data.presigned_videos.length > 0) {
                const presignedVideos = result.data.presigned_videos;
                const totalVideos = presignedVideos.length;

                // Identify video files from originalFiles
                // We assume the order matches or we need a way to match them.
                // The guide suggests: "videos = files.filter(video); return videos[index]"
                // Let's filter originalFiles for videos safely.
                const videoFiles = Array.from(originalFiles).filter(f => f.type.startsWith('video/'));

                for (let i = 0; i < totalVideos; i++) {
                    const presignedData = presignedVideos[i];
                    // Fallback to index matching if we can't match by ID (checking if frontend has ID access which it usually doesn't for new files)
                    const videoFile = videoFiles[i];

                    if (!videoFile) {
                        console.warn(`Could not find video file for index ${i}`);
                        continue;
                    }

                    console.log('Full Presigned Data:', JSON.stringify(presignedData, null, 2));

                    if (!presignedData.upload_url) {
                        console.error('Missing upload_url in presignedData:', presignedData);
                        throw new Error('Server returned invalid upload configuration (missing upload_url)');
                    }

                    setNotification({ type: 'info', message: `Uploading video ${i + 1} of ${totalVideos}...` });

                    // Upload to S3

                    await uploadVideoToS3(presignedData, videoFile, (percent) => {
                        // Calculate overall progress if multiple videos? 
                        // For now just show current video progress scaled by total count, or just raw.
                        // Simple approach: (Completed Videos * 100 + Current Video %) / Total Videos
                        const globalProgress = ((i * 100) + percent) / totalVideos;
                        setUploadProgress(globalProgress);
                    });

                    // Confirm Upload (only for non-multipart, as multipart complete handles it)
                    if (presignedData.upload_method !== 'multipart') {
                        await confirmUpload(presignedData.file_id, presignedData.s3_key);
                    }
                }
            }

            // All done
            setIsUploading(false);
            setUploadProgress(100);
            setNotification({ type: 'success', message: 'Post uploaded successfully!' });

            // Refresh posts
            dispatch(getGathering());
            dispatch(getPosts());
            dispatch(getMyProfile());

            // Auto-dismiss notification after 4 seconds
            setTimeout(() => {
                setNotification(null);
            }, 4000);

            return result;
        } catch (error) {
            console.error('Video upload error:', error);
            setIsUploading(false);

            if (error.name === 'AbortError') {
                setNotification({ type: 'info', message: 'Upload cancelled' });
            } else {
                setNotification({ type: 'error', message: 'Failed to upload post. Please try again.' });
            }

            // Auto-dismiss error notification after 5 seconds
            setTimeout(() => {
                setNotification(null);
            }, 5000);

            throw error;
        }
    }, [dispatch]);

    const cancelUpload = useCallback(() => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
            abortControllerRef.current = null;
        }
        setIsUploading(false);
        setUploadProgress(0);
        setNotification({ type: 'info', message: 'Upload cancelled' });
    }, []);

    const value = {
        isUploading,
        uploadProgress,
        notification,
        startUpload,
        cancelUpload,
        clearNotification,
    };

    return (
        <VideoUploadContext.Provider value={value}>
            {children}
        </VideoUploadContext.Provider>
    );
};

export default VideoUploadContext;
