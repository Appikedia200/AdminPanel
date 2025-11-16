# 🔧 COMPREHENSIVE FIX PROMPT FOR ADMINPANEL

## 📋 PROJECT OVERVIEW

**Project:** GlowNatura Admin Panel
**Tech Stack:** Next.js 15 + React 19 + TypeScript + Tailwind CSS
**Backend API:** https://backendglownaturas.onrender.com
**Architecture:** Clean Architecture - Admin Panel is ONLY an interface to communicate with the backend

**CRITICAL PRINCIPLE:**
The Admin Panel does NOT handle business logic. It's purely a UI that calls backend APIs. The backend handles:
- All validation
- Authentication & authorization
- File uploads to Cloudinary
- Email sending
- PDF generation
- Business rules
- Data persistence

Admin Panel only:
- Displays data from backend
- Sends user input to backend
- Shows loading/error states
- Provides good UX

---

## 🔴 CRITICAL ISSUES TO FIX

### 1. AUTHENTICATION SYSTEM COMPLETELY BROKEN ❌

**Current Problems:**
- Registration creates account but shows NO confirmation message
- No email sent to user after registration
- Login fails with "Access Denied" even for valid accounts
- No OTP/verification code system implemented
- No "Remember Device for 30 Days" functionality

**What Needs to Be Fixed:**

#### A. Registration Flow
```typescript
// Expected Flow:
1. User fills registration form (name, email, password)
2. Submit POST /api/auth/register
3. Backend sends verification email with OTP code
4. Show success message: "Account created! Check your email for verification code"
5. Redirect to verification page where user enters OTP
6. Submit OTP to POST /api/auth/verify-email
7. Show success: "Email verified! You can now login"
8. Redirect to login page
```

**Files to Create/Update:**
- `/src/app/(auth)/register/page.tsx` - Add success message, redirect to verification
- `/src/app/(auth)/verify-email/page.tsx` - NEW PAGE for OTP entry
- `/src/infrastructure/repositories/auth.repository.ts` - Add `verifyEmail(email, otp)` method

#### B. Login Flow with OTP
```typescript
// Expected Flow:
1. User enters email + password
2. Submit POST /api/auth/login
3. Backend sends OTP to email (instead of returning token directly)
4. Show message: "OTP sent to your email"
5. Show OTP input field
6. User enters OTP
7. Submit POST /api/auth/verify-otp { email, otp, rememberDevice: boolean }
8. Backend returns JWT token
9. If rememberDevice=true, set cookie with 30-day expiry
10. If rememberDevice=false, set cookie with session expiry
11. Redirect to dashboard
```

**Files to Create/Update:**
- `/src/app/(auth)/login/page.tsx` - Add OTP input, remember device checkbox
- `/src/infrastructure/repositories/auth.repository.ts` - Add `verifyOTP(email, otp)` method
- `/src/infrastructure/config/api.config.ts` - Add `verifyOtp` endpoint

#### C. Device Memory (30 Days)
```typescript
// When user checks "Remember this device for 30 days":
Cookies.set('auth_token', token, {
  expires: 30, // 30 days
  sameSite: 'strict',
  secure: true
})

Cookies.set('device_id', deviceId, {
  expires: 30,
  sameSite: 'strict',
  secure: true
})

// When NOT checked:
Cookies.set('auth_token', token) // Session only (deleted when browser closes)

// On future logins, send device_id
// If backend recognizes device_id, skip OTP
```

**Files to Update:**
- `/src/app/(auth)/login/page.tsx` - Add device ID logic
- `/src/infrastructure/api/client.ts` - Send device ID with login requests

---

### 2. SETTINGS MODULE INCOMPLETE ❌

**Current State:** Settings page only has basic store info
**Required Features:**

#### A. Store Information (Already Exists - Verify It Works)
```typescript
// Backend Model: /api/settings
{
  store: {
    name: string,        // "GlowNatura Store"
    email: string,       // "support@glownatura.com"
    phone: string,       // "+234 801 234 5678"
    address: string,     // "123 Main Street"
    city: string,        // "Lagos"
    state: string,       // "Lagos State"
    postalCode: string,  // "100001"
    country: string      // "Nigeria"
  }
}
```

**Used In:**
- Order receipts/invoices (PDF)
- Email footers
- Frontend contact page

