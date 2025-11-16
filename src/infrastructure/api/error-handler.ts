import { AxiosError } from 'axios'
import { toast } from 'sonner'
import Cookies from 'js-cookie'
import { AUTH_TOKEN_KEY } from '../config/constants'

interface ApiError {
  success: false
  error: string
  errorCode?: string
}

export function handleApiError(error: AxiosError<ApiError>): never {
  if (!error.response) {
    toast.error('Network error. Please check your connection.')
    throw error
  }

  const { status, data } = error.response

  switch (status) {
    case 401:
      Cookies.remove(AUTH_TOKEN_KEY)
      if (typeof window !== 'undefined') {
        window.location.href = '/login'
      }
      toast.error('Session expired. Please login again.')
      break

    case 403:
      toast.error('Access denied.')
      break

    case 404:
      toast.error('Resource not found.')
      break

    case 422:
      toast.error(data?.error || 'Validation error.')
      break

    case 429:
      toast.error('Too many requests. Please try again later.')
      break

    case 500:
    case 502:
    case 503:
    case 504:
      toast.error('Server error. Please try again later.')
      break

    default:
      toast.error(data?.error || 'An error occurred.')
  }

  throw error
}

