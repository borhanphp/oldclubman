import { pusherService } from '@/utility/pusher';
import { useEffect, useCallback } from 'react';

export const useChatPusher = (conversationId, onMessageReceived, onTyping) => {
    const subscribeToChat = useCallback(() => {
        if (!conversationId) return;

        const channelName = `private-conversation.${conversationId}`;
        
        const events = {
            'MessageSent': (data) => {
                console.log('New message received:', data);
                onMessageReceived?.(data);
            },
            'typing': (data) => {
                console.log('Typing event:', data);
                onTyping?.(data);
            }
        };

        return pusherService.subscribeToChannel(channelName, events);
    }, [conversationId, onMessageReceived, onTyping]);

    useEffect(() => {
        const channel = subscribeToChat();

        return () => {
            if (channel && conversationId) {
                const channelName = `private-conversation.${conversationId}`;
                pusherService.unsubscribeFromChannel(channelName);
            }
        };
    }, [conversationId, subscribeToChat]);
};