# Quick Debug Steps - Connection Failed Issue

## Test Backend Directly in Browser Console (30 seconds)

### Step 1: Open Browser Console
1. Go to your admin panel: http://localhost:3001/register
2. Press `F12` or `Ctrl+Shift+I` (Windows) / `Cmd+Option+I` (Mac)
3. Go to "Console" tab

### Step 2: Paste This Code
```javascript
fetch('https://backendglownaturas.onrender.com/api/auth/register', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: 'CHISOM JOY',
    email: 'chisomjoy2027@glownaturas.com',
    password: 'Caption15$'
  })
})
.then(response => {
  console.log('Status:', response.status)
  return response.json()
})
.then(data => {
  console.log('Response:', data)
})
.catch(error => {
  console.error('Error:', error)
})
```

### Step 3: Check Results

**If you see:**
```
Error: Failed to fetch
```
→ **CORS issue** - backend needs to allow requests from your frontend

**If you see:**
```
Status: 404
Response: {success: false, error: "Route not found"}
```
→ **Endpoint doesn't exist** - backend route is not set up

**If you see:**
```
Status: 500
Response: {success: false, error: "Database connection failed"}
```
→ **Backend database issue** - MongoDB connection problem

**If you see:**
```
Status: 201
Response: {success: true, message: "Account created"}
```
→ **Backend works!** - Problem is in frontend code

---

## Check Network Tab (10 seconds)

1. Open browser DevTools (`F12`)
2. Go to "Network" tab
3. Click "Create account" button
4. Look for the failed request
5. Click on it
6. Take screenshot of:
   - Headers tab
   - Response tab
   - Preview tab

---

## Common Issues & Fixes

### Issue 1: CORS Error
**Error message:** "Access to fetch has been blocked by CORS policy"

**Fix:** Backend needs this:
```javascript
// In backend server.js or app.js
const cors = require('cors')

app.use(cors({
  origin: [
    'http://localhost:3001',
    'https://your-admin-domain.com'
  ],
  credentials: true
}))
```

### Issue 2: Wrong Endpoint Path
**Error message:** 404 Not Found

**Check:** Does backend have this exact route?
```javascript
// Backend should have:
router.post('/api/auth/register', registerController)
// OR
app.post('/api/auth/register', registerController)
```

### Issue 3: MongoDB Not Connected
**Error message:** 500 Internal Server Error

**Check:** Backend environment variables on Render:
- `MONGODB_URI` should be set
- MongoDB Atlas should allow connections from `0.0.0.0/0`

### Issue 4: Timeout (30 seconds)
**Error message:** "Network error. Please check your internet connection."

**Fix:** Increase timeout in frontend:
```typescript
// src/infrastructure/config/api.config.ts
export const API_CONFIG = {
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://backendglownaturas.onrender.com',
  timeout: 60000, // Change from 30000 to 60000 (60 seconds)
  headers: {
    'Content-Type': 'application/json',
  },
}
```

---

## Quick Test URLs

Test these in your browser:

1. **Backend is alive:**
   ```
   https://backendglownaturas.onrender.com
   ```
   Should return: 404 (this is OK - means server is running)

2. **Health check (if exists):**
   ```
   https://backendglownaturas.onrender.com/api/health
   ```
   Should return: `{"status": "healthy"}`

3. **Check admin routes exist:**
   ```
   https://backendglownaturas.onrender.com/api/auth/register
   ```
   Even with GET, should return error (not 404)

---

## Most Likely Issue: CORS

Since backend is running (you saw 404), the issue is probably **CORS**.

**Quick Test:**
```javascript
// In browser console
fetch('https://backendglownaturas.onrender.com/api/auth/register')
  .then(r => console.log('Success:', r))
  .catch(e => console.error('Error:', e.message))
```

If you see: `TypeError: Failed to fetch` or `CORS error` → **CORS is the problem**

---

## Next Steps

1. ✅ Run browser console test (above)
2. ✅ Check Network tab
3. ✅ Share screenshot of error
4. ✅ I'll give you exact fix based on the error

