export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'GlowNatura Admin'
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001'
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://backendglownaturas.onrender.com'

export const AUTH_TOKEN_KEY = 'auth_token'

export const PAGINATION_DEFAULTS = {
  PAGE: 1,
  LIMIT: 10,
}

export const PRODUCT_DEFAULTS = {
  LOW_STOCK_THRESHOLD: 10,
}

export const IMAGE_UPLOAD_LIMITS = {
  MAX_SIZE: 5 * 1024 * 1024,
  MAX_FILES: 10,
  ACCEPTED_FORMATS: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
}

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  DASHBOARD: '/',
  PRODUCTS: '/products',
  PRODUCTS_NEW: '/products/new',
  PRODUCTS_EDIT: (id: string) => `/products/${id}/edit`,
  PRODUCTS_LOW_STOCK: '/products/low-stock',
  CATEGORIES: '/categories',
  REVIEWS: '/reviews',
  ORDERS: '/orders',
  ORDERS_DETAIL: (id: string) => `/orders/${id}`,
  MEDIA: '/media',
  SETTINGS: '/settings',
  SETTINGS_WHATSAPP: '/settings/whatsapp',
  SETTINGS_SOCIAL: '/settings/social',
  SETTINGS_SHIPPING: '/settings/shipping',
  EMAIL_TEMPLATES: '/settings/email-templates',
} as const