**File to Update:**
- `/src/app/(dashboard)/settings/page.tsx` - Ensure all fields exist

#### B. WhatsApp Settings (MISSING - MUST ADD)
```typescript
// Add to Settings Page
{
  whatsapp: {
    enabled: boolean,   // Show/hide WhatsApp button on frontend
    number: string,     // "+2348012345678" (with country code)
    message: string     // "Hi, I need help with..." (pre-filled text)
  }
}
```

**What It Controls:**
- WhatsApp floating button on frontend website (bottom-right corner)
- The number customers will contact
- Pre-filled message when button is clicked

**File to Create/Update:**
- `/src/app/(dashboard)/settings/page.tsx` - Add WhatsApp section with:
  - Toggle switch for enabled/disabled
  - Input for phone number (with country code validation)
  - Textarea for default message

#### C. Social Media Links (MISSING - MUST ADD)
```typescript
// Add to Settings Page
{
  social: {
    facebook: string,   // "https://facebook.com/glownatura"
    instagram: string,  // "https://instagram.com/glownatura"
    twitter: string,    // "https://twitter.com/glownatura"
    tiktok: string      // "https://tiktok.com/@glownatura"
  }
}
```

**Used In:**
- Frontend website footer
- Email templates
- Contact sections

**File to Create/Update:**
- `/src/app/(dashboard)/settings/page.tsx` - Add Social Media section

#### D. Email Templates (MISSING - MUST ADD)
```typescript
// NEW PAGE NEEDED: /settings/email-templates

// Backend Endpoints:
GET    /api/email-templates           // Get all templates
GET    /api/email-templates/:type     // Get specific template
PUT    /api/email-templates/:id       // Update template

// Template Types:
1. order-created          // Payment pending
2. payment-confirmed      // Payment received
3. order-shipped-local    // Local delivery
4. order-shipped-courier  // Courier delivery
5. order-pickup-ready     // Ready for pickup
6. order-delivered        // Delivered
7. order-cancelled        // Cancelled

// Each Template Has:
{
  subject: string,         // Email subject line
  htmlContent: string,     // HTML body (with variables)
  textContent: string,     // Plain text fallback
  variables: string[]      // Available: {customerName}, {orderNumber}, {trackingNumber}, etc.
}
```

**File to Create:**
- `/src/app/(dashboard)/settings/email-templates/page.tsx` - List all templates
- `/src/app/(dashboard)/settings/email-templates/[type]/page.tsx` - Edit template
- Add navigation link in settings sidebar

**UI Requirements:**
- List of all email template types
- Click to edit
- Rich text editor or textarea for HTML content
- Preview button (shows with sample data)
- Variable helper (shows available variables like {customerName})
- Save button

---

### 3. PRODUCT MANAGEMENT BROKEN ❌

#### A. Product Creation Form Missing Image Upload
**Current:** Form requires images but has NO upload UI
**Result:** Creating products FAILS validation

**Fix Required:**
```typescript
// Add to /src/app/(dashboard)/products/new/page.tsx

// 1. Add file input
<input
  type="file"
  accept="image/*"
  multiple
  onChange={handleImageUpload}
/>

// 2. Upload images to backend first
const handleImageUpload = async (files: FileList) => {
  const uploadedImages = []

  for (const file of Array.from(files)) {
    const formData = new FormData()
    formData.append('image', file)

    // Upload to backend (backend uploads to Cloudinary)
    const response = await apiClient.post('/api/media', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })

    uploadedImages.push({
      url: response.data.cloudinaryUrl,
      altText: file.name,
      isDefault: uploadedImages.length === 0
    })
  }

  setProductImages(uploadedImages)
}

// 3. Show image previews with delete option
// 4. Set first image as default (isDefault: true)
// 5. When submitting product, include images array
```

**Files to Update:**
- `/src/app/(dashboard)/products/new/page.tsx` - Add image upload UI
- `/src/presentation/validators/product.validator.ts` - Ensure images validation

#### B. Product Edit Page Missing (404 Error)
**Current:** Edit button exists but page doesn't exist

**Fix Required:**
```typescript
// Create new file: /src/app/(dashboard)/products/[id]/edit/page.tsx

// 1. Get product ID from URL params
// 2. Fetch existing product: GET /api/products/:id
// 3. Pre-fill form with existing data
// 4. Allow editing all fields (same form as create)
// 5. Show existing images with ability to add/remove
// 6. Submit: PUT /api/products/:id
```

