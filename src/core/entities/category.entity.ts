import type { Category } from '@/shared/types/entity.types'

export type { Category }

export class CategoryEntity implements Category {
  _id: string
  name: string
  slug: string
  description?: string
  image?: string
  displayOrder: number
  active: boolean
  productCount?: number
  createdAt: string
  updatedAt: string

  constructor(data: Category) {
    this._id = data._id
    this.name = data.name
    this.slug = data.slug
    this.description = data.description
    this.image = data.image
    this.displayOrder = data.displayOrder
    this.active = data.active
    this.productCount = data.productCount
    this.createdAt = data.createdAt
    this.updatedAt = data.updatedAt
  }

  isActive(): boolean {
    return this.active
  }
}

