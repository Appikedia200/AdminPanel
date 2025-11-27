import { AxiosError } from 'axios'
import Cookies from 'js-cookie'
import { AUTH_TOKEN_KEY } from '../config/constants'

interface ApiError {
  success: false
  error?: string
  message?: string
  errorCode?: string
}

export function handleApiError(error: AxiosError<ApiError>): never {
  // Network error (no response from server)
  if (!error.response) {
    const networkError = new Error('Network error. Please check your internet connection.')
    Object.assign(networkError, {
      error: 'Network error. Please check your internet connection.',
      errorCode: 'NETWORK_ERROR',
      status: 0,
      response: null
    })
    throw networkError
  }

  const { status, data } = error.response

  // Handle 401 Unauthorized - clear auth and redirect
  if (status === 401) {
    Cookies.remove(AUTH_TOKEN_KEY)
    if (typeof window !== 'undefined') {
      const currentPath = window.location.pathname
      // Only redirect if not already on login/register pages
      if (currentPath !== '/login' && currentPath !== '/register') {
        setTimeout(() => {
          window.location.href = '/login'
        }, 100)
      }
    }
  }

  // ✅ PROFESSIONAL: Extract error message safely (handles all backend formats)
  let errorMessage = 'An error occurred'
  
  // Try different backend response formats
  if (typeof data?.error === 'string' && data.error) {
    errorMessage = data.error
  } else if (typeof data?.message === 'string' && data.message) {
    errorMessage = data.message
  } else if (data?.error && typeof data.error === 'object') {
    // If error is an object, try to extract message from it
    errorMessage = (data.error as any)?.message || JSON.stringify(data.error)
  } else if (typeof data === 'string') {
    // Sometimes backend sends plain string
    errorMessage = data
  }
  
  const errorCode = data?.errorCode || `HTTP_${status}`

  // ✅ Create proper Error object (fixes React error #31)
  const apiError = new Error(errorMessage)
  Object.assign(apiError, {
    error: errorMessage,
    errorCode: errorCode,
    status: status,
    response: error.response
  })
  
  throw apiError
}

