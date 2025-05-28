<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Broadcast;
use Illuminate\Support\Facades\Log;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Broadcasting authentication route with proper middleware
Route::middleware(['auth:sanctum'])->group(function () {
    // Broadcasting auth route
    Route::post('/broadcasting/auth', function (Request $request) {
        try {
            // Log the incoming request details
            Log::info('Broadcasting auth request', [
                'channel' => $request->channel_name,
                'socket' => $request->socket_id,
                'user' => $request->user()?->id,
                'headers' => $request->headers->all(),
                'token' => $request->bearerToken(),
                'request_data' => $request->all()
            ]);

            if (!$request->user()) {
                Log::error('Broadcasting auth failed: No authenticated user');
                return response()->json(['message' => 'Unauthenticated'], 401);
            }

            // Get the channel name and socket ID from the request
            $channelName = $request->channel_name;
            $socketId = $request->socket_id;

            if (!$channelName || !$socketId) {
                Log::error('Broadcasting auth failed: Missing required parameters', [
                    'channel_name' => $channelName,
                    'socket_id' => $socketId
                ]);
                return response()->json(['message' => 'Missing required parameters'], 422);
            }

            // Generate the authentication signature
            $pusherKey = config('broadcasting.connections.pusher.key');
            $pusherSecret = config('broadcasting.connections.pusher.secret');
            
            Log::info('Generating auth signature', [
                'key' => $pusherKey,
                'channel' => $channelName,
                'socket_id' => $socketId
            ]);

            $signature = hash_hmac(
                'sha256',
                $socketId . ':' . $channelName,
                $pusherSecret,
                false  // Return as hex string
            );

            $response = [
                'auth' => $pusherKey . ':' . $signature
            ];

            Log::info('Auth response', $response);

            // Return the auth response in the format Pusher expects
            return response()->json($response);

        } catch (\Exception $e) {
            Log::error('Broadcasting auth error', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'message' => 'Broadcasting authentication failed',
                'error' => $e->getMessage()
            ], 500);
        }
    });
});

// ... rest of your routes ... 