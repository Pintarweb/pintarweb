# Razorpay Setup Guide for Pintarweb

## Overview

This guide provides step-by-step instructions for setting up Razorpay (formerly Curlec) for Pintarweb's subscription payments. Razorpay is a Malaysian payment gateway that supports FPX, credit/debit cards, e-wallets, and recurring billing.

**Last Updated:** 2026-06-23  
**Account Type:** Individual / Sole Proprietor  
**Business:** Pintarweb (Website-as-a-Service)

---

## Why Razorpay?

✅ **Low fees:** 1.5% for FPX, 2.5% for cards  
✅ **Fast payouts:** T+1 day settlement  
✅ **Recurring billing:** Perfect for subscriptions  
✅ **Multiple payment methods:** FPX, cards, UPI, e-wallets  
✅ **Excellent API:** Easy to integrate and automate  
✅ **Local support:** Malaysian-based support team  
✅ **No monthly fees:** Pay only per transaction

---

## Account Setup

### Step 1: Create Account

1. **Go to Razorpay signup:**
   - URL: https://dashboard.razorpay.com/signup
   - Click "Sign Up"

2. **Choose account type:**
   - Select **Individual** or **Sole Proprietor**
   - For Pintarweb, choose **Sole Proprietor**

3. **Fill in business details:**
   ```
   Business Name: Pintarweb
   Business Category: Services → IT Services
   Business Type: Sole Proprietorship
   Website: https://pintarweb.com (or https://preview.pintarweb.com)
   ```

4. **Fill in personal details:**
   ```
   Full Name: Yusmarin
   Email: yusmarin@gmail.com
   Phone: [Your phone number]
   Password: [Create strong password]
   ```

5. **Verify email:**
   - Check your email for verification link
   - Click the link to verify

6. **Complete KYC (Know Your Customer):**
   - Upload IC (front and back) - clear photo
   - Upload bank statement or cancelled cheque
   - Provide PAN card (if you have one) or business registration
   - Wait for approval (1-2 business days)

**Time:** 30 minutes  
**Cost:** Free  
**Status:** Pending approval

---

### Step 2: Configure Payment Methods

After account approval:

1. **Log in to Razorpay Dashboard:**
   - URL: https://dashboard.razorpay.com/

2. **Go to Settings → Payment Methods:**
   - Click on **Settings** in the left sidebar
   - Click on **Payment Methods**

3. **Enable payment methods:**
   ```
   ✅ Cards (Credit/Debit) - 2.5% fee
      - Visa, Mastercard, AMEX
      - 3D Secure enabled by default
   
   ✅ Netbanking (FPX) - 1.5% fee
      - All major Malaysian banks
      - Maybank, CIMB, Public Bank, etc.
   
   ✅ UPI / DuitNow - 1.5% fee
      - DuitNow QR
      - DuitNow Transfer
   
   ✅ Wallets - 2% fee
      - Touch 'n Go eWallet
      - GrabPay
      - Boost
   ```

4. **Configure settlement preferences:**
   - Go to **Settings** → **Settlements**
   - Settlement cycle: **Daily (T+1)**
   - Minimum settlement amount: **RM 100**
   - Auto-settlement: **Enabled**

5. **Save settings**

**Time:** 15 minutes  
**Cost:** Free

---

### Step 3: Link Bank Account

1. **Go to Settings → Settlements → Bank Accounts:**
   - Click **Add Bank Account**

2. **Enter bank details:**
   ```
   Account Holder Name: Yusmarin (must match IC)
   Account Number: [Your account number]
   Bank Name: [Maybank / CIMB / Public Bank / etc.]
   IFSC Code: [For Malaysian banks, use bank code]
   ```

   **Malaysian Bank Codes:**
   - Maybank: MBBEMYKL
   - CIMB: CIBBMYKL
   - Public Bank: PBBEMYKL
   - Hong Leong: HLBBMYKL
   - RHB: RHBBMYKL
   - AmBank: AMBAMYKL
   - Bank Islam: BIMBMYKL
   - Bank Rakyat: BKRBMYK1
   - Affin Bank: AGOBMYKL
   - UOB: UOVBMYKL
   - OCBC: OCBCMYKL
   - HSBC: HBBEMYKL
   - Standard Chartered: SCBMMYKL
   - Alliance Bank: BBNAMYKL
   - Bank Muamalat: BIMBMYKL

