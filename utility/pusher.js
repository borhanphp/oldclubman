import Pusher from 'pusher-js';

class PusherService {
    constructor() {
        this.pusher = null;
        this.channels = new Map();
        this.options = null;
    }

    initialize() {
        if (this.pusher) return;

        const token = localStorage.getItem('old_token');
        if (!token) {
            console.error('No authentication token found');
            return;
        }

        // Set default API URL to match Laravel's URL
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        
        this.options = {
            cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER || 'us2',
            forceTLS: true,
            authEndpoint: `${apiUrl}/broadcasting/auth`,
            auth: {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': `Bearer ${token}`
                }
            }
        };

        try {
            this.pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY || '6536db454316e302c142', this.options);

            this.pusher.connection.bind('connecting', () => {
                console.log('Connecting to Pusher...');
            });

            this.pusher.connection.bind('connected', () => {
                console.log('Connected to Pusher');
                console.log('Connection state:', this.pusher.connection.state);
            });

            this.pusher.connection.bind('error', (err) => {
                console.error('Pusher connection error:', err);
                if (err.error?.type === 'AuthError') {
                    console.error('Pusher authentication error. Token might be expired.');
                    this.handleAuthError();
                }
            });

            this.pusher.connection.bind('disconnected', () => {
                console.log('Disconnected from Pusher');
            });

        } catch (error) {
            console.error('Error initializing Pusher:', error);
        }
    }

    subscribeToChannel(channelName, events = {}) {
        if (!this.pusher) {
            console.error('Pusher not initialized');
            return null;
        }

        if (this.channels.has(channelName)) {
            return this.channels.get(channelName);
        }

        // Get the current token
        const token = localStorage.getItem('old_token');
        if (!token) {
            console.error('No authentication token found');
            return null;
        }

        // Update auth headers with current token
        if (this.options?.auth?.headers) {
            this.options.auth.headers.Authorization = `Bearer ${token}`;
        }

        const channel = this.pusher.subscribe(channelName);

        channel.bind('pusher:subscription_succeeded', () => {
            console.log(`Successfully subscribed to ${channelName}`);
        });

        channel.bind('pusher:subscription_error', (error) => {
            if (error.type === 'AuthError') {
                this.handleAuthError();
            }
        });

        // Bind custom events
        Object.entries(events).forEach(([event, callback]) => {
            console.log(`Binding event ${event} to channel ${channelName}`);
            channel.bind(event, callback);
        });

        this.channels.set(channelName, channel);
        return channel;
    }

    unsubscribeFromChannel(channelName) {
        if (!this.pusher || !this.channels.has(channelName)) return;

        console.log(`Unsubscribing from channel: ${channelName}`);
        this.pusher.unsubscribe(channelName);
        this.channels.delete(channelName);
    }

    disconnect() {
        if (!this.pusher) return;

        console.log('Disconnecting Pusher');
        this.channels.clear();
        this.pusher.disconnect();
        this.pusher = null;
        this.options = null;
    }
}

export const pusherService = new PusherService();