import type { ProductImage, ProductStatus, OrderStatus, PaymentStatus, ReviewStatus } from './api.types'

export interface BaseEntity {
  _id: string
  createdAt: string
  updatedAt: string
}

// Jewelry-specific interfaces
export type JewelryMaterial = 
  | 'gold' 
  | 'silver' 
  | 'platinum' 
  | 'white-gold' 
  | 'rose-gold' 
  | 'titanium' 
  | 'stainless-steel' 
  | 'brass' 
  | 'copper'

export type JewelryPurity = 
  | '24k' 
  | '22k' 
  | '18k' 
  | '14k' 
  | '10k' 
  | '925-sterling' 
  | '999-fine' 
  | '958-britannia' 
  | 'other'

export type StoneType = 
  | 'diamond' 
  | 'ruby' 
  | 'sapphire' 
  | 'emerald' 
  | 'pearl' 
  | 'amethyst' 
  | 'topaz' 
  | 'garnet' 
  | 'opal' 
  | 'turquoise' 
  | 'cubic-zirconia' 
  | 'moissanite' 
  | 'none'

export type StoneClarity = 
  | 'FL' 
  | 'IF' 
  | 'VVS1' 
  | 'VVS2' 
  | 'VS1' 
  | 'VS2' 
  | 'SI1' 
  | 'SI2' 
  | 'I1' 
  | 'I2' 
  | 'I3' 
  | 'N/A'

export type StoneColor = 
  | 'D' 
  | 'E' 
  | 'F' 
  | 'G' 
  | 'H' 
  | 'I' 
  | 'J' 
  | 'K' 
  | 'L' 
  | 'M' 
  | 'N' 
  | 'fancy' 
  | 'N/A'

export type StoneCut = 
  | 'excellent' 
  | 'very-good' 
  | 'good' 
  | 'fair' 
  | 'poor' 
  | 'N/A'

export type JewelryType = 
  | 'ring' 
  | 'necklace' 
  | 'bracelet' 
  | 'earrings' 
  | 'pendant' 
  | 'chain' 
  | 'bangle' 
  | 'anklet' 
  | 'brooch' 
  | 'cufflinks' 
  | 'nose-ring' 
  | 'toe-ring'

export type JewelryGender = 'men' | 'women' | 'unisex' | 'kids'

export type MetalWeightUnit = 'grams' | 'ounces' | 'carats'

export type SizeType = 'ring-size' | 'length' | 'diameter' | 'adjustable' | 'one-size'

export type SizeUnit = 'US' | 'UK' | 'EU' | 'mm' | 'cm' | 'inches'

export interface JewelryDetails {
  material?: JewelryMaterial
  purity?: JewelryPurity
  metalWeight?: {
    value: number
    unit: MetalWeightUnit
  }
  stone?: {
    type: StoneType
    caratWeight?: number
    clarity?: StoneClarity
    color?: StoneColor
    cut?: StoneCut
  }
  size?: {
    type: SizeType
    value: string
    unit: SizeUnit
  }
  certification?: {
    available: boolean
    issuedBy?: string
    certificateNumber?: string
  }
  gender?: JewelryGender
  type?: JewelryType
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
  jewelry?: JewelryDetails
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