3. **Verify bank account:**
   - Razorpay will make 2 small test deposits (RM 1.00 - RM 2.00)
   - Wait 1-2 business days
   - Check your bank statement
   - Go back to Razorpay dashboard
   - Enter the exact amounts to verify

4. **Set as default settlement account:**
   - Click "Set as Default" on your verified account

**Time:** 10 minutes + 1-2 days for verification  
**Cost:** Free

---

### Step 4: Create Payment Link Template

1. **Go to Payment Links:**
   - Click **Payment Links** in the left sidebar
   - Click **Create New Link**

2. **Fill in link details:**
   ```
   Title: Pintarweb Subscription - 3 Months Advance
   
   Description: Website-as-a-Service subscription for 3 months. 
   Includes website, SEO, WhatsApp auto-reply, and GMB optimization.
   
   Amount: 447.00
   Currency: MYR
   
   Reference: PWT-001 (or auto-generate)
   
   Customer details: Optional (customer can fill in)
   ```

3. **Configure link settings:**
   - ✅ Enable email notifications
   - ✅ Enable SMS notifications
   - ✅ Allow partial payments: No
   - ✅ Set expiry: 7 days (or custom)
   - ✅ Enable recurring: Yes (for future subscriptions)

4. **Customize payment page:**
   - Upload Pintarweb logo
   - Set brand color: #1B4332 (forest green)
   - Add custom message: "Terima kasih untuk subscription Pintarweb!"

5. **Save the link**

6. **Test the link:**
   - Copy the payment link
   - Open in new browser tab
   - Verify amount and description
   - Test with card (use test card if in test mode)

**Time:** 15 minutes  
**Cost:** Free

---

### Step 5: Test Payment

1. **Enable test mode (optional):**
   - Go to **Settings** → **Preferences**
   - Toggle to **Test Mode**
   - Use test card: 4111 1111 1111 1111
   - CVV: Any 3 digits
   - Expiry: Any future date

2. **Or use live mode with small amount:**
   - Create payment link for RM 1.00
   - Pay with real card
   - Refund after verification

3. **Complete test payment:**
   - Enter customer details:
     - Name: Test Customer
     - Email: test@example.com
     - Phone: 0123456789
   - Choose payment method: Card or FPX
   - Complete payment

4. **Verify payment:**
   - Go to **Payments** in dashboard
   - Check payment appears
   - Verify status: **Captured**
   - Check settlement schedule

5. **Refund test payment (if needed):**
   - Click on the payment
   - Click **Refund**
   - Enter amount: Full refund
   - Confirm refund

**Time:** 10 minutes  
**Cost:** RM 0 (refund the test payment)

---

### Step 6: Set Up Subscription Plans

For automatic subscription renewals, create 4 plans:

#### Plan 1: Monthly
```
Plan Name: Pintarweb Monthly
Amount: 149.00
Currency: MYR
Frequency: Every 1 month
Trial Period: None
```

#### Plan 2: Quarterly (Save RM 30)
```
Plan Name: Pintarweb Quarterly
Amount: 417.00
Currency: MYR
Frequency: Every 3 months
Trial Period: None
```

#### Plan 3: Bi-Annual (Save RM 120)
```
Plan Name: Pintarweb Bi-Annual
Amount: 774.00
Currency: MYR
Frequency: Every 6 months
Trial Period: None
```

#### Plan 4: Annual (Save RM 480)
```
Plan Name: Pintarweb Annual
Amount: 1308.00
Currency: MYR
Frequency: Every 12 months
Trial Period: None
```

**Configure all plans:**
- ✅ Enable auto-renewal
- ✅ Send renewal reminders (7 days before)
- ✅ Allow plan changes: Yes
- ✅ Allow cancellation: Yes (with 14 days notice)

**Time:** 30 minutes  
**Cost:** Free

### Step 7: Set Up Offers (Discounts)

For promotional pricing and referral discounts:

1. **Go to Offers:**
   - Click **Offers** in the left sidebar
   - Click **Create New Offer**

2. **Create offer types:**

#### Offer 1: Early Bird (First 5 Customers)
```
Offer Name: Early Bird Pintarweb
Display Text: 10% discount for early adopters
Discount Type: Percentage (10%)
Applicable On: All subscription plans
Validity: Until 31 Dec 2026
Max Usage: 5
```

#### Offer 2: Referral Discount
```
Offer Name: Referral Discount
Display Text: RM 50 off for referred customers
Discount Type: Fixed Amount (RM 50)
Applicable On: All subscription plans
Validity: Ongoing
Max Usage: 100
```

3. **Link offer to subscription:**
   - When creating subscription, pass `offer_id` parameter
   - Customer sees discount automatically at checkout

**Time:** 20 minutes  
**Cost:** Free

---

### Step 7: Document Payment Workflow

Create a document (Google Doc or Notion) with:

#### Creating Payment Links
```
1. Go to Razorpay Dashboard → Payment Links
2. Click "Create New Link"
3. Fill in details:
   - Title: Pintarweb Subscription - [Customer Name]
   - Amount: RM 447.00
   - Reference: PWT-[Customer Number] (e.g., PWT-001, PWT-002)
4. Save and copy link
5. Send to customer via WhatsApp
```

#### Checking Payment Status
```
1. Go to Razorpay Dashboard → Payments
2. Search by reference (e.g., PWT-001)
3. Check status:
   - Authorized: Payment pending
   - Captured: Payment successful
   - Failed: Payment failed
   - Refunded: Payment refunded
```

#### Issuing Refunds
```
1. Go to Payments → Find payment
2. Click "Refund"
3. Choose refund type:
   - Full refund: Entire amount
   - Partial refund: Specific amount
4. Enter reason
5. Confirm refund
6. Refund processed in 5-7 business days
```

#### Viewing Transaction History
```
1. Go to Payments
2. Use filters:
   - Date range
   - Status (Captured, Failed, Refunded)
   - Payment method (Card, FPX, etc.)
3. Export to CSV for accounting
```

#### Setting Up Recurring Billing
```
1. Go to Subscriptions → Plans
2. Select or create plan
3. Create subscription link
4. Send to customer
5. Customer authorizes recurring payment
6. Auto-renewal happens every 3 months
```

**Time:** 20 minutes  
**Cost:** Free

---

## API Integration (Future)

For automating payment links:

### API Keys
1. Go to **Settings** → **API Keys**
2. Generate keys:
   - **Key ID:** Public key (safe to share)
   - **Key Secret:** Private key (keep secret!)
3. Store in `.env` file:
   ```env
   RAZORPAY_KEY_ID=rzp_xxxxxxxxxxxx
   RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxxxxxx
   ```

### Create Payment Link via API
```javascript
const Razorpay = require('razorpay');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

async function createPaymentLink(customerName, reference) {
  const link = await razorpay.paymentLink.create({
    amount: 44700, // Amount in paise (RM 447.00 = 44700 paise)
    currency: 'MYR',
    description: 'Pintarweb Subscription - 3 Months Advance',
    reference_id: reference,
    customer: {
      name: customerName,
      email: 'customer@example.com',
      contact: '+60123456789',
    },
    notify: {
      sms: true,
      email: true,
    },
    reminder_enable: true,
    notes: {
      business: 'Pintarweb',
      plan: '3-Month Subscription',
    },
  });
  
  return link.short_url;
}
```

### Webhook for Payment Confirmation
```javascript
// Set up webhook in Razorpay Dashboard → Settings → Webhooks
// Endpoint: https://your-domain.com/api/webhooks/razorpay

app.post('/api/webhooks/razorpay', (req, res) => {
  const signature = req.headers['x-razorpay-signature'];
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
  
  // Verify signature
  const isValid = verifyWebhookSignature(req.body, signature, webhookSecret);
  
  if (isValid) {
    const event = req.body.event;
    const payment = req.body.payload.payment.entity;
    
    if (event === 'payment.captured') {
      // Payment successful
      console.log(`Payment captured: ${payment.id}`);
      console.log(`Amount: RM ${payment.amount / 100}`);
      console.log(`Reference: ${payment.notes.reference_id}`);
      
      // Update database
      // Send confirmation email
      // Trigger onboarding workflow
    }
  }
  
  res.json({ status: 'ok' });
});
```

