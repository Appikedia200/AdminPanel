import type { Product } from '@/shared/types/entity.types'

export type { Product }

import type { ProductImageReference } from '@/shared/types/entity.types'

export class ProductEntity implements Product {
  _id: string
  name: string
  slug: string
  description: string
  shortDescription?: string
  sku: string
  price: number
  comparePrice?: number
  stock: number
  reservedStock?: number
  trackInventory: boolean
  category: string
  images: ProductImageReference[]
  featured: boolean
  status: 'active' | 'inactive' | 'draft'
  keywords?: string[]
  ingredients?: string[]
  concerns?: string[]
  skinType?: string[]
  brand?: string
  seo?: {
    metaTitle: string
    metaDescription: string
    keywords: string[]
  }
  viewCount?: number
  totalOrders?: number
  averageRating?: number
  totalReviews?: number
  createdAt: string
  updatedAt: string

  constructor(data: Product) {
    this._id = data._id
    this.name = data.name
    this.slug = data.slug
    this.description = data.description
    this.shortDescription = data.shortDescription
    this.sku = data.sku
    this.price = data.price
    this.comparePrice = data.comparePrice
    this.stock = data.stock
    this.reservedStock = data.reservedStock
    this.trackInventory = data.trackInventory
    this.category = typeof data.category === 'string' ? data.category : data.category._id
    this.images = data.images
    this.featured = data.featured
    this.status = data.status
    this.keywords = data.keywords
    this.ingredients = data.ingredients
    this.concerns = data.concerns
    this.skinType = data.skinType
    this.brand = data.brand
    this.seo = data.seo
    this.viewCount = data.viewCount
    this.totalOrders = data.totalOrders
    this.averageRating = data.averageRating
    this.totalReviews = data.totalReviews
    this.createdAt = data.createdAt
    this.updatedAt = data.updatedAt
  }

  isLowStock(): boolean {
    return this.stock <= 10 // Default threshold
  }

  isOnSale(): boolean {
    return this.comparePrice !== undefined && this.comparePrice > this.price
  }

  getDiscountPercentage(): number {
    if (!this.isOnSale() || !this.comparePrice) return 0
    return Math.round(((this.comparePrice - this.price) / this.comparePrice) * 100)
  }

  getActivePrice(): number {
    return this.price
  }
}

