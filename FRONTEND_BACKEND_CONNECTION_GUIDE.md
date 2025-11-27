# 🔗 Frontend-Backend Connection Guide

**Date**: November 26, 2025  
**Purpose**: Connect Main Frontend to Admin Panel & Backend

---

## 🎯 **WHAT YOU NEED FROM VERCEL**

When you deploy the **Admin Panel** to Vercel, you'll get:

### **1. Admin Panel URL** (from Vercel)
```
https://your-admin-panel.vercel.app
```

**What it's for**:
- Accessing the admin dashboard
- Managing products, orders, reviews
- Analytics and reports
- Internal team use only

---

## 🏗️ **ARCHITECTURE OVERVIEW**

```
┌─────────────────────────────────────────────────────────┐
│                    YOUR E-COMMERCE SYSTEM                │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  ┌─────────────────┐      ┌──────────────────┐          │
│  │  MAIN FRONTEND  │      │   ADMIN PANEL    │          │
│  │  (Customer Site)│      │  (Internal Use)  │          │
│  │                 │      │                  │          │
│  │  - Shop         │      │  - Dashboard     │          │
│  │  - Products     │      │  - Products Mgmt │          │
│  │  - Cart         │      │  - Orders Mgmt   │          │
│  │  - Checkout     │      │  - Analytics     │          │
│  │  - Account      │      │  - Settings      │          │
│  └────────┬────────┘      └────────┬─────────┘          │
│           │                        │                     │
│           └────────────┬───────────┘                     │
│                        │                                 │
│                        ▼                                 │
│           ┌────────────────────────┐                     │
│           │   BACKEND API          │                     │
│           │  (Render.com/Vercel)   │                     │
│           │                        │                     │
│           │  - REST API            │                     │
│           │  - MongoDB Database    │                     │
│           │  - Authentication      │                     │
│           │  - Business Logic      │                     │
│           └────────────────────────┘                     │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

---

## 📝 **WHAT THE FRONTEND NEEDS**

### **Environment Variables for Main Frontend**

Create `.env.local` in your main frontend project:

```bash
# Backend API URL (same as admin panel uses)
NEXT_PUBLIC_API_URL=https://backendglownaturas.onrender.com

# Frontend URL (your own Vercel deployment)
NEXT_PUBLIC_FRONTEND_URL=https://your-store.vercel.app

# Optional: Admin Panel URL (if frontend needs to link to admin)
NEXT_PUBLIC_ADMIN_URL=https://your-admin-panel.vercel.app

# Cloudinary (for displaying product images)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloudinary_name

# Payment Gateway (when you add payments)
# NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_xxxxx
# NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY=FLWPUBK_TEST-xxxxx

# Google Analytics (optional)
# NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

---

## 🔌 **API ENDPOINTS THE FRONTEND WILL USE**

Your main frontend will call these **backend API endpoints**:

### **Public Endpoints** (No authentication needed):

#### **Products**:
```bash
GET /api/products                    # List all products
GET /api/products/:id                # Get single product
GET /api/products?category=skincare  # Filter by category
GET /api/products?search=serum       # Search products
```

#### **Categories**:
```bash
GET /api/categories                  # List all categories
GET /api/categories/:id              # Get category with products
```

#### **Reviews**:
```bash
GET /api/reviews?product=:id         # Get product reviews
POST /api/reviews                    # Submit review (customer)
```

#### **Homepage Sections**:
```bash
GET /api/homepage-sections           # Get featured, trending, etc.
GET /api/homepage-sections/featured  # Get featured products
GET /api/homepage-sections/trending  # Get trending products
```

### **Customer Authentication**:
```bash
POST /api/auth/customer/register     # Customer signup
POST /api/auth/customer/login        # Customer login
POST /api/auth/customer/forgot-password
POST /api/auth/customer/reset-password
GET /api/auth/customer/me            # Get customer profile
```

### **Orders** (Customer authenticated):
```bash
POST /api/orders                     # Create order (checkout)
GET /api/orders                      # Customer's orders
GET /api/orders/:id                  # Order details
```

### **Customer Profile** (Customer authenticated):
```bash
GET /api/customers/profile           # Get profile
PUT /api/customers/profile           # Update profile
PUT /api/customers/password          # Change password
GET /api/customers/orders            # Order history
```

---

## 🚀 **DEPLOYMENT SETUP**

### **Step 1: Deploy Admin Panel to Vercel**

1. **Push to GitHub** (Already done ✅):
   ```bash
   git push origin main
   ```

2. **Connect to Vercel**:
   - Go to https://vercel.com
   - Click "Import Project"
   - Select your admin panel repository
   - Configure:
     - Framework: Next.js
     - Root Directory: `./`
     - Build Command: `npm run build`
     - Output Directory: `.next`

3. **Add Environment Variables** in Vercel:
   ```
   NEXT_PUBLIC_API_URL=https://backendglownaturas.onrender.com
   NEXT_PUBLIC_APP_URL=https://your-admin-panel.vercel.app
   ```

