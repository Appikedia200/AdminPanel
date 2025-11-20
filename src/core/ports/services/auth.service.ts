import type { Admin } from '@/core/entities/admin.entity'
import type { LoginRequest } from '@/shared/types/api.types'
import type { LoginResponse } from '@/shared/types/api-responses'
import type { ApiResponse } from '@/shared/types'

export interface IAuthService {
  login(credentials: LoginRequest): Promise<ApiResponse<LoginResponse>>
  logout(): Promise<ApiResponse<void>>
  getCurrentUser(): Promise<ApiResponse<Admin>>
  isAuthenticated(): boolean
}

