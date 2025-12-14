# Gift Card System Documentation

## Overview

The gift card system is fully implemented and uses the **wallet purchase flow with OTP verification** for security. Gift cards are purchased through the `purchase_requests` table with `product_type='gift_card'`.

## Backend Architecture

### Database Tables

1. **`gift_cards`** - Stores gift card details
   - Columns: id, code, amount_bigint, currency, status (active, issued, redeemed, expired), issued_by, issued_to, redeemed_by, purchase_tx_id, redeem_tx_id, etc.

2. **`purchase_requests`** - Handles all purchases including gift cards
   - Columns: id, client_id, wallet_id, product_type, product_id, quantity, amount_cents, status (pending_otp, otp_verified, processing, completed, failed), otp_id, transaction_id, etc.

### API Endpoints

All endpoints are under `/api/wallet/` prefix:

#### Purchase Flow (with OTP)
```
POST /api/wallet/purchase/initiate
Body: {
  product_type: "gift_card",
  product_id: "uuid-of-gift-card",
  quantity: 1,
  notes: "optional note"
}
Response: {
  success: true,
  data: {
    purchase_request_id: "uuid",
    otp_id: "uuid",
    product_name: "Gift Card - GC-XXXX",
    quantity: 1,
    unit_price_cents: 2000,
    unit_price_dollars: "20.00",
    total_amount_cents: 2000,
    total_amount_dollars: "20.00",
    otp_expires_at: "timestamp"
  }
}
```

```
POST /api/wallet/purchase/verify-otp
Body: {
  purchase_request_id: "uuid",
  otp_code: "123456"
}
Response: {
  success: true,
  data: {
    purchase_request_id: "uuid",
    transaction_id: "uuid",
    product_type: "gift_card",
    new_balance_cents: 50000,
    new_balance_dollars: "500.00",
    completed_at: "timestamp",
    fulfillment_data: {
      gift_card_code: "GC-XXXX-XXXX-XXXX",
      gift_card_id: "uuid"
    }
  }
}
```

```
POST /api/wallet/purchase/resend-otp
Body: {
  purchase_request_id: "uuid"
}
```

#### History
```
GET /api/wallet/purchase/history?product_type=gift_card
```

```
GET /api/wallet/purchase/{id}
```

## Frontend Implementation

### Redux Store (`views/wallet/store/index.js`)

#### State
```javascript
{
  balance: 0,
  giftCardTotalValue: 0,
  transactions: [],
  giftCards: [],
  availableGiftCards: [],
  paymentGateways: [],
  pendingPurchase: null,  // Stores pending purchase for OTP verification
  loading: false,
  error: null
}
```

#### Actions

1. **`initiateGiftCardPurchase(data)`** - Start purchase and send OTP
```javascript
dispatch(initiateGiftCardPurchase({
  gift_card_id: "uuid",
  quantity: 1,
  notes: "optional"
}));
```

2. **`verifyGiftCardPurchase(data)`** - Complete purchase with OTP
```javascript
dispatch(verifyGiftCardPurchase({
  purchase_request_id: "uuid",
  otp_code: "123456"
}));
```

3. **`resendGiftCardOTP(purchase_request_id)`** - Resend OTP code

4. **`getMyGiftCards()`** - Fetch purchased gift cards

### Components

#### 1. `AvailableGiftCards.js`
- Displays available gift cards for purchase
- Initiates purchase flow
- Shows OTP verification modal

#### 2. `GiftCardOTPVerification.js` (NEW)
- Modal component for OTP verification
- Shows purchase summary
- Countdown timer
- Resend OTP functionality
- Auto-completes purchase on verification

#### 3. `GiftCardList.js`
- Displays user's purchased gift cards
- Shows gift card codes (masked)
- Copy code functionality
- Gift to someone option

### Usage Example

```jsx
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { initiateGiftCardPurchase } from '@/views/wallet/store';
import GiftCardOTPVerification from '@/components/wallet/GiftCardOTPVerification';

function GiftCardPurchase() {
  const dispatch = useDispatch();
  const { pendingPurchase } = useSelector(({ wallet }) => wallet);
  const [showOTPModal, setShowOTPModal] = useState(false);

  const handlePurchase = async (giftCardId) => {
    try {
      await dispatch(initiateGiftCardPurchase({
        gift_card_id: giftCardId,
        quantity: 1
      })).unwrap();
      
      setShowOTPModal(true);
    } catch (error) {
      // Error handled in Redux
    }
  };

  return (
    <>
      <button onClick={() => handlePurchase('gift-card-uuid')}>
        Purchase Gift Card
      </button>

      {showOTPModal && pendingPurchase && (
        <GiftCardOTPVerification
          onSuccess={() => {
            setShowOTPModal(false);
            // Refresh gift cards list
          }}
          onCancel={() => setShowOTPModal(false)}
        />
      )}
    </>
  );
}
```

## Purchase Flow

1. **User selects a gift card** → Clicks "Purchase"

2. **Frontend calls `initiateGiftCardPurchase()`**
   - Redux dispatches to `/api/wallet/purchase/initiate`
   - Backend validates, creates `purchase_request`, generates & sends OTP
   - Backend returns `purchase_request_id` and OTP details
   - Frontend stores in `pendingPurchase` state

3. **OTP Verification Modal Opens**
   - User enters 6-digit OTP
   - 5-minute countdown timer
   - Can resend OTP after 1 minute

4. **User submits OTP**
   - Frontend calls `verifyGiftCardPurchase()`
   - Redux dispatches to `/api/wallet/purchase/verify-otp`
   - Backend verifies OTP, processes payment, fulfills order
   - Gift card is assigned to user
   - Wallet balance is updated

5. **Success**
   - OTP modal closes
   - Success message displayed
   - Gift cards list refreshes automatically
   - Balance updates

## Security Features

- **OTP Verification**: Every gift card purchase requires OTP verification
- **Time-based OTP**: OTPs expire after 5 minutes
- **Rate Limiting**: Resend OTP limited to once per minute
- **Transaction Locks**: Database-level locking prevents double-spending
- **Audit Trail**: All purchases logged in `purchase_requests` table
- **Status Tracking**: Multi-stage status (pending_otp → otp_verified → processing → completed)

## Error Handling

- Insufficient balance
- Invalid/expired OTP
- Gift card not available
- Network errors
- All errors shown via toast notifications

## Testing

To test the gift card system:

1. Ensure you have sufficient wallet balance
2. Navigate to `/user/wallet/gift-cards`
3. Select a gift card amount
4. Click "Complete Purchase"
5. Check your email/SMS for OTP
6. Enter OTP in the modal
7. Verify purchase completes
8. Check gift cards list to see your purchased card

## Notes

- Gift cards purchased with wallet balance (not payment gateways)
- Each purchase creates a `purchase_request` record
- Gift cards can be gifted to other users (future feature)
- Gift cards can be redeemed for wallet balance (future feature)
- Admin can create gift card templates for users to purchase

