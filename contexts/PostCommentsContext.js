"use client";

import React, { createContext, useContext, useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { getPostById } from '@/views/gathering/store';

const PostCommentsContext = createContext();

export const usePostComments = () => {
    const context = useContext(PostCommentsContext);
    if (!context) {
        throw new Error('usePostComments must be used within a PostCommentsProvider');
    }
    return context;
};

export const PostCommentsProvider = ({ children }) => {
    const dispatch = useDispatch();
    const [pendingPostId, setPendingPostId] = useState(null);
    const [shouldOpenModal, setShouldOpenModal] = useState(false);

    // Called from notification click to queue opening the modal
    const openPostComments = useCallback(async (postId) => {
        if (!postId) return false;

        // Set the pending post ID and flag
        setPendingPostId(postId);
        setShouldOpenModal(true);

        // Dispatch to fetch the post data
        try {
            await dispatch(getPostById(postId));
            return true;
        } catch (error) {
            console.error('Error fetching post:', error);
            setPendingPostId(null);
            setShouldOpenModal(false);
            return false;
        }
    }, [dispatch]);

    // Called by PostList to consume the pending request
    const consumePendingRequest = useCallback(() => {
        if (shouldOpenModal && pendingPostId) {
            const postId = pendingPostId;
            setPendingPostId(null);
            setShouldOpenModal(false);
            return postId;
        }
        return null;
    }, [shouldOpenModal, pendingPostId]);

    // Reset the pending state
    const clearPendingRequest = useCallback(() => {
        setPendingPostId(null);
        setShouldOpenModal(false);
    }, []);

    const value = {
        pendingPostId,
        shouldOpenModal,
        openPostComments,
        consumePendingRequest,
        clearPendingRequest,
    };

    return (
        <PostCommentsContext.Provider value={value}>
            {children}
        </PostCommentsContext.Provider>
    );
};
