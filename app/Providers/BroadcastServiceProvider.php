<?php

namespace App\Providers;

use Illuminate\Support\Facades\Broadcast;
use Illuminate\Support\ServiceProvider;

class BroadcastServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Broadcast::routes(['middleware' => ['auth:sanctum']]);

        // Register the channel authorization rules
        Broadcast::channel('private-conversation.{conversationId}', function ($user, $conversationId) {
            // Add your authorization logic here
            // For example, check if the user is part of the conversation
            return true; // For testing, allow all authenticated users
        });
    }
} 