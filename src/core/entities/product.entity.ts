import type { Product } from '@/shared/types/entity.types'

export type { Product }

export class ProductEntity implements Product {
  _id: string
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
  category: string
  images: Array<{ url: string; publicId: string; alt?: string }>
  featured: boolean
  status: 'active' | 'inactive' | 'draft'
  tags?: string[]
  metaTitle?: string
  metaDescription?: string
  weight?: number
  dimensions?: { length?: number; width?: number; height?: number }
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
    this.salePrice = data.salePrice
    this.costPrice = data.costPrice
    this.stock = data.stock
    this.lowStockThreshold = data.lowStockThreshold
    this.category = typeof data.category === 'string' ? data.category : data.category._id
    this.images = data.images
    this.featured = data.featured
    this.status = data.status
    this.tags = data.tags
    this.metaTitle = data.metaTitle
    this.metaDescription = data.metaDescription
    this.weight = data.weight
    this.dimensions = data.dimensions
    this.createdAt = data.createdAt
    this.updatedAt = data.updatedAt
  }

  isLowStock(): boolean {
    return this.stock <= this.lowStockThreshold
  }

  isOnSale(): boolean {
    return this.salePrice !== undefined && this.salePrice < this.price
  }

  getDiscountPercentage(): number {
    if (!this.isOnSale() || !this.salePrice) return 0
    return Math.round(((this.price - this.salePrice) / this.price) * 100)
  }

  getActivePrice(): number {
    return this.salePrice || this.price
  }
}