**Time:** 2-3 hours (when ready to integrate)  
**Cost:** Free

---

## Fee Structure

### Transaction Fees
| Payment Method | Fee | Example (RM 447) |
|----------------|-----|------------------|
| FPX (Netbanking) | 1.5% | RM 6.71 |
| DuitNow (UPI) | 1.5% | RM 6.71 |
| Credit/Debit Cards | 2.5% | RM 11.18 |
| E-Wallets | 2.0% | RM 8.94 |

### Settlement Fees
- **Daily settlement:** Free
- **Instant settlement:** RM 25 per settlement (optional)

### Other Fees
- **Refunds:** Original fee not refunded
- **Chargebacks:** RM 100 + disputed amount
- **International cards:** Additional 2% fee

### Example Calculation
```
Customer pays: RM 447.00 (via FPX)
Transaction fee: RM 6.71 (1.5%)
You receive: RM 440.29
```

**Monthly cost for 10 customers:**
- 10 × RM 447 = RM 4,470 revenue
- 10 × RM 6.71 = RM 67.10 fees
- **Net revenue: RM 4,402.90**

---

## Troubleshooting

### Account Not Approved
- **Issue:** KYC rejected
- **Solution:** 
  - Ensure IC photo is clear and complete
  - Bank statement must show your name and account number
  - Re-upload documents
  - Contact support: support@razorpay.com

### Bank Verification Failed
- **Issue:** Test deposits not received
- **Solution:**
  - Wait 2-3 business days
  - Check bank statement carefully
  - Ensure account number is correct
  - Contact Razorpay support

### Payment Link Not Working
- **Issue:** Link shows error
- **Solution:**
  - Check if account is active (not suspended)
  - Verify amount is > RM 1.00
  - Ensure payment methods are enabled
  - Try creating new link

### Settlement Delayed
- **Issue:** Money not in bank account
- **Solution:**
  - Check settlement schedule (T+1)
  - Verify bank account is verified
  - Check minimum settlement amount (RM 100)
  - Contact Razorpay support

---

## Support Resources

### Documentation
- **Razorpay Docs:** https://razorpay.com/docs/
- **API Reference:** https://razorpay.com/docs/api/
- **Payment Links:** https://razorpay.com/docs/payment-links/
- **Subscriptions:** https://razorpay.com/docs/subscriptions/

### Support Channels
- **Email:** support@razorpay.com
- **Live Chat:** Available in dashboard (9am-6pm MYT)
- **Phone:** +60 3-3099 2800 (Malaysia)
- **Help Center:** https://razorpay.com/support/

### Community
- **Razorpay Blog:** https://razorpay.com/blog/
- **Developer Forum:** https://forums.razorpay.com/

---

## Checklist

### Account Setup
- [ ] Razorpay account created
- [ ] Email verified
- [ ] KYC completed and approved
- [ ] Payment methods configured
- [ ] Bank account linked and verified
- [ ] Settlement preferences set

### Payment Links
- [ ] Payment link template created
- [ ] Test payment completed
- [ ] Payment workflow documented
- [ ] Recurring billing set up (optional)

### API Integration (Future)
- [ ] API keys generated
- [ ] Webhook configured
- [ ] Payment link automation built
- [ ] Payment confirmation webhook built

### Testing
- [ ] Test payment via FPX
- [ ] Test payment via card
- [ ] Test refund process
- [ ] Test recurring billing
- [ ] Verify settlement in bank account

---

## Next Steps

1. **Complete account setup** (Steps 1-3)
2. **Create payment link template** (Step 4)
3. **Test payment flow** (Step 5)
4. **Document workflow** (Step 7)
5. **Integrate with Pintarweb** (API section, when ready)

---

**Status:** Ready to execute  
**Estimated time:** 2-3 hours for full setup  
**Cost:** Free (no setup or monthly fees)
