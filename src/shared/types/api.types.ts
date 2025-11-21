export interface LoginRequest {
  email: string
  password: string
}

// Product status values aligned with backend
export type ProductStatus = 'active' | 'inactive' | 'draft'

// Order statuses
export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded'

// Payment statuses
export type PaymentStatus = 'pending' | 'paid' | 'refunded'

// Review statuses
export type ReviewStatus = 'pending' | 'approved' | 'rejected'

