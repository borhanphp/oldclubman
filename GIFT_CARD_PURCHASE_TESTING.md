# 🧪 Gift Card Purchase - Testing Guide

## Quick Start Testing

### 1. **Setup Payment Gateway (Backend Admin)**

Before testing, you need at least one active payment gateway in the system.

#### Option A: Use Existing Gateway
If you already created a payment gateway (like the one in your Postman screenshot), skip to step 2.

#### Option B: Create New Payment Gateway
1. Login to backend admin: `http://localhost/old-backend/public/login`
2. Navigate to "Payment Gateways"
3. Click "Create New"
4. Fill in:
   - Name: `sslcommerz` or `stripe` or `paypal`
   - Display Name: `SSLCommerz` (or your preferred name)
   - Supported Currencies: `USD`
   - Fee: `0` (or your fee structure)
   - Status: ✅ **Active**
5. Click "Save"
6. **Copy the gateway ID** (UUID)

---

### 2. **Test in Frontend**

#### Navigate to Gift Cards Page
```
URL: http://localhost:3000/user/wallet/gift-cards
```

#### Steps:
1. ✅ **Login** to your account
2. ✅ Click **"Purchase Gift Cards"** tab
3. ✅ You should see:
   - Four predefined amounts ($10, $20, $50, $100)
   - Custom amount input field
   - Loading spinner for payment gateways

4. ✅ **Select an amount**:
   - Click on **$20** (marked as "Popular")
   - OR enter **50** in the custom amount field

5. ✅ **Select payment gateway**:
   - Wait for payment gateways to load
   - Click on a payment gateway card
   - Green checkmark should appear

6. ✅ **Review summary**:
   - Verify amount is correct
   - Check if fees are displayed (if any)
   - See total amount

7. ✅ **Click "Complete Purchase"**
   - Button shows "Processing..." with spinner
   - Check browser console for logs:
     ```
     Payment initiated: { payment_url, transaction_id, ... }
     ```

8. ✅ **Verify redirect**:
   - If `payment_url` exists, browser redirects to payment gateway
   - If not, you'll see success message and wallet updates

---

### 3. **Test API Directly (Postman)**

#### Request:
```http
POST http://localhost/old-backend/public/api/wallet/deposit/initiate
Content-Type: multipart/form-data
Authorization: Bearer YOUR_TOKEN_HERE

Body (form-data):
amount_dollars: 10
payment_gateway_id: 58028337-bfbf-497c-a8b4-3446bec62d42
```

#### Expected Response:
```json
{
  "success": true,
  "message": "Deposit initiated successfully",
  "data": {
    "payment_url": "https://gateway.com/pay/xyz",
    "transaction_id": "uuid-here",
    "gateway_session_id": "session_123",
    "amount_cents": 1000,
    "wallet_id": "wallet-uuid"
  }
}
```

---

### 4. **Debugging**

#### If Payment Gateways Don't Load:

**Check Browser Console:**
```javascript
// Should see:
Loading payment methods...
// Then either:
✅ Array of gateways
// OR
❌ Error message
```

**Check Network Tab:**
```
Request: GET /api/payment-gateways
Status: 200 OK
Response: { data: [...] }
```

**If you see errors:**
1. Verify backend is running
2. Check `NEXT_PUBLIC_API_URL` in `.env.local`
3. Verify you're logged in (have valid token)
4. Check if payment gateways exist and are active in admin

#### If Purchase Fails:

**Check Browser Console:**
```javascript
// Should see detailed error:
Purchase failed: {error details}
```

**Common Issues:**
- ❌ **"Payment gateway not found"**: Gateway ID is invalid or inactive
- ❌ **"Validation failed"**: Amount is < $1 or > $10,000
- ❌ **"Unauthorized"**: Token expired, login again
- ❌ **"Selected payment gateway is not available"**: Gateway is inactive

---

### 5. **Visual Verification**

#### Amount Selection
- [ ] All 4 predefined amounts visible
- [ ] $20 has "Popular" badge
- [ ] Clicking amount shows purple border
- [ ] Green checkmark appears on selected
- [ ] Custom input works (typing updates selection)

#### Payment Gateway Selection
- [ ] Gateways load (not showing "Loading..." forever)
- [ ] Each gateway shows logo OR credit card icon
- [ ] Gateway name and fees displayed
- [ ] Clicking gateway shows purple border
- [ ] Green checkmark appears on selected

#### Purchase Summary
- [ ] Summary only appears when both amount & gateway selected
- [ ] Amount displayed correctly
- [ ] Payment method name shown
- [ ] Fees calculated correctly
- [ ] Total is sum of amount + fees
- [ ] Button is clickable (not disabled)

---

### 6. **Test Different Amounts**

Test with various amounts to verify validation:

| Amount | Expected Result |
|--------|----------------|
| $0.50  | ❌ Error: "Minimum $1" |
| $1     | ✅ Success |
| $10    | ✅ Success |
| $100   | ✅ Success |
| $10,000 | ✅ Success |
| $10,001 | ❌ Error: "Maximum $10,000" |

---

### 7. **End-to-End Test**

**Full Flow:**
1. ✅ Login to frontend
2. ✅ Go to `/user/wallet/gift-cards`
3. ✅ Click "Purchase Gift Cards" tab
4. ✅ Select $20
5. ✅ Select payment gateway
6. ✅ Click "Complete Purchase"
7. ✅ Verify redirect OR success message
8. ✅ Check wallet balance updated (if applicable)
9. ✅ Go to "My Gift Cards" tab
10. ✅ Verify new gift card appears (if implemented)

---

### 8. **Backend Verification**

After a successful purchase, check the backend:

```sql
-- Check wallet created
SELECT * FROM wallets WHERE client_id = 'your-user-id';

-- Check transaction created
SELECT * FROM wallet_transactions 
WHERE wallet_id = 'wallet-id' 
ORDER BY created_at DESC 
LIMIT 1;
```

---

## 🚨 Troubleshooting

### Problem: "No payment methods available"

**Solution:**
1. Login to backend admin
2. Go to Payment Gateways
3. Ensure at least one gateway exists
4. Ensure it's marked as **Active**
5. Ensure it supports **USD** currency
6. Refresh frontend page

### Problem: Purchase button does nothing

**Solution:**
1. Open browser console
2. Look for error messages
3. Check Network tab for failed requests
4. Verify both amount AND gateway are selected

### Problem: API returns 401 Unauthorized

**Solution:**
1. Logout and login again
2. Token may have expired
3. Check if `Authorization: Bearer {token}` header is present

---

## ✅ Success Criteria

All of these should work:
- [ ] Payment gateways load from API
- [ ] Can select predefined amounts
- [ ] Can enter custom amount
- [ ] Can select payment gateway
- [ ] Purchase summary shows correct values
- [ ] API call succeeds (check console)
- [ ] Appropriate action taken (redirect or success message)
- [ ] No console errors

---

## 📊 Expected API Call

When you click "Complete Purchase", the frontend makes this API call:

```javascript
POST /api/wallet/deposit/initiate

Headers:
  Authorization: Bearer {token}
  Content-Type: multipart/form-data

Body:
  amount_dollars: 20
  payment_gateway_id: "58028337-bfbf-497c-a8b4-3446bec62d42"
```

**Watch for this in Network tab!**

---

## 🎉 You're Ready!

If everything above works, your gift card purchase system is **fully functional**!

**Next**: The user can now purchase gift cards using any configured payment gateway.

---

**Happy Testing!** 🎁