4. **Deploy** → Get URL like:
   ```
   https://glownatura-admin.vercel.app
   ```

---

### **Step 2: Create Main Frontend Project**

Create a new Next.js project for your customer-facing store:

```bash
npx create-next-app@latest glownatura-frontend
cd glownatura-frontend
```

**Install Dependencies**:
```bash
npm install axios
npm install @tanstack/react-query
npm install react-hook-form
npm install zod
npm install zustand  # For cart state management
npm install swiper   # For product carousels
npm install date-fns
npm install lucide-react
```

**Create `.env.local`**:
```bash
NEXT_PUBLIC_API_URL=https://backendglownaturas.onrender.com
NEXT_PUBLIC_FRONTEND_URL=http://localhost:3000
```

---

### **Step 3: Frontend File Structure**

```
glownatura-frontend/
├── src/
│   ├── app/
│   │   ├── page.tsx                    # Homepage
│   │   ├── shop/
│   │   │   └── page.tsx                # Shop/Products page
│   │   ├── products/
│   │   │   └── [slug]/
│   │   │       └── page.tsx            # Single product
│   │   ├── cart/
│   │   │   └── page.tsx                # Shopping cart
│   │   ├── checkout/
│   │   │   └── page.tsx                # Checkout
│   │   ├── account/
│   │   │   ├── page.tsx                # Customer dashboard
│   │   │   ├── orders/
│   │   │   └── profile/
│   │   └── about/
│   │       └── page.tsx                # About page
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── Navigation.tsx
│   │   ├── product/
│   │   │   ├── ProductCard.tsx
│   │   │   ├── ProductGrid.tsx
│   │   │   └── ProductDetails.tsx
│   │   ├── cart/
│   │   │   ├── CartItem.tsx
│   │   │   └── CartSummary.tsx
│   │   └── ui/                         # Shared UI components
│   ├── lib/
│   │   ├── api/
│   │   │   ├── client.ts               # Axios instance
│   │   │   ├── products.ts             # Product API calls
│   │   │   ├── categories.ts           # Category API calls
│   │   │   └── orders.ts               # Order API calls
│   │   └── store/
│   │       └── cart.ts                 # Cart state (Zustand)
│   └── types/
│       ├── product.ts
│       ├── category.ts
│       └── order.ts
└── public/
    └── images/
```

---

## 🔧 **API CLIENT SETUP FOR FRONTEND**

### **Create API Client** (`src/lib/api/client.ts`):

```typescript
import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://backendglownaturas.onrender.com'

export const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add auth token if customer is logged in
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('customer_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle errors
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('customer_token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)
```

---

### **Products API** (`src/lib/api/products.ts`):

```typescript
import { apiClient } from './client'

export const productsApi = {
  // Get all products
  getAll: async (params?: {
    page?: number
    limit?: number
    category?: string
    search?: string
  }) => {
    return apiClient.get('/api/products', { params })
  },

  // Get single product
  getBySlug: async (slug: string) => {
    return apiClient.get(`/api/products/${slug}`)
  },

  // Get product reviews
  getReviews: async (productId: string) => {
    return apiClient.get(`/api/reviews?product=${productId}`)
  },
}
```

---

### **Cart Store** (`src/lib/store/cart.ts`):

```typescript
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface CartItem {
  _id: string
  name: string
  price: number
  quantity: number
  image: string
}

interface CartStore {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  total: number
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (item) => {
        set((state) => {
          const existing = state.items.find((i) => i._id === item._id)
          if (existing) {
            return {
              items: state.items.map((i) =>
                i._id === item._id
                  ? { ...i, quantity: i.quantity + 1 }
                  : i
              ),
            }
          }
          return { items: [...state.items, { ...item, quantity: 1 }] }
        })
      },
      
      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((i) => i._id !== id),
        }))
      },
      
      updateQuantity: (id, quantity) => {
        set((state) => ({
          items: state.items.map((i) =>
            i._id === id ? { ...i, quantity } : i
          ),
        }))
      },
      
      clearCart: () => set({ items: [] }),
      
      get total() {
        return get().items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        )
      },
    }),
    { name: 'cart-storage' }
  )
)
```

---

## 📱 **EXAMPLE HOMEPAGE** (`src/app/page.tsx`):

