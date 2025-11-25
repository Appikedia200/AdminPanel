# Homepage Sections Management - Implementation Ready

**Status:** ⏳ **Waiting for Backend Endpoints**  
**Priority:** Medium (Phase 2)  
**Estimated Time:** 4-6 hours (once backend ready)  
**Dependencies:** Backend v5.3.0+ with homepage sections endpoints

---

## 📋 REQUIREMENTS

According to `ADMIN_PANEL_UPDATES_REQUIRED.md`, the admin panel needs a feature to manage homepage product sections.

### Sections to Support:

1. **Featured Items** (`featured`)
2. **New Arrivals** (`new_arrivals`)
3. **Back in Stock** (`back_in_stock`)
4. **Trending Now** (`trending`)
5. **Best Sellers** (`best_sellers`)

---

## 🔌 REQUIRED BACKEND ENDPOINTS

### These endpoints need to be implemented first:

```typescript
// List all homepage sections
GET /api/homepage-sections
Response: {
  success: true,
  data: [
    {
      _id: string,
      type: 'featured' | 'new_arrivals' | 'back_in_stock' | 'trending' | 'best_sellers',
      title: string,
      subtitle: string,
      products: string[], // Array of product IDs
      maxProducts: number,
      displayOrder: number,
      active: boolean,
      autoUpdate: boolean,
      createdAt: string,
      updatedAt: string
    }
  ]
}

// Get specific section
GET /api/homepage-sections/:type
Response: {
  success: true,
  data: { /* section object */ }
}

// Create new section
POST /api/homepage-sections
Body: {
  type: string,
  title: string,
  subtitle?: string,
  products: string[],
  maxProducts: number,
  displayOrder: number,
  active: boolean,
  autoUpdate?: boolean
}

// Update section
PUT /api/homepage-sections/:type
Body: {
  title?: string,
  subtitle?: string,
  products?: string[],
  maxProducts?: number,
  displayOrder?: number,
  active?: boolean,
  autoUpdate?: boolean
}

// Delete section
DELETE /api/homepage-sections/:type
```

---

## 🎨 UI DESIGN (Ready to Implement)

### Page Structure:

```
┌─────────────────────────────────────────────────────────┐
│ Homepage Sections                        [+ New Section] │
├─────────────────────────────────────────────────────────┤
│                                                          │
│ SECTION: Featured Items                    [Active ✓]   │
│ ┌────────────────────────────────────────────────────┐  │
│ │ Title: Featured Items                               │  │
│ │ Subtitle: Hand-picked products for you              │  │
│ │ Max Products: [8]                                   │  │
│ │ Display Order: [1]                                  │  │
│ │ Auto-Update: [ ] (Check to auto-populate)           │  │
│ └────────────────────────────────────────────────────┘  │
│                                                          │
│ SELECTED PRODUCTS (8/8):                                │
│ ┌───────┬──────────────────────┬────────┬─────────┐    │
│ │ Image │ Product Name         │ Price  │ Actions │    │
│ ├───────┼──────────────────────┼────────┼─────────┤    │
│ │ [img] │ CeraVe Lotion        │ ₦5,000 │ [Remove]│    │
│ │ [img] │ Dr Teal's Body Wash  │ ₦7,000 │ [Remove]│    │
│ │ [img] │ Garnier Lotion       │ ₦4,500 │ [Remove]│    │
│ └───────┴──────────────────────┴────────┴─────────┘    │
│                                                          │
│ [Add Products] [Save Changes]                           │
└─────────────────────────────────────────────────────────┘
```

---

## 💻 IMPLEMENTATION PLAN

### Step 1: Create Page Component

**File:** `src/app/(dashboard)/homepage-sections/page.tsx`

```typescript
'use client'

import { useState } from 'react'
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable'

export default function HomepageSectionsPage() {
  const [sections, setSections] = useState([])
  const [selectedSection, setSelectedSection] = useState(null)
  
  // Drag and drop functionality for reordering products
  // Product search and selection
  // Save/update section functionality
  
  return (
    <div className="space-y-6">
      {/* Section list */}
      {/* Selected section editor */}
      {/* Product selector modal */}
    </div>
  )
}
```

### Step 2: Add to Sidebar Menu

**File:** `src/presentation/components/layout/admin-sidebar/index.tsx`

