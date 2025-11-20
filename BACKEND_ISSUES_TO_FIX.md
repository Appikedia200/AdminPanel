# 🚨 BACKEND ISSUES REQUIRING FIXES

## 📅 Date: November 20, 2025
## 🎯 Priority: HIGH

---

## ❌ ISSUE 1: Rate Limiting Too Strict

**Problem:**
Backend is returning `429 Too Many Requests` very frequently, even for legitimate admin panel usage.

**Evidence:**
```
Nov 20 07:56:18 AM [WARN]: Rate limit exceeded - General
```

**Impact:**
- Admin cannot load products, reviews, orders
- Multiple "Failed to load" errors across all pages
- Poor user experience

**Recommended Fix:**
1. **Increase rate limit** for authenticated admin users
2. **Whitelist admin IP** addresses from rate limiting
3. **Implement different rate limits:**
   - Public API: 60 requests/min
   - Admin Panel: 200 requests/min  
   - Internal API: unlimited

**Backend Code Location:**
- Likely in middleware (e.g., `express-rate-limit` package)
- Check `app.js` or `server.js` for rate limit configuration

**Sample Fix (Node.js/Express):**
```javascript
const rateLimitAdmin = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 200, // 200 requests per minute for admins
  skip: (req) => {
    // Skip rate limit for authenticated admins
    return req.headers.authorization && req.user?.role === 'admin'
  }
})

// Apply different rate limits
app.use('/api/public', rateLimitPublic) // 60/min
app.use('/api/admin', rateLimitAdmin)   // 200/min
```

---

## ❌ ISSUE 2: Email Templates Returning Invalid Data (CRITICAL)

**Status:** Frontend shows "No Email Templates Found" message

**Problem:**
`GET /api/email-templates` either:
1. Returns empty array `[]`
2. Returns templates with `undefined` or missing `type` field
3. Returns 404 or error

**Evidence:**
```
CastError: Cast to ObjectId failed for value "undefined" (type string) 
at path "_id" for model "EmailTemplate"
```

**Impact:**
- Frontend crashes when trying to navigate to email template detail page
- URL becomes `/email-templates/undefined`
- Admin cannot edit email templates

**Root Cause:**
Backend is returning email template objects without proper `type` field:
```json
// ❌ WRONG
{
  "success": true,
  "data": [
    {
      "subject": "...",
      "body": "...",
      "type": undefined  // ❌ Missing or undefined
    }
  ]
}
```

**Expected Response:**
```json
// ✅ CORRECT
{
  "success": true,
  "data": [
    {
      "type": "order-confirmation",  // ✅ Must be present
      "subject": "Order Confirmation #{ORDER_ID}",
      "body": "...",
      "variables": ["ORDER_ID", "CUSTOMER_NAME"],
      "isDefault": true
    }
  ]
}
```

**Backend Fix Required:**
1. **Ensure EmailTemplate model** has required `type` field:
```javascript
const EmailTemplateSchema = new mongoose.Schema({
  type: { 
    type: String, 
    required: true,  // ✅ Make it required
    enum: [
      'order-confirmation',
      'payment-confirmed',
      'order-shipped',
      'order-delivered',
      'order-cancelled',
      'refund-processed'
    ]
  },
  subject: { type: String, required: true },
  body: { type: String, required: true },
  variables: [String],
  isDefault: { type: Boolean, default: false }
})
```

2. **Validate response** in GET `/api/email-templates` endpoint:
```javascript
router.get('/email-templates', async (req, res) => {
  const templates = await EmailTemplate.find()
  
  // Filter out invalid templates
  const validTemplates = templates.filter(t => t.type && t.type !== 'undefined')
  
  res.json({ success: true, data: validTemplates })
})
```

3. **Check database** for corrupted records:
```javascript
// Find templates with undefined or missing type
db.emailtemplates.find({ $or: [{ type: null }, { type: "undefined" }, { type: { $exists: false } }] })
// Delete or fix them
```

---

## ❌ ISSUE 3: ObjectId Cast Error

**Problem:**
Backend trying to cast `"undefined"` string to MongoDB ObjectId.

**Evidence:**
```
CastError: Cast to ObjectId failed for value "undefined" (type string) 
at path "_id" for model "EmailTemplate"
```

**Root Cause:**
Frontend is sending `GET /api/email-templates/undefined` because `template.type` is undefined.

**Backend Fix:**
Add validation middleware to reject invalid IDs:

```javascript
// middleware/validateObjectId.js
const mongoose = require('mongoose')

const validateObjectId = (req, res, next) => {
  const { id, type } = req.params
  
  // Check if param is valid (not undefined, null, etc.)
  const paramToCheck = id || type
  
  if (!paramToCheck || paramToCheck === 'undefined' || paramToCheck === 'null') {
    return res.status(400).json({
      success: false,
      error: 'Invalid ID provided'
    })
  }
  
  next()
}

// Apply to routes
router.get('/email-templates/:type', validateObjectId, async (req, res) => {
  // ... your code
})
```

---

## ✅ FRONTEND FIXES ALREADY APPLIED

1. **Fixed infinite API calls** - Changed `useCallback` dependencies from `[params]` to `[JSON.stringify(params)]`
2. **Added null checks** for email templates - Skip rendering templates with undefined `type`
3. **Improved error handling** - Better error messages for failed API calls

---

## 🧪 TESTING CHECKLIST FOR BACKEND

After fixes, test:
- [ ] Admin can load products page without rate limit errors
- [ ] Admin can load reviews page
- [ ] Admin can load orders page  
- [ ] Email templates list shows all 6 templates with valid `type` field
- [ ] Clicking email template navigates to correct detail page
- [ ] No `CastError` or `undefined` in backend logs
- [ ] Rate limiting only applies after 200 requests/min for authenticated admins

---

## 📞 CONTACT

If questions, coordinate with frontend team.
All frontend issues have been resolved and pushed to production.

