import type { ICategoryRepository } from '@/core/ports/repositories/category.repository'
import type { Category } from '@/core/entities/category.entity'
import type { ApiResponse, PaginatedResponse, QueryParams } from '@/shared/types'
import { httpClient } from '@/infrastructure/api/client'
import { API_ENDPOINTS } from '@/infrastructure/config/api.config'

export class CategoryRepositoryImpl implements ICategoryRepository {
  async findAll(params?: QueryParams): Promise<PaginatedResponse<Category>> {
    const queryString = params ? new URLSearchParams(params as Record<string, string>).toString() : ''
    const url = `${API_ENDPOINTS.categories.list}${queryString ? `?${queryString}` : ''}`
    return httpClient.get<PaginatedResponse<Category>>(url)
  }

  async findById(id: string): Promise<ApiResponse<Category>> {
    return httpClient.get<ApiResponse<Category>>(API_ENDPOINTS.categories.get(id))
  }

  async create(data: Partial<Category>): Promise<ApiResponse<Category>> {
    return httpClient.post<ApiResponse<Category>>(API_ENDPOINTS.categories.create, data)
  }

  async update(id: string, data: Partial<Category>): Promise<ApiResponse<Category>> {
    return httpClient.put<ApiResponse<Category>>(API_ENDPOINTS.categories.update(id), data)
  }

  async delete(id: string): Promise<ApiResponse<void>> {
    return httpClient.delete<ApiResponse<void>>(API_ENDPOINTS.categories.delete(id))
  }

  async reorder(categories: Array<{ id: string; displayOrder: number }>): Promise<ApiResponse<void>> {
    return httpClient.post<ApiResponse<void>>(API_ENDPOINTS.categories.reorder, { categories })
  }
}