```typescript
const menuItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/products', label: 'Products', icon: Package },
  { href: '/categories', label: 'Categories', icon: FolderTree },
  { href: '/homepage-sections', label: 'Homepage', icon: Layout }, // NEW
  { href: '/reviews', label: 'Reviews', icon: Star, badgeKey: 'reviews' },
  // ... rest
]
```

### Step 3: Create API Repository

**File:** `src/infrastructure/repositories/homepage-section.repository.impl.ts`

```typescript
import { httpClient } from '@/infrastructure/api/client'
import { API_ENDPOINTS } from '@/infrastructure/config/api.config'

export class HomepageSectionRepositoryImpl {
  async findAll() {
    return httpClient.get(API_ENDPOINTS.homepageSections.list)
  }

  async findByType(type: string) {
    return httpClient.get(API_ENDPOINTS.homepageSections.get(type))
  }

  async create(data: any) {
    return httpClient.post(API_ENDPOINTS.homepageSections.create, data)
  }

  async update(type: string, data: any) {
    return httpClient.put(API_ENDPOINTS.homepageSections.update(type), data)
  }

  async delete(type: string) {
    return httpClient.delete(API_ENDPOINTS.homepageSections.delete(type))
  }
}
```

### Step 4: Update API Config

**File:** `src/infrastructure/config/api.config.ts`

```typescript
export const API_ENDPOINTS = {
  // ... existing endpoints
  
  // Homepage Sections
  homepageSections: {
    list: '/api/homepage-sections',
    get: (type: string) => `/api/homepage-sections/${type}`,
    create: '/api/homepage-sections',
    update: (type: string) => `/api/homepage-sections/${type}`,
    delete: (type: string) => `/api/homepage-sections/${type}`,
  },
}
```

### Step 5: Create Custom Hooks

**File:** `src/presentation/hooks/use-homepage-sections.ts`

```typescript
import { useState, useEffect, useCallback } from 'react'
import { HomepageSectionRepositoryImpl } from '@/infrastructure/repositories/homepage-section.repository.impl'

export function useHomepageSections() {
  const [sections, setSections] = useState([])
  const [loading, setLoading] = useState(true)
  const repository = new HomepageSectionRepositoryImpl()

  const fetchSections = useCallback(async () => {
    setLoading(true)
    try {
      const response = await repository.findAll()
      setSections(response.data || [])
    } catch (error) {
      console.error('Failed to fetch sections:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchSections()
  }, [fetchSections])

  return { sections, loading, refetch: fetchSections }
}
```

### Step 6: Implement Drag & Drop

**Packages Needed:**

```bash
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
```

**Usage:**

```typescript
import { DndContext, closestCenter } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'

function ProductList({ products, onReorder }) {
  const handleDragEnd = (event) => {
    const { active, over } = event
    if (active.id !== over.id) {
      const oldIndex = products.findIndex(p => p._id === active.id)
      const newIndex = products.findIndex(p => p._id === over.id)
      onReorder(arrayMove(products, oldIndex, newIndex))
    }
  }

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={products.map(p => p._id)} strategy={verticalListSortingStrategy}>
        {products.map(product => (
          <SortableProductItem key={product._id} product={product} />
        ))}
      </SortableContext>
    </DndContext>
  )
}
```

---

## ✅ FEATURES TO IMPLEMENT

### Section Management:

- [ ] List all homepage sections
- [ ] Create new section
- [ ] Edit section details (title, subtitle, max products)
- [ ] Delete section
- [ ] Toggle section active/inactive
- [ ] Reorder sections (display order)

### Product Selection:

- [ ] Search products by name/SKU
- [ ] Filter products by category
- [ ] Filter products by status (active only)
- [ ] Exclude out-of-stock products
- [ ] Show product preview (image, name, price, stock)
- [ ] Add product to section
- [ ] Remove product from section
- [ ] Drag & drop to reorder products

### Auto-Update Feature:

- [ ] Toggle auto-update checkbox
- [ ] When enabled, backend automatically populates section
- [ ] Examples:
  - **New Arrivals:** Last 8 products created
  - **Best Sellers:** Top 8 by order count
  - **Trending:** Top 8 by view count

### Validation:

- [ ] Enforce max products limit
- [ ] Prevent duplicate products in same section
- [ ] Validate required fields (title, type)
- [ ] Show warning when section is empty
- [ ] Confirm before deleting section