**Files to Create:**
- `/src/app/(dashboard)/products/[id]/edit/page.tsx`

#### C. Category Selection is Text Input (Should be Dropdown)
**Current:** Users must manually type MongoDB ObjectIDs
**Fix Required:**

```typescript
// Replace text input with select dropdown

// 1. Fetch categories on page load
const { data: categories } = await apiClient.get('/api/categories')

// 2. Show dropdown
<select name="category" required>
  <option value="">Select Category</option>
  {categories.map(cat => (
    <option key={cat._id} value={cat._id}>
      {cat.name}
    </option>
  ))}
</select>

// 3. Use shadcn/ui Select component for better UX
```

**Files to Update:**
- `/src/app/(dashboard)/products/new/page.tsx`
- `/src/app/(dashboard)/products/[id]/edit/page.tsx`

---

### 4. DASHBOARD STATS NOT WORKING ❌

**Current:** All stats hardcoded to "0"
**Fix Required:**

```typescript
// /src/app/(dashboard)/page.tsx

// 1. Fetch stats on page load
const { data: stats } = await apiClient.get('/api/dashboard/stats')

// Backend returns:
{
  products: {
    total: number,
    active: number,
    lowStock: number
  },
  orders: {
    total: number,
    pending: number,
    processing: number,
    completed: number,
    revenue: number
  },
  reviews: {
    total: number,
    pending: number,
    approved: number,
    averageRating: number
  },
  customers: {
    total: number,
    new: number
  }
}

// 2. Display in dashboard cards
// 3. Add loading skeleton while fetching
// 4. Handle errors gracefully
```

**Files to Update:**
- `/src/app/(dashboard)/page.tsx`

---

### 5. REVIEWS BADGE COUNT HARDCODED ❌

**Current:** Sidebar shows "12" hardcoded
**Fix Required:**

```typescript
// Fetch pending reviews count
const { data } = await apiClient.get('/api/reviews?status=pending')
const pendingCount = data.pagination.total

// Update sidebar to show dynamic count
<Badge>{pendingCount}</Badge>
```

**Files to Update:**
- `/src/presentation/components/layout/AdminSidebar.tsx`

---

### 6. MEDIA LIBRARY INCOMPLETE ❌

**Current:** Placeholder page only
**Fix Required:**

```typescript
// /src/app/(dashboard)/media/page.tsx

// Features to Add:
1. Upload button (multiple files)
2. Grid view of all uploaded images
3. Pagination (50 per page)
4. Search by title/tags
5. Filter by date uploaded
6. Delete images (with confirmation)
7. Click image to view full size
8. Edit image metadata (title, alt text, tags)
9. Copy Cloudinary URL to clipboard

// Backend endpoints available:
GET    /api/media?page=1&limit=50&search=...
POST   /api/media (FormData)
PUT    /api/media/:id
DELETE /api/media/:id
```

**Files to Update:**
- `/src/app/(dashboard)/media/page.tsx` - Complete implementation

---

### 7. SECURITY: CLIENT-SIDE ONLY ROUTE PROTECTION ⚠️

**Current:** Route protection only in client-side useAuthGuard hook
**Fix Required:**

```typescript
// Create Next.js middleware for server-side auth

// /src/middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value
  const isAuthPage = request.nextUrl.pathname.startsWith('/login') ||
                     request.nextUrl.pathname.startsWith('/register')
  const isDashboardPage = !isAuthPage && request.nextUrl.pathname !== '/'

  // Redirect to login if accessing dashboard without token
  if (isDashboardPage && !token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Redirect to dashboard if accessing auth pages with token
  if (isAuthPage && token) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
```

**Files to Create:**
- `/src/middleware.ts`

---

## 📚 BACKEND API CONTRACT (CRITICAL REFERENCE)

### Authentication Endpoints