```typescript
'use client'

import { useEffect, useState } from 'react'
import { apiClient } from '@/lib/api/client'
import { ProductCard } from '@/components/product/ProductCard'

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [newArrivals, setNewArrivals] = useState([])
  const [backInStock, setBackInStock] = useState([])
  const [bestSellers, setBestSellers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch homepage sections from backend
        const featured = await apiClient.get('/api/homepage-sections/featured')
        const arrivals = await apiClient.get('/api/homepage-sections/new_arrivals')
        const backStock = await apiClient.get('/api/homepage-sections/back_in_stock')
        const bestsellers = await apiClient.get('/api/homepage-sections/best_sellers')
        
        setFeaturedProducts(featured.data.products || [])
        setNewArrivals(arrivals.data.products || [])
        setBackInStock(backStock.data.products || [])
        setBestSellers(bestsellers.data.products || [])
      } catch (error) {
        console.error('Failed to fetch homepage data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <main>
      {/* Hero Section */}
      <section className="hero">
        <h1>Welcome to GlowNaturas</h1>
        <p>Natural skincare products for your beauty</p>
      </section>

      {/* Featured Products */}
      <section className="featured-products">
        <h2>Featured Items</h2>
        <div className="grid grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </section>

      {/* New Arrivals */}
      <section className="new-arrivals">
        <h2>New Arrivals</h2>
        <div className="grid grid-cols-4 gap-6">
          {newArrivals.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </section>

      {/* Back in Stock */}
      <section className="back-in-stock">
        <h2>Back in Stock</h2>
        <div className="grid grid-cols-4 gap-6">
          {backInStock.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </section>

      {/* Best Sellers */}
      <section className="best-sellers">
        <h2>Best Sellers</h2>
        <div className="grid grid-cols-4 gap-6">
          {bestSellers.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </section>
    </main>
  )
}
```

---

## 🔐 **AUTHENTICATION FLOW**

### **Frontend Authentication** (Separate from Admin):

```typescript
// Customer login
const loginCustomer = async (email: string, password: string) => {
  const response = await apiClient.post('/api/auth/customer/login', {
    email,
    password,
  })
  
  // Save customer token
  localStorage.setItem('customer_token', response.data.token)
  return response.data.customer
}

// Admin login (separate - for admin panel)
const loginAdmin = async (email: string, password: string) => {
  const response = await apiClient.post('/api/auth/login', {
    email,
    password,
  })
  
  // Save admin token
  localStorage.setItem('admin_token', response.data.token)
  return response.data.admin
}
```

---

## 📊 **WHAT YOU GET FROM DEPLOYMENTS**

### **After Deploying Admin Panel**:
```
✅ Admin URL: https://glownatura-admin.vercel.app
   - For internal team use
   - Manage products, orders, analytics
   - Secure admin authentication
```

### **After Deploying Main Frontend**:
```
✅ Store URL: https://glownatura.vercel.app
   - For customers
   - Browse and buy products
   - Customer authentication
```

### **Backend (Already Deployed)**:
```
✅ API URL: https://backendglownaturas.onrender.com
   - Serves both admin and frontend
   - Single source of truth
   - Shared database
```

---

## 🎯 **KEY POINTS**

### **1. Same Backend for Both** ✅
- Admin panel and main frontend **both use the same backend**
- Same database, same API
- Admin manages, customers shop

### **2. Different Authentication** ✅
- **Admin Panel**: `/api/auth/login` (admins only)
- **Main Frontend**: `/api/auth/customer/login` (customers)
- Separate JWT tokens
- Different permissions

### **3. Shared Resources** ✅
- **Products**: Admin creates, customers view/buy
- **Orders**: Admin manages, customers place
- **Reviews**: Customers write, admin moderates
- **Media**: Admin uploads, frontend displays

---

## 📋 **DEPLOYMENT CHECKLIST**

### **Admin Panel** ✅
- [x] Code complete
- [x] Pushed to GitHub
- [ ] Deploy to Vercel
- [ ] Add environment variables
- [ ] Get Vercel URL
- [ ] Test admin login

### **Main Frontend** 🎯
- [ ] Create Next.js project
- [ ] Setup API client
- [ ] Create components
- [ ] Implement pages
- [ ] Test with backend
- [ ] Deploy to Vercel
- [ ] Get Vercel URL

### **Backend** ✅
- [x] Already deployed
- [x] API working
- [x] Database connected

---

## 🚀 **NEXT STEPS**

1. **Deploy Admin Panel to Vercel**:
   - Import from GitHub
   - Add environment variables
   - Deploy
   - Get URL

2. **Start Building Main Frontend**:
   - Create new Next.js project
   - Use same backend API URL
   - Build customer-facing pages
   - Implement shopping cart
   - Add checkout flow

3. **Test Integration**:
   - Admin creates products
   - Frontend displays products
   - Customers can browse and buy
   - Orders appear in admin panel

---

## 🎉 **SUMMARY**

### **What You Need**:
1. ✅ **Backend URL**: `https://backendglownaturas.onrender.com` (Have it)
2. 🎯 **Admin URL**: Deploy to Vercel to get it
3. 🎯 **Frontend URL**: Create & deploy to get it

### **Connection**:
```
Frontend → Backend API ← Admin Panel
```

All three connect to the **same backend**, using the **same database**, creating a **unified e-commerce system**!

---

**Ready to deploy the admin panel to Vercel and get that URL?** 🚀


