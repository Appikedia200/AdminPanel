# ✅ AdminPanel Fix Progress Checklist

## 🚨 CRITICAL REQUIREMENT: NO FAKE DATA

**BEFORE STARTING - ENSURE:**
- [ ] ❌ Remove ALL hardcoded/fake data
- [ ] ✅ Fetch ALL data from backend APIs
- [ ] ✅ Implement empty states for all pages
- [ ] ✅ Show "Add First Item" CTAs when data is empty
- [ ] ✅ Real-time counting (backend returns 0 on fresh install, increases as admin adds data)

**Fresh Install Must Show:**
- Dashboard: 0 products, 0 orders, ₦0 revenue (from API)
- Products: Empty state with "Add Your First Product" button
- Orders: Empty state
- Reviews: Empty state
- Media: Empty state

**After Adding 1 Product:**
- Dashboard: 1 product (from API)
- Products: Table with 1 product
- Empty states disappear, data tables appear

---

## 🔴 PHASE 1: CRITICAL FIXES (Must Complete First)

### Authentication System
- [ ] **Registration Flow**
  - [ ] Show success message after registration
  - [ ] Create `/src/app/(auth)/verify-email/page.tsx` page
  - [ ] Add OTP input field
  - [ ] Call `/api/auth/verify-email` endpoint
  - [ ] Show success message and redirect to login

- [ ] **OTP Login System**
  - [ ] Modify `/src/app/(auth)/login/page.tsx`
  - [ ] Step 1: Email + Password → Send OTP to email
  - [ ] Show "OTP sent" message
  - [ ] Step 2: Show OTP input field
  - [ ] Call `/api/auth/verify-otp` endpoint
  - [ ] Receive JWT token and store in cookie

- [ ] **Remember Device (30 Days)**
  - [ ] Add "Remember this device for 30 days" checkbox
  - [ ] Generate device ID
  - [ ] Set cookie expiry to 30 days when checked
  - [ ] Set session cookie when unchecked
  - [ ] Send device ID to backend on future logins

- [ ] **Server-Side Route Protection**
  - [ ] Create `/src/middleware.ts`
  - [ ] Check auth token on protected routes
  - [ ] Redirect to login if no token
  - [ ] Redirect to dashboard if logged in user accesses auth pages

### Product Management
- [ ] **Image Upload on Product Creation**
  - [ ] Add file input to `/src/app/(dashboard)/products/new/page.tsx`
  - [ ] Handle multiple file selection
  - [ ] Upload each file to `/api/media` endpoint
  - [ ] Get Cloudinary URL from response
  - [ ] Show image previews with delete button
  - [ ] Set first image as default
  - [ ] Include images array in product creation

- [ ] **Product Edit Page**
  - [ ] Create `/src/app/(dashboard)/products/[id]/edit/page.tsx`
  - [ ] Fetch existing product data
  - [ ] Pre-fill form with product data
  - [ ] Show existing images
  - [ ] Allow adding new images
  - [ ] Allow removing existing images
  - [ ] Submit PUT request to `/api/products/:id`

- [ ] **Category Dropdown**
  - [ ] Fetch categories from `/api/categories`
  - [ ] Replace text input with Select component
  - [ ] Show category names in dropdown
  - [ ] Send category ObjectId on form submit
  - [ ] Add to both create and edit pages

---

## ⚠️ PHASE 2: IMPORTANT FIXES

### Settings Module
- [ ] **Store Information (Verify)**
  - [ ] Ensure all fields exist in `/src/app/(dashboard)/settings/page.tsx`
  - [ ] Fields: name, email, phone, address, city, state, postalCode, country
  - [ ] Test save functionality

- [ ] **WhatsApp Settings (Add)**
  - [ ] Add WhatsApp section to settings page
  - [ ] Toggle switch for enabled/disabled
  - [ ] Input for phone number (with country code)
  - [ ] Textarea for default message
  - [ ] Save to `/api/settings` endpoint