```typescript
// REGISTRATION
POST /api/auth/register
Body: { name: string, email: string, password: string }
Response: { success: true, message: "Verification email sent" }
// Backend sends email with OTP

// EMAIL VERIFICATION
POST /api/auth/verify-email
Body: { email: string, otp: string }
Response: { success: true, message: "Email verified" }

// LOGIN (Step 1: Request OTP)
POST /api/auth/login
Body: { email: string, password: string }
Response: { success: true, message: "OTP sent to your email" }

// LOGIN (Step 2: Verify OTP)
POST /api/auth/verify-otp
Body: { email: string, otp: string, deviceId?: string }
Response: {
  success: true,
  token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  data: { _id: "...", name: "...", email: "..." }
}

// GET CURRENT USER
GET /api/auth/me
Headers: { Authorization: "Bearer <token>" }
Response: { success: true, data: Admin }

// LOGOUT
POST /api/auth/logout
Headers: { Authorization: "Bearer <token>" }
Response: { success: true }
```

### Product Endpoints

```typescript
// LIST PRODUCTS
GET /api/products?page=1&limit=20&search=...&category=...&status=...
Response: { success: true, data: Product[], pagination: {...} }

// GET PRODUCT
GET /api/products/:id
Response: { success: true, data: Product }

// CREATE PRODUCT
POST /api/products
Headers: { Authorization: "Bearer <token>" }
Body: {
  name: string,
  description: { short: string, full: string },
  price: number,
  salePrice?: number,
  images: [{ url: string, altText: string, isDefault: boolean }],
  category: string, // ObjectId
  stock: number,
  sku: string,
  keywords?: string[],
  ingredients?: string[],
  status: 'active' | 'inactive' | 'draft'
}
Response: { success: true, data: Product }

// UPDATE PRODUCT
PUT /api/products/:id
Headers: { Authorization: "Bearer <token>" }
Body: { ...same as create }
Response: { success: true, data: Product }

// DELETE PRODUCT
DELETE /api/products/:id
Headers: { Authorization: "Bearer <token>" }
Response: { success: true }

// GENERATE SKU
POST /api/products/generate-sku
Body: { categoryId?: string }
Response: { success: true, data: { sku: "GLOW-001" } }
```

### Media Endpoints

```typescript
// UPLOAD IMAGE
POST /api/media
Headers: {
  Authorization: "Bearer <token>",
  Content-Type: "multipart/form-data"
}
Body: FormData with 'image' file
Response: {
  success: true,
  data: {
    _id: "...",
    cloudinaryUrl: "https://res.cloudinary.com/...",
    cloudinaryPublicId: "glownatura/...",
    fileSize: 245678,
    mimeType: "image/jpeg"
  }
}

// LIST MEDIA
GET /api/media?page=1&limit=50&search=...
Response: { success: true, data: Media[], pagination: {...} }

// UPDATE MEDIA
PUT /api/media/:id
Body: { title: string, altText: string, tags: string[] }
Response: { success: true, data: Media }

// DELETE MEDIA
DELETE /api/media/:id
Response: { success: true }
```

### Settings Endpoints

```typescript
// GET SETTINGS
GET /api/settings
Response: {
  success: true,
  data: {
    store: {
      name: string,
      email: string,
      phone: string,
      address: string,
      city: string,
      state: string,
      postalCode: string,
      country: string
    },
    whatsapp: {
      enabled: boolean,
      number: string,
      message: string
    },
    social: {
      facebook: string,
      instagram: string,
      twitter: string,
      tiktok: string
    }
  }
}

// UPDATE SETTINGS
PUT /api/settings
Headers: { Authorization: "Bearer <token>" }
Body: { store?: {...}, whatsapp?: {...}, social?: {...} }
Response: { success: true, data: Settings }
```

### Email Template Endpoints

```typescript
// GET ALL TEMPLATES
GET /api/email-templates
Response: { success: true, data: EmailTemplate[] }

// GET TEMPLATE BY TYPE
GET /api/email-templates/:type
// Types: order-created, payment-confirmed, order-shipped-local,
//        order-shipped-courier, order-pickup-ready, order-delivered, order-cancelled
Response: { success: true, data: EmailTemplate }

// UPDATE TEMPLATE
PUT /api/email-templates/:id
Body: {
  subject: string,
  htmlContent: string,
  textContent: string
}
Response: { success: true, data: EmailTemplate }
```

### Dashboard Endpoints

