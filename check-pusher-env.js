/**
 * Pusher Environment Check Script for VPS
 * 
 * Run this on your VPS to check if Pusher environment variables are available
 * 
 * Usage: node check-pusher-env.js
 */

console.log('===========================================');
console.log('   PUSHER FRONTEND ENV CHECK (VPS)');
console.log('===========================================\n');

// Check if we're in production
console.log('📋 Environment:', process.env.NODE_ENV || 'development');
console.log('');

// Required environment variables
const requiredVars = [
    'NEXT_PUBLIC_API_URL',
    'NEXT_PUBLIC_PUSHER_KEY',
    'NEXT_PUBLIC_PUSHER_CLUSTER',
    'NEXT_PUBLIC_CLIENT_FILE_PATH'
];

console.log('🔍 Checking Environment Variables:\n');
console.log('-------------------------------------------');

let allPresent = true;
requiredVars.forEach(varName => {
    const value = process.env[varName];
    if (value) {
        console.log(`✅ ${varName}: ${value}`);
    } else {
        console.log(`❌ ${varName}: NOT SET`);
        allPresent = false;
    }
});

console.log('');

if (!allPresent) {
    console.log('⚠️  WARNING: Missing environment variables!\n');
    console.log('📝 To fix:\n');
    console.log('1. Create .env.production in your Next.js root directory:');
    console.log('');
    console.log('   cat > .env.production << EOF');
    console.log('   NEXT_PUBLIC_API_URL=https://test-api.oldclubman.com/api');
    console.log('   NEXT_PUBLIC_CLIENT_FILE_PATH=https://test-api.oldclubman.com/public/uploads/client');
    console.log('   NEXT_PUBLIC_PUSHER_KEY=your_pusher_app_key');
    console.log('   NEXT_PUBLIC_PUSHER_CLUSTER=ap2');
    console.log('   EOF');
    console.log('');
    console.log('2. Rebuild your Next.js app:');
    console.log('   npm run build');
    console.log('');
    console.log('3. Restart your app:');
    console.log('   pm2 restart oldclubman');
    console.log('');
    process.exit(1);
} else {
    console.log('===========================================');
    console.log('✅ All environment variables are set!');
    console.log('===========================================\n');
    
    console.log('🔍 Next Steps:\n');
    console.log('1. Make sure you rebuild: npm run build');
    console.log('2. Restart your app: pm2 restart oldclubman');
    console.log('3. Check browser console on your site for Pusher connection');
    console.log('4. Look for: "Connected to Pusher" message\n');
}

