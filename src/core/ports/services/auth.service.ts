import type { Admin } from '@/core/entities/admin.entity'
import type { LoginRequest } from '@/shared/types/api.types'
import type { LoginResponse, ApiResponse } from '@/shared/types/api-responses'

export interface IAuthService {
  login(credentials: LoginRequest): Promise<LoginResponse>
  logout(): Promise<ApiResponse<void>>
  getCurrentUser(): Promise<ApiResponse<Admin>>
  isAuthenticated(): boolean
}