```typescript
// GET DASHBOARD STATS
GET /api/dashboard/stats
Headers: { Authorization: "Bearer <token>" }
Response: {
  success: true,
  data: {
    products: { total: number, active: number, lowStock: number },
    orders: { total: number, pending: number, revenue: number },
    reviews: { total: number, pending: number, averageRating: number },
    customers: { total: number, new: number }
  }
}
```

---

## ✅ COMPLETE CHECKLIST OF FIXES NEEDED

### Authentication & Security
- [ ] Fix registration to show success message
- [ ] Create email verification page with OTP input
- [ ] Add email verification API call
- [ ] Implement OTP login system (2-step)
- [ ] Add "Remember device for 30 days" checkbox
- [ ] Implement device ID cookie logic
- [ ] Create Next.js middleware for server-side route protection
- [ ] Update auth repository with new methods

### Settings Module
- [ ] Verify store information section works
- [ ] Add WhatsApp settings section (enable toggle, number, message)
- [ ] Add social media links section (Facebook, Instagram, Twitter, TikTok)
- [ ] Create email templates list page
- [ ] Create email template editor page
- [ ] Add rich text editor for email content
- [ ] Add template preview functionality
- [ ] Add navigation link for email templates in sidebar

### Product Management
- [ ] Add image upload UI to product creation form
- [ ] Implement image upload to /api/media endpoint
- [ ] Show uploaded image previews with delete option
- [ ] Set first image as default
- [ ] Create product edit page at /products/[id]/edit
- [ ] Pre-fill edit form with existing product data
- [ ] Change category input from text to dropdown
- [ ] Fetch categories from API for dropdown
- [ ] Use shadcn/ui Select component

### Dashboard
- [ ] Integrate /api/dashboard/stats endpoint
- [ ] Display real stats instead of hardcoded "0"
- [ ] Add loading skeleton while fetching stats
- [ ] Handle errors gracefully

### Reviews
- [ ] Make sidebar badge count dynamic
- [ ] Fetch pending reviews count from API
- [ ] Update count in real-time after admin actions

### Media Library
- [ ] Add upload button with file input
- [ ] Implement grid view of uploaded images
- [ ] Add pagination (50 per page)
- [ ] Add search functionality
- [ ] Add delete functionality with confirmation
- [ ] Add image metadata editor
- [ ] Add "Copy URL" button for each image
- [ ] Add lightbox for full-size image view

### Code Quality
- [ ] Replace `any` types in settings page with proper types
- [ ] Add React Error Boundary component
- [ ] Add loading states for navigation
- [ ] Create `.env.example` file
- [ ] Fix API URL inconsistencies in docs

---

## 🎯 IMPLEMENTATION PRIORITY

### Phase 1: CRITICAL (Must Fix First)
1. Authentication system (registration, OTP login, verification)
2. Product image upload
3. Product edit page
4. Category dropdown
5. Server-side route protection

### Phase 2: IMPORTANT (Fix Next)
1. Settings - WhatsApp section
2. Settings - Social media section
3. Settings - Email templates
4. Dashboard stats integration
5. Media library completion

### Phase 3: POLISH (Fix Last)
1. Dynamic review badge
2. Error boundaries
3. Loading states
4. Type safety improvements
5. Documentation updates

---

## 💡 KEY PRINCIPLES TO REMEMBER

### The Admin Panel is ONLY an Interface

**DO THIS:**
✅ Call backend API endpoints
✅ Display data from backend
✅ Show loading states
✅ Display backend error messages
✅ Provide good UX with forms and validation
✅ Handle token storage and authentication

**DON'T DO THIS:**
❌ Validate data (backend does this)
❌ Hash passwords (backend does this)
❌ Upload files to Cloudinary directly (backend does this via /api/media)
❌ Generate SKUs manually (use /api/products/generate-sku)
❌ Calculate order totals (backend does this)
❌ Send emails (backend does this automatically)
❌ Generate PDFs (backend does this automatically)
❌ Create slugs manually (backend auto-generates)
❌ Manage stock directly (backend handles this)

### Typical Flow for Any Feature

```typescript
// 1. User fills form
const formData = { name: "...", price: 100 }

// 2. Show loading state
setIsLoading(true)

// 3. Call backend API
try {
  const response = await apiClient.post('/api/products', formData)

  // 4. Check success
  if (response.success) {
    toast.success('Product created!')
    router.push('/products')
  }

} catch (error: any) {
  // 5. Show backend error message
  toast.error(error.error || 'Something went wrong')

} finally {
  setIsLoading(false)
}

// Backend handles ALL business logic - we just display the result
```

