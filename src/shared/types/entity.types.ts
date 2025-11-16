import type { ProductImage, ProductStatus, OrderStatus, PaymentStatus, ReviewStatus } from './api.types'

export interface BaseEntity {
  _id: string
  createdAt: string
  updatedAt: string
}

export interface Product extends BaseEntity {
  name: string
  slug: string
  description: string
  shortDescription?: string
  sku: string
  price: number
  salePrice?: number
  costPrice?: number
  stock: number
  lowStockThreshold: number
  category: string | Category
  images: ProductImage[]
  featured: boolean
  status: ProductStatus
  tags?: string[]
  metaTitle?: string
  metaDescription?: string
  weight?: number
  dimensions?: {
    length?: number
    width?: number
    height?: number
  }
}

export interface Category extends BaseEntity {
  name: string
  slug: string
  description?: string
  image?: string
  parent?: string | Category
  displayOrder: number
  productCount: number
}

export interface Review extends BaseEntity {
  product: string | Product
  user: {
    name: string
    email: string
  }
  rating: number
  title?: string
  comment: string
  status: ReviewStatus
  helpful: number
  verified: boolean
}

export interface Order extends BaseEntity {
  orderNumber: string
  customer: {
    name: string
    email: string
    phone: string
    address: {
      street: string
      city: string
      state: string
      country: string
      postalCode?: string
    }
  }
  items: OrderItem[]
  subtotal: number
  discount: number
  tax: number
  shippingCost: number
  total: number
  status: OrderStatus
  paymentStatus: PaymentStatus
  paymentMethod: string
  notes?: string
  trackingNumber?: string
}

export interface OrderItem {
  product: string | Product
  name: string
  sku: string
  price: number
  quantity: number
  total: number
  image?: string
}

export interface Admin extends BaseEntity {
  name: string
  email: string
  role: 'admin' | 'superadmin'
  avatar?: string
  isActive: boolean
}

export interface Media extends BaseEntity {
  url: string
  publicId: string
  filename: string
  mimetype: string
  size: number
  width?: number
  height?: number
  alt?: string
  usedIn: string[]
}

export interface Settings {
  store: {
    name: string
    email: string
    phone: string
    address: string
    logo?: string
    favicon?: string
  }
  email: {
    orderConfirmation: boolean
    orderStatusUpdate: boolean
    lowStockAlert: boolean
  }
  social: {
    facebook?: string
    instagram?: string
    twitter?: string
    whatsapp?: string
  }
}