---

## 🎯 USER STORIES

### As an Admin, I want to:

1. **Manage Featured Products**
   - "I want to select which products appear in the Featured section on homepage"
   - "I want to reorder products by dragging them"

2. **Create Seasonal Sections**
   - "I want to create a 'Summer Specials' section"
   - "I want to add relevant products to it"

3. **Auto-Populate Sections**
   - "I want 'New Arrivals' to automatically show latest products"
   - "I don't want to manually update it every day"

4. **Control Section Visibility**
   - "I want to temporarily hide a section without deleting it"
   - "I want to reactivate it later"

---

## 🧪 TESTING PLAN

### Manual Testing:

1. **Create Section**
   - Click "New Section" button
   - Fill in title, subtitle, max products
   - Select section type
   - Save and verify it appears in list

2. **Add Products**
   - Open section editor
   - Click "Add Products"
   - Search for products
   - Select products
   - Verify they appear in section

3. **Reorder Products**
   - Drag product to new position
   - Drop it
   - Save changes
   - Refresh page
   - Verify new order persists

4. **Remove Products**
   - Click "Remove" button on product
   - Confirm removal
   - Verify product removed from section

5. **Toggle Active Status**
   - Click active/inactive toggle
   - Save changes
   - Verify section shows/hides on homepage

6. **Auto-Update**
   - Enable auto-update for "New Arrivals"
   - Create new product
   - Verify it appears in "New Arrivals" automatically

### Integration Testing:

- Test with backend API once endpoints are ready
- Verify correct request/response format
- Test error handling for failed requests
- Test concurrent editing by multiple admins

---

## 📦 REQUIRED PACKAGES

```bash
# Drag and drop functionality
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities

# Already installed (existing)
- @radix-ui/react-tooltip ✅
- shadcn/ui components ✅
- React hooks ✅
```

---

## 🚀 DEPLOYMENT CHECKLIST

- [ ] Backend endpoints implemented and tested
- [ ] API documentation updated
- [ ] Frontend page created
- [ ] Sidebar menu item added
- [ ] Drag & drop implemented
- [ ] Product search/filter working
- [ ] Save/update functionality working
- [ ] Error handling implemented
- [ ] Loading states added
- [ ] Mobile responsiveness verified
- [ ] TypeScript types defined
- [ ] Linting passed
- [ ] Build successful
- [ ] Manual testing completed
- [ ] Documentation updated

---

## 🔗 RELATED DOCUMENTS

- [Backend Requirements](./ADMIN_PANEL_UPDATES_REQUIRED.md)
- [Backend Implementation](./BACKEND_UPDATES_IMPLEMENTED.md)
- [Backend Repository](https://github.com/Appikedia200/Backendglownaturas.git)

---

## 📝 NOTES FOR BACKEND TEAM

### Database Schema Suggestion:

```javascript
const HomepageSectionSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    unique: true,
    enum: ['featured', 'new_arrivals', 'back_in_stock', 'trending', 'best_sellers']
  },
  title: {
    type: String,
    required: true
  },
  subtitle: String,
  products: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],
  maxProducts: {
    type: Number,
    default: 8
  },
  displayOrder: {
    type: Number,
    default: 0
  },
  active: {
    type: Boolean,
    default: true
  },
  autoUpdate: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
})
```

### Auto-Update Logic Suggestion:

```javascript
// For 'new_arrivals' section
if (section.autoUpdate && section.type === 'new_arrivals') {
  section.products = await Product.find({ status: 'active', stock: { $gt: 0 } })
    .sort({ createdAt: -1 })
    .limit(section.maxProducts)
    .select('_id')
}

// For 'best_sellers' section
if (section.autoUpdate && section.type === 'best_sellers') {
  section.products = await Product.find({ status: 'active', stock: { $gt: 0 } })
    .sort({ totalOrders: -1 })
    .limit(section.maxProducts)
    .select('_id')
}

// For 'trending' section
if (section.autoUpdate && section.type === 'trending') {
  section.products = await Product.find({ status: 'active', stock: { $gt: 0 } })
    .sort({ viewCount: -1 })
    .limit(section.maxProducts)
    .select('_id')
}
```

---

**Status:** Ready to implement immediately once backend endpoints are available! 🚀

**Contact:** Tag backend team when endpoints are ready, and this can be implemented in 4-6 hours.

