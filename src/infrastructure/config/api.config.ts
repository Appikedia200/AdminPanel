import { API_BASE_URL } from './constants'

export const API_CONFIG = {
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
} as const

export const API_ENDPOINTS = {
  auth: {
    login: '/api/auth/login',
    logout: '/api/auth/logout',
    me: '/api/auth/me',
    register: '/api/auth/register',
    verifyEmail: '/api/auth/verify-email',
    forgotPassword: '/api/auth/forgot-password',
    resetPassword: '/api/auth/reset-password',
    changePassword: '/api/auth/change-password',
    updateProfile: '/api/auth/profile',
  },

  products: {
    list: '/api/products',
    create: '/api/products',
    get: (id: string) => `/api/products/${id}`,
    update: (id: string) => `/api/products/${id}`,
    delete: (id: string) => `/api/products/${id}`,
    generateSKU: '/api/products/generate-sku',
    lowStock: '/api/products/low-stock',
    bulkStatus: '/api/products/bulk/status',
  },

  categories: {
    list: '/api/categories',
    create: '/api/categories',
    get: (id: string) => `/api/categories/${id}`,
    update: (id: string) => `/api/categories/${id}`,
    delete: (id: string) => `/api/categories/${id}`,
    reorder: '/api/categories/reorder',
  },

  reviews: {
    list: '/api/reviews',
    get: (id: string) => `/api/reviews/${id}`,
    create: '/api/reviews',
    updateStatus: (id: string) => `/api/reviews/${id}/status`,
    delete: (id: string) => `/api/reviews/${id}`,
    bulkStatus: '/api/reviews/bulk/status',
  },

  orders: {
    list: '/api/orders',
    get: (id: string) => `/api/orders/${id}`,
    create: '/api/orders',
    confirmPayment: (id: string) => `/api/orders/${id}/confirm-payment`,
    updateStatus: (id: string) => `/api/orders/${id}/status`,
    cancel: (id: string) => `/api/orders/${id}/cancel`,
    addNote: (id: string) => `/api/orders/${id}/notes`,
    export: '/api/orders/export',
    refundRequest: (id: string) => `/api/orders/${id}/refund/request`,
    refundProcess: (id: string) => `/api/orders/${id}/refund/process`,
  },

  media: {
    list: '/api/media',
    get: (id: string) => `/api/media/${id}`,
    upload: '/api/media',
    update: (id: string) => `/api/media/${id}`,
    delete: (id: string) => `/api/media/${id}`,
    bulkDeleteUnused: '/api/media/bulk/unused',
  },

  settings: {
    get: '/api/settings',
    update: '/api/settings',
  },

  dashboard: {
    stats: '/api/dashboard/stats',
  },
} as const

