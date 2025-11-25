# 🚨 Pusher Not Working on VPS - Troubleshooting Guide

## ✅ **Checklist to Fix Pusher on Production Server**

### **1. Backend Environment Variables (.env)**

On your VPS, check `/var/www/html/old-backend/.env` (or wherever your Laravel app is):

```bash
# Broadcasting
BROADCAST_CONNECTION=pusher

# Pusher Configuration
PUSHER_APP_ID=your_app_id
PUSHER_APP_KEY=your_app_key
PUSHER_APP_SECRET=your_app_secret
PUSHER_APP_CLUSTER=ap2
PUSHER_SCHEME=https
PUSHER_PORT=443

# Frontend URL for CORS
FRONT_URL=https://test.oldclubman.com
```

**⚠️ Common Mistakes:**
- Using `BROADCAST_DRIVER=pusher` instead of `BROADCAST_CONNECTION=pusher`
- Missing `PUSHER_APP_CLUSTER`
- Wrong `FRONT_URL` (must match your frontend domain exactly)
- Using HTTP instead of HTTPS on production

---

### **2. Frontend Environment Variables (.env.local or .env.production)**

On your VPS frontend build, check environment variables:

```bash
# API URL
NEXT_PUBLIC_API_URL=https://test-api.oldclubman.com/api

# Pusher Configuration
NEXT_PUBLIC_PUSHER_KEY=your_app_key
NEXT_PUBLIC_PUSHER_CLUSTER=ap2

# Optional: If using custom Pusher host
# NEXT_PUBLIC_PUSHER_HOST=
# NEXT_PUBLIC_PUSHER_PORT=443
```

**⚠️ Common Mistakes:**
- Environment variables not available during build
- Mismatch between Pusher keys on frontend/backend
- Missing `NEXT_PUBLIC_` prefix (required for Next.js client-side access)

---

### **3. Backend: Enable Broadcasting Routes**

**File:** `routes/channels.php`

```php
<?php

use Illuminate\Support\Facades\Broadcast;

Broadcast::routes(['middleware' => ['auth:sanctum']]);

// Channel authorization
Broadcast::channel('private-conversation.{conversationId}', function ($user, $conversationId) {
    $conversation = \App\Models\Conversation::find($conversationId);
    if (!$conversation) {
        return false;
    }
    
    return $conversation->users()->where('id', $user->id)->exists();
});
```

**File:** `app/Providers/BroadcastServiceProvider.php`

Make sure it's registered in `config/app.php`:

```php
'providers' => [
    // ... other providers
    App\Providers\BroadcastServiceProvider::class,
],
```

And uncomment in `BroadcastServiceProvider.php`:

```php
public function boot()
{
    Broadcast::routes(['middleware' => ['auth:sanctum']]);
    require base_path('routes/channels.php');
}
```

---

### **4. Backend: CORS Configuration**

**File:** `config/cors.php`

```php
return [
    'paths' => ['api/*', 'broadcasting/auth', 'sanctum/csrf-cookie'],
    
    'allowed_methods' => ['*'],
    
    'allowed_origins' => [
        'https://test.oldclubman.com',
        'http://localhost:3000',  // For local dev
    ],
    
    'allowed_origins_patterns' => [],
    
    'allowed_headers' => ['*'],
    
    'exposed_headers' => [],
    
    'max_age' => 0,
    
    'supports_credentials' => true,
];
```

---

### **5. Check Pusher Dashboard**