- [ ] **Social Media Links (Add)**
  - [ ] Add social media section to settings page
  - [ ] Input for Facebook URL
  - [ ] Input for Instagram URL
  - [ ] Input for Twitter URL
  - [ ] Input for TikTok URL
  - [ ] Save to `/api/settings` endpoint

- [ ] **Email Templates (Add)**
  - [ ] Create `/src/app/(dashboard)/settings/email-templates/page.tsx`
  - [ ] List all 7 email template types
  - [ ] Show template names and descriptions
  - [ ] Add "Edit" button for each template
  - [ ] Create `/src/app/(dashboard)/settings/email-templates/[type]/page.tsx`
  - [ ] Fetch template by type
  - [ ] Show subject input field
  - [ ] Show HTML content textarea/editor
  - [ ] Show available variables helper
  - [ ] Add preview functionality
  - [ ] Save to `/api/email-templates/:id` endpoint
  - [ ] Add navigation link in sidebar/settings menu

### Dashboard
- [ ] **Stats Integration**
  - [ ] Call `/api/dashboard/stats` in `/src/app/(dashboard)/page.tsx`
  - [ ] Display products total, active, low stock
  - [ ] Display orders total, pending, revenue
  - [ ] Display reviews total, pending, average rating
  - [ ] Display customers total, new
  - [ ] Add loading skeleton
  - [ ] Handle errors gracefully

### Media Library
- [ ] **Complete Media Page**
  - [ ] Add upload button to `/src/app/(dashboard)/media/page.tsx`
  - [ ] Multiple file upload
  - [ ] Grid view of uploaded images
  - [ ] Pagination (50 per page)
  - [ ] Search functionality
  - [ ] Delete image button with confirmation
  - [ ] Edit metadata (title, alt text, tags)
  - [ ] Copy Cloudinary URL button
  - [ ] Lightbox for full-size view

### Empty States (ALL PAGES)
- [ ] **Products Page Empty State**
  - [ ] Check if products array is empty
  - [ ] Show Package icon (h-16 w-16)
  - [ ] Show "No products yet" heading
  - [ ] Show helpful description
  - [ ] Add "Add Your First Product" button
  - [ ] Remove any hardcoded/fake products

- [ ] **Categories Page Empty State**
  - [ ] Check if categories array is empty
  - [ ] Show FolderOpen icon
  - [ ] Show "No categories yet" heading
  - [ ] Add "Create Your First Category" button
  - [ ] Remove any hardcoded/fake categories

- [ ] **Orders Page Empty State**
  - [ ] Check if orders array is empty
  - [ ] Show ShoppingCart icon
  - [ ] Show "No orders yet" heading
  - [ ] Add helpful description about customer orders
  - [ ] Add secondary action buttons (View Products, Configure Settings)
  - [ ] Remove any hardcoded/fake orders

- [ ] **Reviews Page Empty State**
  - [ ] Check if reviews array is empty
  - [ ] Show Star icon
  - [ ] Show "No reviews yet" heading
  - [ ] Add helpful description
  - [ ] Add "View Products" button
  - [ ] Remove any hardcoded/fake reviews

- [ ] **Media Page Empty State**
  - [ ] Check if media array is empty
  - [ ] Show ImageIcon
  - [ ] Show "No images uploaded yet" heading
  - [ ] Add "Upload Your First Image" button
  - [ ] Remove any hardcoded/fake media

- [ ] **Dashboard Empty State**
  - [ ] Show empty state card when products.total === 0
  - [ ] Add "Add Your First Product" CTA
  - [ ] Always show Quick Actions section

---

## 🟡 PHASE 3: POLISH FIXES

### Reviews
- [ ] **Dynamic Badge Count**
  - [ ] Fetch pending reviews count in `/src/presentation/components/layout/AdminSidebar.tsx`
  - [ ] Update badge number dynamically
  - [ ] Refresh count after admin actions

### Code Quality
- [ ] **Type Safety**
  - [ ] Remove `any` types from settings page
  - [ ] Create proper TypeScript interfaces
  - [ ] Ensure strict type checking

