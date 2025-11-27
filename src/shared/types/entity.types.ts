import type { ProductStatus, OrderStatus, PaymentStatus, ReviewStatus } from './api.types'

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

export interface ProductImageReference {
  mediaId: string | Media // Can be populated by backend
  isPrimary: boolean
  order: number
  _id?: string
}

export interface Product extends BaseEntity {
  name: string
  slug: string
  description: string // Full description - flat field
  shortDescription?: string // Short description - flat field
  sku: string
  price: number
  comparePrice?: number // Original price for comparison (not salePrice)
  stock: number
  reservedStock?: number
  trackInventory: boolean
  category: string | Category
  images: ProductImageReference[] // Media references, not raw URLs
  featured: boolean
  status: ProductStatus // 'active' | 'inactive' | 'draft'
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
  jewelry?: JewelryDetails
}

export interface Category extends BaseEntity {
  name: string
  slug: string
  description?: string
  image?: string
  displayOrder: number
  active: boolean // Use this field for active/inactive status
  productCount?: number
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
  active: boolean // Use this field for active/inactive status
  emailVerified: boolean
  lastLogin?: Date
}

export interface Media extends BaseEntity {
  filename: string
  originalName: string
  cloudinaryUrl: string // Full URL to display
  cloudinaryPublicId: string
  fileSize: number
  mimeType: string
  width?: number
  height?: number
  altText?: string
  title?: string
  uploadedBy: string
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

export type HomepageSectionType = 
  | 'featured' 
  | 'new_arrivals' 
  | 'back_in_stock' 
  | 'best_sellers'

export interface HomepageSection extends BaseEntity {
  type: HomepageSectionType  // Virtual field (frontend-friendly)
  sectionType: HomepageSectionType  // Original backend field
  title: string
  subtitle?: string
  products: (string | Product)[]  // Can be IDs or populated products
  maxProducts: number
  displayOrder: number
  active: boolean  // Virtual field (frontend-friendly)
  isActive: boolean  // Original backend field
  autoUpdate: boolean
}

