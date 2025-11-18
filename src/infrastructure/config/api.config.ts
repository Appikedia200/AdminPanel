export const API_CONFIG = {
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://backendglownaturas.onrender.com',
  timeout: 60000, // Increased to 60 seconds to handle Render free tier cold starts
  headers: {
    'Content-Type': 'application/json',
  },
} as const

export const API_ENDPOINTS = {
  // Authentication
  auth: {
    login: '/api/auth/login',
    logout: '/api/auth/logout',
    me: '/api/auth/me',
    register: '/api/auth/register',
    verifyEmail: '/api/auth/verify-email',
    resendVerification: '/api/auth/resend-verification',
    forgotPassword: '/api/auth/forgot-password',
    resetPassword: '/api/auth/reset-password',
    changePassword: '/api/auth/change-password',
    updateProfile: '/api/auth/profile',
  },

  // Products
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

  // Categories
  categories: {
    list: '/api/categories',
    create: '/api/categories',
    get: (id: string) => `/api/categories/${id}`,
    update: (id: string) => `/api/categories/${id}`,
    delete: (id: string) => `/api/categories/${id}`,
    reorder: '/api/categories/reorder',
  },

  // Reviews
  reviews: {
    list: '/api/reviews',
    get: (id: string) => `/api/reviews/${id}`,
    create: '/api/reviews',
    updateStatus: (id: string) => `/api/reviews/${id}/status`,
    delete: (id: string) => `/api/reviews/${id}`,
    bulkStatus: '/api/reviews/bulk/status',
  },

  // Orders
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

  // Media
  media: {
    list: '/api/media',
    get: (id: string) => `/api/media/${id}`,
    upload: '/api/media',
    update: (id: string) => `/api/media/${id}`,
    delete: (id: string) => `/api/media/${id}`,
    bulkDeleteUnused: '/api/media/bulk/unused',
  },

  // Settings
  settings: {
    get: '/api/settings',
    update: '/api/settings',
  },

  // Email Templates
  emailTemplates: {
    list: '/api/email-templates',
    get: (type: string) => `/api/email-templates/${type}`,
    update: (type: string) => `/api/email-templates/${type}`,
    preview: '/api/email-templates/preview',
    testSend: '/api/email-templates/test-send',
    restore: (type: string) => `/api/email-templates/${type}/restore`,
  },

  // Dashboard
  dashboard: {
    stats: '/api/dashboard/stats',
    recentOrders: '/api/dashboard/recent-orders',
    topProducts: '/api/dashboard/top-products',
    salesData: '/api/dashboard/sales-data',
  },
} as const