- [ ] **Error Handling**
  - [ ] Create React Error Boundary component
  - [ ] Wrap app layout with Error Boundary
  - [ ] Add fallback UI for errors

- [ ] **Loading States**
  - [ ] Add top loading bar for route transitions
  - [ ] Add loading states for all async operations
  - [ ] Use Skeleton components

- [ ] **Documentation**
  - [ ] Create `.env.example` file
  - [ ] Fix API URL inconsistencies in README
  - [ ] Update deployment docs if needed

---

## 📋 API ENDPOINTS REFERENCE (Quick Check)

### Authentication
- `POST /api/auth/register` - Register new admin
- `POST /api/auth/verify-email` - Verify email with OTP
- `POST /api/auth/login` - Login (sends OTP to email)
- `POST /api/auth/verify-otp` - Verify OTP and get token
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout

### Products
- `GET /api/products` - List products
- `GET /api/products/:id` - Get product
- `POST /api/products` - Create product (requires auth)
- `PUT /api/products/:id` - Update product (requires auth)
- `DELETE /api/products/:id` - Delete product (requires auth)
- `POST /api/products/generate-sku` - Generate SKU

### Categories
- `GET /api/categories` - List categories
- `POST /api/categories` - Create category (requires auth)
- `PUT /api/categories/:id` - Update category (requires auth)
- `DELETE /api/categories/:id` - Delete category (requires auth)

### Media
- `GET /api/media` - List media
- `POST /api/media` - Upload image (multipart/form-data, requires auth)
- `PUT /api/media/:id` - Update metadata (requires auth)
- `DELETE /api/media/:id` - Delete image (requires auth)

### Settings
- `GET /api/settings` - Get settings
- `PUT /api/settings` - Update settings (requires auth)

### Email Templates
- `GET /api/email-templates` - List all templates
- `GET /api/email-templates/:type` - Get template by type
- `PUT /api/email-templates/:id` - Update template (requires auth)

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics (requires auth)

---

## 🧪 TESTING AFTER EACH FIX

### Test Authentication
```bash
1. Register new account → Should see success message
2. Check email for OTP → Should receive email
3. Enter OTP on verify page → Should verify successfully
4. Login with email/password → Should send OTP email
5. Enter OTP → Should login successfully
6. Check cookie expiry → 30 days if "remember" checked
```

### Test Product Creation
```bash
1. Click "New Product" button
2. Upload 3 images → Should upload to Cloudinary
3. Select category from dropdown → Should show all categories
4. Fill in all fields
5. Submit form → Should create product successfully
6. View product in list → Should show with images
```

### Test Product Edit
```bash
1. Click "Edit" on existing product
2. Should pre-fill with existing data
3. Change price and add new image
4. Submit → Should update successfully
```

### Test Settings
```bash
1. Update store information → Save successfully
2. Enable WhatsApp button → Save successfully
3. Add social media links → Save successfully
4. Edit email template → Preview and save successfully
```

### Test Dashboard
```bash
1. View dashboard → Should show real numbers, not "0"
2. Create new product → Products count should increase
3. Refresh page → Stats should persist
```

---

## 🚨 CRITICAL REMINDERS

1. **Admin panel is ONLY an interface** - All business logic is in backend
2. **Always include Authorization header** for protected endpoints
3. **Upload images to /api/media first** before creating products
4. **Backend returns Cloudinary URLs** - Just display them, don't upload directly to Cloudinary
5. **Show backend error messages** to users - Don't create custom errors
6. **Test each feature** immediately after implementing

---

## 📊 PROGRESS TRACKING

- **Phase 1 Completion:** ___% (___/11 tasks)
- **Phase 2 Completion:** ___% (___/9 tasks)
- **Phase 3 Completion:** ___% (___/4 tasks)
- **Overall Completion:** ___% (___/24 tasks)

---

**Update this checklist as you complete each item. Good luck! 🚀**
