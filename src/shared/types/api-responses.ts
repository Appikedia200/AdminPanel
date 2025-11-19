import type { Admin } from '@/core/entities/admin.entity'

// Base response type
export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
  errorCode?: string
}

// Authentication responses
export interface LoginResponse {
  success: boolean
  token: string
  data: {
    admin: Admin
  }
}

export interface RegisterResponse {
  success: boolean
  message: string
  data?: {
    admin: Omit<Admin, 'password'>
  }
}

export interface VerifyEmailResponse {
  success: boolean
  message: string
  token?: string
  data?: {
    admin: Omit<Admin, 'password'>
  }
}

export interface ForgotPasswordResponse {
  success: boolean
  message: string
}

export interface ResetPasswordResponse {
  success: boolean
  message: string
}

// Error types
export type ApiErrorCode = 
  | 'EMAIL_ALREADY_EXISTS'
  | 'EMAIL_NOT_VERIFIED'
  | 'INVALID_CREDENTIALS'
  | 'ACCOUNT_LOCKED'
  | 'USER_NOT_FOUND'
  | 'EMAIL_SERVICE_ERROR'
  | 'WEAK_PASSWORD'
  | 'INVALID_EMAIL'
  | 'NETWORK_ERROR'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'VALIDATION_ERROR'
  | 'SERVER_ERROR'

export interface ApiError {
  error: string
  errorCode?: ApiErrorCode
  status?: number
  originalError?: unknown
}

