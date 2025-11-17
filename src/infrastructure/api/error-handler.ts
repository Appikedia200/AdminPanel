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
    const networkError = {
      error: 'Network error. Please check your internet connection.',
      errorCode: 'NETWORK_ERROR',
      status: 0
    }
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

  // Preserve backend error details
  const errorMessage = data?.error || data?.message || 'An error occurred'
  const errorCode = data?.errorCode || `HTTP_${status}`

  // Throw structured error for the calling code to handle
  throw {
    error: errorMessage,
    errorCode: errorCode,
    status: status,
    originalError: error
  }
}

