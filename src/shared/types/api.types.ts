export interface LoginRequest {
  email: string
  password: string
}

export interface ProductImage {
  url: string
  publicId: string
  alt?: string
}

export interface ProductVariant {
  name: string
  value: string
  priceAdjustment?: number
}

export type ProductStatus = 'active' | 'inactive' | 'draft'
export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded'
export type ReviewStatus = 'pending' | 'approved' | 'rejected'

