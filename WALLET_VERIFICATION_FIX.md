# 🔧 Fix: Wallet Not Verified Error

## Problem
```json
{
  "success": false,
  "message": "Wallet is not active or not verified.",
  "risk_score": 100
}
```

## Root Cause
The backend security system requires wallets to be **BOTH**:
1. ✅ `status = 'active'`
2. ❌ `is_verified = true` ← **This is missing!**

When wallets are auto-created on first deposit, they are set to `is_verified = false` for security.

---

## 🚀 Quick Fix Options

### **Option 1: Artisan Command (Recommended)**

I've created a command to verify wallets easily.

1. **Open terminal** in backend folder:
```bash
cd D:\xampp\htdocs\old-backend
```

2. **Run the command** with your email:
```bash
php artisan wallet:verify your-email@example.com
```

3. **Expected output:**
```
✅ Wallet verified successfully!
User: your-email@example.com
Wallet ID: uuid-here
Status: active
Verified: Yes
Balance: $0.00
```

---

### **Option 2: Direct Database Update**

1. **Open phpMyAdmin** or MySQL client

2. **Find your user ID:**
```sql
SELECT id, email, fname, last_name 
FROM clients 
WHERE email = 'your-email@example.com';
```

3. **Check wallet status:**
```sql
SELECT * FROM wallets WHERE client_id = 'YOUR_USER_ID';
```

4. **Update wallet:**
```sql
UPDATE wallets 
SET is_verified = 1, 
    status = 'active'
WHERE client_id = 'YOUR_USER_ID';
```

5. **Verify update:**
```sql
SELECT id, status, is_verified, balance_cents 
FROM wallets 
WHERE client_id = 'YOUR_USER_ID';
```

Expected result:
```
status: active
is_verified: 1
balance_cents: 0
```

---

### **Option 3: Create Admin API Endpoint (For Production)**

If you want a proper verification flow, I can create an admin endpoint to verify wallets.

---

## 🧪 Test After Fix

1. **Retry the purchase:**
   - Go to: `http://localhost:3000/user/wallet/gift-cards`
   - Select amount: $10
   - Select payment gateway
   - Click "Complete Purchase"

2. **Expected result:**
   - ✅ No more "Wallet is not active or not verified" error
   - ✅ Payment initiation succeeds
   - ✅ Redirects to payment gateway OR shows success

---

## 📊 Verification Checklist

Run this query to verify your wallet is ready:

```sql
SELECT 
    w.id,
    w.client_id,
    c.email,
    w.status,
    w.is_verified,
    w.balance_cents,
    w.currency,
    CASE 
        WHEN w.status = 'active' AND w.is_verified = 1 
        THEN '✅ Ready for transactions'
        WHEN w.status != 'active' 
        THEN '❌ Wallet not active'
        WHEN w.is_verified = 0 
        THEN '❌ Wallet not verified'
        ELSE '⚠️ Unknown issue'
    END as transaction_status
FROM wallets w
JOIN clients c ON w.client_id = c.id
WHERE c.email = 'your-email@example.com';
```

Expected output for working wallet:
```
status: active
is_verified: 1
transaction_status: ✅ Ready for transactions
```

---

## 🔍 Why This Happens

The backend auto-creates wallets with `is_verified = false` for security:

```php
// From WalletDepositController.php (lines 51-59)
$wallet = Wallet::firstOrCreate(
    ['client_id' => $client->id],
    [
        'currency' => 'USD',
        'balance_cents' => 0,
        'status' => 'active',
        'is_verified' => false,  // ← Security measure
    ]
);
```

This is a **security feature** to prevent:
- Unauthorized wallet creation
- Fraud attempts
- Automated bot attacks

In production, you'd have a **KYC (Know Your Customer) verification process** before setting `is_verified = true`.

---

## 🛠️ For Development/Testing

If you want to **skip verification for development**, you can modify the backend:

### Temporary Fix (Development Only):

**File:** `old-backend/app/Models/Wallet.php`

Find the `canTransact()` method (around line 96):

```php
// BEFORE (requires verification)
public function canTransact(): bool
{
    return $this->status === 'active' && $this->is_verified;
}

// AFTER (skip verification in dev)
public function canTransact(): bool
{
    // DEVELOPMENT ONLY: Skip verification requirement
    return $this->status === 'active';
    
    // PRODUCTION: Uncomment this line
    // return $this->status === 'active' && $this->is_verified;
}
```

⚠️ **WARNING**: Only use this in development! Never deploy to production without proper verification!

---

## ✅ Recommended Approach

**For Testing Now:**
- Use **Option 1** (Artisan command) or **Option 2** (Database update)

**For Production:**
- Implement proper **KYC verification**
- Add **email verification**
- Add **phone verification**
- Add **identity document upload**
- Then set `is_verified = true` after verification

---

## 🎯 Next Steps

1. ✅ Run the artisan command to verify your wallet
2. ✅ Test the gift card purchase again
3. ✅ It should work now!

---

**Need more help?** Let me know which option you'd like to use!

