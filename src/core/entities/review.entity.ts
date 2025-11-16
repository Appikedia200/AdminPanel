import type { Review } from '@/shared/types/entity.types'

export type { Review }

export class ReviewEntity implements Review {
  _id: string
  product: string
  user: { name: string; email: string }
  rating: number
  title?: string
  comment: string
  status: 'pending' | 'approved' | 'rejected'
  helpful: number
  verified: boolean
  createdAt: string
  updatedAt: string

  constructor(data: Review) {
    this._id = data._id
    this.product = typeof data.product === 'string' ? data.product : data.product._id
    this.user = data.user
    this.rating = data.rating
    this.title = data.title
    this.comment = data.comment
    this.status = data.status
    this.helpful = data.helpful
    this.verified = data.verified
    this.createdAt = data.createdAt
    this.updatedAt = data.updatedAt
  }

  isPending(): boolean {
    return this.status === 'pending'
  }

  isApproved(): boolean {
    return this.status === 'approved'
  }

  isRejected(): boolean {
    return this.status === 'rejected'
  }
}

