import type { IAuthService } from '@/core/ports/services/auth.service'
import type { Admin } from '@/core/entities/admin.entity'
import type { LoginRequest, LoginResponse } from '@/shared/types/api.types'
import type { ApiResponse } from '@/shared/types'
import { httpClient } from '@/infrastructure/api/client'
import { API_ENDPOINTS } from '@/infrastructure/config/api.config'
import { AUTH_TOKEN_KEY } from '@/infrastructure/config/constants'
import Cookies from 'js-cookie'

export class AuthServiceImpl implements IAuthService {
  async login(credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    const response = await httpClient.post<ApiResponse<LoginResponse>>(
      API_ENDPOINTS.auth.login,
      credentials
    )

    if (response.success && response.data.token) {
      Cookies.set(AUTH_TOKEN_KEY, response.data.token, { expires: 7 })
    }

    return response
  }

  async logout(): Promise<ApiResponse<void>> {
    try {
      await httpClient.post<ApiResponse<void>>(API_ENDPOINTS.auth.logout)
    } finally {
      Cookies.remove(AUTH_TOKEN_KEY)
    }

    return { success: true, data: undefined }
  }

  async getCurrentUser(): Promise<ApiResponse<Admin>> {
    return httpClient.get<ApiResponse<Admin>>(API_ENDPOINTS.auth.me)
  }

  isAuthenticated(): boolean {
    return !!Cookies.get(AUTH_TOKEN_KEY)
  }
}