Go to [pusher.com/channels](https://pusher.com/channels) and check:

1. **App Status:** Is your app active?
2. **Connection Limit:** Have you exceeded the free tier limit (100 concurrent connections)?
3. **Debug Console:** Click "Debug Console" and watch for events when you send a message
4. **SSL/TLS:** Ensure SSL is enabled for your app

---

### **6. Test Backend Broadcasting**

SSH into your VPS and run:

```bash
cd /var/www/html/old-backend  # Or your Laravel path

# Test Pusher connection
php artisan tinker
```

Then in Tinker:

```php
// Test basic Pusher connection
$pusher = new \Pusher\Pusher(
    env('PUSHER_APP_KEY'),
    env('PUSHER_APP_SECRET'),
    env('PUSHER_APP_ID'),
    ['cluster' => env('PUSHER_APP_CLUSTER'), 'useTLS' => true]
);

// Trigger a test event
$pusher->trigger('test-channel', 'test-event', ['message' => 'Hello from VPS']);

// If successful, you'll see: object(stdClass)#... { +"http_code": int(200) }
```

---

### **7. Frontend: Check Browser Console**

On `https://test.oldclubman.com`, open DevTools Console and look for:

**✅ Good Signs:**
```
Connecting to Pusher...
Connected to Pusher
Connection state: connected
✅ Successfully subscribed to private-conversation.XXX
```

**❌ Bad Signs:**
```
❌ Pusher connection error
❌ Invalid API key
❌ Authentication error
Unable to retrieve auth string from auth endpoint
```

---

### **8. Common VPS Issues**

#### **A. Firewall Blocking WebSockets**

Pusher uses ports 80, 443, and WebSocket connections. Check firewall:

```bash
# Allow HTTPS
sudo ufw allow 443/tcp

# Check if UFW is blocking
sudo ufw status
```

#### **B. SSL Certificate Issues**

If using Let's Encrypt or custom SSL, ensure:
- Certificate is valid and not expired
- HTTPS is properly configured on both domains (`test.oldclubman.com` and `test-api.oldclubman.com`)

#### **C. Environment Variables Not Loaded**

After updating `.env`, always:

```bash
cd /var/www/html/old-backend
php artisan config:clear
php artisan cache:clear
php artisan route:clear

# Restart PHP-FPM (if using Nginx + PHP-FPM)
sudo systemctl restart php8.1-fpm  # Or your PHP version

# Restart Apache (if using Apache)
sudo systemctl restart apache2

# If using PM2 for Laravel Queue
pm2 restart all
```

#### **D. Next.js Build Missing Environment Variables**

On VPS, rebuild Next.js with production env vars:

```bash
cd /var/www/html/old-club-man  # Or your frontend path

# Create .env.production
cat > .env.production << EOF
NEXT_PUBLIC_API_URL=https://test-api.oldclubman.com/api
NEXT_PUBLIC_CLIENT_FILE_PATH=https://test-api.oldclubman.com/public/uploads/client
NEXT_PUBLIC_PUSHER_KEY=your_pusher_key
NEXT_PUBLIC_PUSHER_CLUSTER=ap2
EOF

# Rebuild
npm run build

# Restart Next.js
pm2 restart oldclubman  # Or however you run it
```

---

### **9. Quick Diagnostic Commands**

Run these on your VPS:

```bash
# Check Laravel .env has Pusher config
grep PUSHER /var/www/html/old-backend/.env

# Check if broadcasting route exists
php artisan route:list | grep broadcasting

# Check Laravel logs
tail -f /var/www/html/old-backend/storage/logs/laravel.log

# Check Nginx/Apache error logs
sudo tail -f /var/log/nginx/error.log
# OR
sudo tail -f /var/log/apache2/error.log
```

---

### **10. Network Test**

From your browser on production, test if you can reach Pusher:

```javascript
// Open browser console on https://test.oldclubman.com
// Run this:

fetch('https://sockjs-ap2.pusher.com/pusher/app/YOUR_PUSHER_KEY?protocol=7&client=js&version=8.3.0&flash=false')
  .then(r => r.text())
  .then(console.log)
  .catch(console.error)

// Should return: "You are connected to Pusher's WebSocket API"
```

---

## 🔍 **Most Likely Issues (In Order):**

1. ✅ **Backend `.env` missing `BROADCAST_CONNECTION=pusher`**
2. ✅ **Frontend `.env.production` missing Pusher variables**
3. ✅ **Frontend not rebuilt after changing env vars**
4. ✅ **CORS blocking `broadcasting/auth` endpoint**
5. ✅ **Wrong `FRONT_URL` in backend .env**
6. ✅ **BroadcastServiceProvider not registered**

---

## 🚀 **Quick Fix Steps:**

1. **SSH into your VPS**
2. **Check backend .env** → ensure all Pusher vars are set
3. **Check frontend env** → ensure `NEXT_PUBLIC_PUSHER_*` vars are set
4. **Rebuild frontend:** `npm run build && pm2 restart`
5. **Clear backend cache:** `php artisan config:clear`
6. **Check Pusher Dashboard** → see if events are being sent
7. **Check browser console** → see if Pusher connects

---

## 📞 **Need More Help?**

Run these and send me the output:

```bash
# On VPS Backend
cd /var/www/html/old-backend
echo "=== Backend Pusher Config ==="
php artisan tinker --execute="echo env('BROADCAST_CONNECTION'); echo PHP_EOL; echo env('PUSHER_APP_KEY'); echo PHP_EOL; echo env('PUSHER_APP_CLUSTER');"

# On VPS Frontend (if accessible)
cd /var/www/html/old-club-man
echo "=== Frontend Pusher Config ==="
cat .env.production | grep PUSHER
```

And check browser console on `https://test.oldclubman.com/user/messages` for any Pusher errors!

