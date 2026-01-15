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

    const startUpload = useCallback(async (formData, postId = null) => {
        setIsUploading(true);
        setUploadProgress(0);
        setNotification(null);

        // Create abort controller for potential cancellation
        abortControllerRef.current = new AbortController();

        try {
            const token = typeof window !== 'undefined' ? localStorage.getItem('old_token') : null;
            const baseUrl = process.env.NEXT_PUBLIC_API_URL;

            const url = postId
                ? `${baseUrl}/post/update/${postId}`
                : `${baseUrl}/post/store`;

            // Always use POST method
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formData,
                signal: abortControllerRef.current.signal,
            });

            if (!response.ok) {
                throw new Error('Upload failed');
            }

            const result = await response.json();

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
