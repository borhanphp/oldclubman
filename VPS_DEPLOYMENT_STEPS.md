# 🚀 VPS Deployment Steps for Pusher Fix

## 📦 **Files to Upload to VPS**

Upload these updated files to your VPS server:

### **Backend Files:**
1. `config/cors.php` ✅ **CRITICAL FIX**
2. `test-pusher-vps.php` (diagnostic tool)

### **Frontend Files:**
1. `next.config.mjs` (with `test-api.oldclubman.com` domain)
2. All updated messaging components

---

## 🔧 **VPS Backend Setup**

### **1. Upload CORS Fix**

```bash
# SSH into your VPS
ssh your_user@your_vps_ip

# Go to backend directory
cd /var/www/html/old-backend  # Or wherever your Laravel app is

# Upload the updated config/cors.php
# (Use FTP, SCP, or Git pull)
```

### **2. Set Environment Variables**

Edit your `.env` file on the VPS:

```bash
nano .env  # or vim .env
```

Make sure these are set:

```env
# Broadcasting
BROADCAST_CONNECTION=pusher

# Pusher Configuration
PUSHER_APP_ID=your_app_id_here
PUSHER_APP_KEY=your_app_key_here
PUSHER_APP_SECRET=your_app_secret_here
PUSHER_APP_CLUSTER=ap2

# IMPORTANT: Your production frontend URL
FRONT_URL=https://test.oldclubman.com

# Other settings
PUSHER_SCHEME=https
PUSHER_PORT=443
```

**⚠️ CRITICAL:** Replace `your_app_id_here`, `your_app_key_here`, `your_app_secret_here` with your actual Pusher credentials from [pusher.com/channels](https://pusher.com/channels)

### **3. Clear Laravel Cache**

```bash
cd /var/www/html/old-backend

php artisan config:clear
php artisan cache:clear
php artisan route:clear
php artisan view:clear

# Restart PHP-FPM
sudo systemctl restart php8.1-fpm  # Adjust version number
# OR if using Apache:
sudo systemctl restart apache2
```

### **4. Test Pusher (Optional)**

```bash
cd /var/www/html/old-backend
php test-pusher-vps.php
```

You should see:
```
✅ PUSHER_APP_KEY: xxxxx
✅ PUSHER_APP_CLUSTER: ap2
✅ Pusher instance created successfully
✅ Event triggered successfully
```

---

## 🌐 **VPS Frontend Setup**

### **1. Set Production Environment Variables**

On your VPS, create `.env.production`:

```bash
cd /var/www/html/old-club-man  # Or wherever your Next.js app is

cat > .env.production << 'EOF'
NEXT_PUBLIC_API_URL=https://test-api.oldclubman.com/api
NEXT_PUBLIC_CLIENT_FILE_PATH=https://test-api.oldclubman.com/public/uploads/client
NEXT_PUBLIC_PUSHER_KEY=your_pusher_app_key_here
NEXT_PUBLIC_PUSHER_CLUSTER=ap2
EOF
```

**⚠️ IMPORTANT:** Replace `your_pusher_app_key_here` with the SAME key from your backend `.env`

### **2. Rebuild Next.js**

```bash
cd /var/www/html/old-club-man

# Install dependencies if needed
npm install

# Build for production
npm run build
```

### **3. Restart Next.js App**

```bash
# If using PM2:
pm2 restart oldclubman
pm2 logs oldclubman  # Check for errors

# If using systemd:
sudo systemctl restart oldclubman

# If using other process manager, restart accordingly
```

---

## ✅ **Verification Steps**

### **1. Check Backend Logs**

```bash
tail -f /var/www/html/old-backend/storage/logs/laravel.log
```

Send a message and look for:
```
MessageSent event broadcasting
```

### **2. Check Pusher Dashboard**

1. Go to [dashboard.pusher.com](https://dashboard.pusher.com)
2. Select your app
3. Click "Debug Console"
4. Send a message from the app
5. You should see events appearing in real-time

### **3. Check Browser Console**

1. Open `https://test.oldclubman.com/user/messages`
2. Press F12 → Console tab
3. Look for:
   ```
   Connecting to Pusher...
   Connected to Pusher
   Connection state: connected
   ✅ Successfully subscribed to private-conversation.XXX
   ```

### **4. Test Notification**

1. Open two browsers (or incognito)
2. Login as different users
3. Send message from User A
4. User B should see:
   - ✅ Toast notification (top-right)
   - ✅ Unread badge
   - ✅ Message appears instantly

---

## 🐛 **Common VPS Issues & Fixes**

### **Issue 1: "Mixed Content" Error**

**Error:** `Mixed Content: The page at 'https://...' was loaded over HTTPS, but requested an insecure resource`

**Fix:** Ensure all URLs use HTTPS:
```env
# Backend .env
PUSHER_SCHEME=https

# Frontend .env.production
NEXT_PUBLIC_API_URL=https://test-api.oldclubman.com/api  # Not http://
```

### **Issue 2: CORS Error on /broadcasting/auth**

**Error:** `Access to XMLHttpRequest at 'https://test-api.oldclubman.com/broadcasting/auth' from origin 'https://test.oldclubman.com' has been blocked by CORS`

**Fix:** Already fixed in `config/cors.php` - make sure to upload it and run `php artisan config:clear`

### **Issue 3: 401 Unauthorized on /broadcasting/auth**

**Error:** `401 Unauthorized` when subscribing to private channels

**Fix:** Check that:
1. User is logged in (token in localStorage)
2. Token is valid (not expired)
3. Auth header is being sent correctly

### **Issue 4: Connection Timeout**

**Error:** Pusher connection never completes

**Fix:** Check firewall:
```bash
# Allow HTTPS
sudo ufw allow 443/tcp

# Check status
sudo ufw status
```

### **Issue 5: Environment Variables Not Available**

**Error:** `process.env.NEXT_PUBLIC_PUSHER_KEY` is `undefined`

**Fix:** 
1. Create `.env.production` with all `NEXT_PUBLIC_*` variables
2. **Rebuild:** `npm run build` (environment variables are baked into the build)
3. Restart: `pm2 restart oldclubman`

---

## 📞 **Quick Diagnostic Commands**

Run these on your VPS and send me the output:

```bash
# 1. Check backend Pusher config
cd /var/www/html/old-backend
grep PUSHER .env | grep -v "^#"

# 2. Test Pusher connection
php test-pusher-vps.php

# 3. Check if broadcasting route exists
php artisan route:list | grep broadcasting

# 4. Check frontend environment (if you can access the server-side)
cd /var/www/html/old-club-man
node check-pusher-env.js

# 5. Check recent Laravel logs
tail -20 /var/www/html/old-backend/storage/logs/laravel.log
```

---

## 🎯 **Most Likely Issue**

**99% of the time it's one of these:**

1. ✅ **CORS blocking** `/broadcasting/auth` → **FIXED** by updating `config/cors.php`
2. ❌ Frontend `.env.production` missing or not rebuilt
3. ❌ Backend `.env` has wrong `FRONT_URL` (must be `https://test.oldclubman.com`)
4. ❌ Pusher credentials mismatch between frontend and backend

---

## 🚀 **Quick Fix (Run on VPS):**

```bash
# Backend
cd /var/www/html/old-backend
php artisan config:clear
php artisan cache:clear
sudo systemctl restart php8.1-fpm  # or apache2

# Frontend
cd /var/www/html/old-club-man
npm run build
pm2 restart oldclubman

# Check
pm2 logs oldclubman --lines 50
```

Then test the messaging system in your browser!

