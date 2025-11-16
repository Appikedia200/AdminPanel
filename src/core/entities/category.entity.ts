import type { Category } from '@/shared/types/entity.types'

export type { Category }

export class CategoryEntity implements Category {
  _id: string
  name: string
  slug: string
  description?: string
  image?: string
  parent?: string
  displayOrder: number
  productCount: number
  createdAt: string
  updatedAt: string

  constructor(data: Category) {
    this._id = data._id
    this.name = data.name
    this.slug = data.slug
    this.description = data.description
    this.image = data.image
    this.parent = typeof data.parent === 'string' ? data.parent : data.parent?._id
    this.displayOrder = data.displayOrder
    this.productCount = data.productCount
    this.createdAt = data.createdAt
    this.updatedAt = data.updatedAt
  }

  isTopLevel(): boolean {
    return !this.parent
  }
}

