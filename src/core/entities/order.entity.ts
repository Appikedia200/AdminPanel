import type { Order } from '@/shared/types/entity.types'

export type { Order }

export class OrderEntity implements Order {
  _id: string
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
  items: Array<{
    product: string
    name: string
    sku: string
    price: number
    quantity: number
    total: number
    image?: string
  }>
  subtotal: number
  discount: number
  tax: number
  shippingCost: number
  total: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded'
  paymentMethod: string
  notes?: string
  trackingNumber?: string
  createdAt: string
  updatedAt: string

  constructor(data: Order) {
    this._id = data._id
    this.orderNumber = data.orderNumber
    this.customer = data.customer
    this.items = data.items.map((item) => ({
      ...item,
      product: typeof item.product === 'string' ? item.product : item.product._id,
    }))
    this.subtotal = data.subtotal
    this.discount = data.discount
    this.tax = data.tax
    this.shippingCost = data.shippingCost
    this.total = data.total
    this.status = data.status
    this.paymentStatus = data.paymentStatus
    this.paymentMethod = data.paymentMethod
    this.notes = data.notes
    this.trackingNumber = data.trackingNumber
    this.createdAt = data.createdAt
    this.updatedAt = data.updatedAt
  }

  isPending(): boolean {
    return this.status === 'pending'
  }

  isProcessing(): boolean {
    return this.status === 'processing'
  }

  isShipped(): boolean {
    return this.status === 'shipped'
  }

  isDelivered(): boolean {
    return this.status === 'delivered'
  }

  isCancelled(): boolean {
    return this.status === 'cancelled'
  }

  isPaid(): boolean {
    return this.paymentStatus === 'paid'
  }
}