---

## 📦 BACKEND API BASE URL

```env
NEXT_PUBLIC_API_URL=https://backendglownaturas.onrender.com
```

**Ensure this is set in `.env.local` file**

---

## 🔐 AUTHORIZATION HEADER

Every protected request MUST include:

```typescript
Headers: {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
}

// For file uploads:
Headers: {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'multipart/form-data'
}
```

Token is stored in cookie: `Cookies.get('auth_token')`

---

## 🚀 TESTING CHECKLIST

After implementing fixes, test:

### Authentication
- [ ] Register new account → See success message
- [ ] Check email for OTP code
- [ ] Verify email with OTP → See success
- [ ] Login with email + password → Get OTP email
- [ ] Enter OTP → Successfully login
- [ ] Check "Remember device" → Cookie expires in 30 days
- [ ] Don't check "Remember device" → Cookie is session-only
- [ ] Try accessing dashboard without login → Redirect to login
- [ ] Try accessing login page while logged in → Redirect to dashboard

### Products
- [ ] Create product with images → Success
- [ ] Edit existing product → Changes saved
- [ ] Select category from dropdown → Works
- [ ] Upload multiple images → All uploaded
- [ ] Delete image from product → Removed
- [ ] Set different default image → Updated

### Settings
- [ ] Update store information → Saved
- [ ] Enable WhatsApp button → Saved
- [ ] Add social media links → Saved
- [ ] Edit email template → Saved
- [ ] Preview email template → Shows correctly

### Dashboard
- [ ] View dashboard → Real stats displayed
- [ ] Stats update after creating product → Numbers increase
- [ ] Stats update after new order → Revenue increases

### Media
- [ ] Upload images → Success
- [ ] Delete image → Removed
- [ ] Search images → Results shown
- [ ] Copy URL → Copied to clipboard

---

## 📄 FILES THAT NEED CREATION/MODIFICATION

### Create New Files:
1. `/src/app/(auth)/verify-email/page.tsx`
2. `/src/app/(dashboard)/products/[id]/edit/page.tsx`
3. `/src/app/(dashboard)/settings/email-templates/page.tsx`
4. `/src/app/(dashboard)/settings/email-templates/[type]/page.tsx`
5. `/src/middleware.ts`
6. `.env.example`

### Modify Existing Files:
1. `/src/app/(auth)/register/page.tsx`
2. `/src/app/(auth)/login/page.tsx`
3. `/src/app/(dashboard)/page.tsx` (Dashboard)
4. `/src/app/(dashboard)/products/new/page.tsx`
5. `/src/app/(dashboard)/settings/page.tsx`
6. `/src/app/(dashboard)/media/page.tsx`
7. `/src/presentation/components/layout/AdminSidebar.tsx`
8. `/src/infrastructure/repositories/auth.repository.ts`
9. `/src/infrastructure/config/api.config.ts`

---

## 🎨 UI/UX REQUIREMENTS

- Use existing shadcn/ui components (Button, Input, Select, Dialog, etc.)
- Follow existing design patterns in the codebase
- Ensure mobile responsiveness (works on 320px to 3840px)
- Show loading states during API calls (use Skeleton component)
- Show success/error messages with toast (sonner library)
- Confirm destructive actions (delete) with Dialog
- Use consistent spacing and typography
- Add proper labels and placeholders to all inputs
- Show validation errors below form fields
- Disable submit buttons during loading

---

## ✨ FINAL NOTES

This admin panel is **well-architected** but has **incomplete features**. The backend is already fully built and functional. Your job is to:

1. Complete the UI for missing features
2. Connect UI to existing backend APIs
3. Handle loading/error states properly
4. Provide good UX

**DO NOT:**
- Rewrite the architecture
- Add new libraries (unless absolutely necessary)
- Change the backend API contract
- Implement business logic in the frontend

**DO:**
- Follow existing patterns in the codebase
- Use the repository pattern (apiClient)
- Use TypeScript strictly
- Test each feature after implementing

---

**Backend is the source of truth. Admin panel is just a pretty interface to talk to it. Keep it simple, keep it clean.**
