import type { ICategoryRepository } from '@/core/ports/repositories/category.repository'
import type { Category } from '@/core/entities/category.entity'
import type { ApiResponse, PaginatedResponse, QueryParams } from '@/shared/types'
import { httpClient } from '@/infrastructure/api/client'
import { API_ENDPOINTS } from '@/infrastructure/config/api.config'

export class CategoryRepositoryImpl implements ICategoryRepository {
  async findAll(params?: QueryParams): Promise<PaginatedResponse<Category>> {
    try {
      const queryString = params ? new URLSearchParams(params as Record<string, string>).toString() : ''
      const url = `${API_ENDPOINTS.categories.list}${queryString ? `?${queryString}` : ''}`
      const response: any = await httpClient.get(url)
      
      // Handle both paginated and simple array responses
      if (response.data && Array.isArray(response.data)) {
        return response as PaginatedResponse<Category>
      }
      
      // If response is directly an array, wrap it in paginated format
      if (Array.isArray(response)) {
        return {
          data: response,
          total: response.length,
          page: 1,
          limit: response.length,
          totalPages: 1
        } as PaginatedResponse<Category>
      }
      
      // Fallback: return empty paginated response
      return {
        data: [],
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0
      } as PaginatedResponse<Category>
    } catch (error) {
      // Return empty paginated response on error
      return {
        data: [],
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0
      } as PaginatedResponse<Category>
    }
  }

  async findById(id: string): Promise<ApiResponse<Category>> {
    const response: any = await httpClient.get(API_ENDPOINTS.categories.get(id))
    return response as ApiResponse<Category>
  }

  async create(data: Partial<Category>): Promise<ApiResponse<Category>> {
    const response: any = await httpClient.post(API_ENDPOINTS.categories.create, data)
    return response as ApiResponse<Category>
  }

  async update(id: string, data: Partial<Category>): Promise<ApiResponse<Category>> {
    const response: any = await httpClient.put(API_ENDPOINTS.categories.update(id), data)
    return response as ApiResponse<Category>
  }

  async delete(id: string): Promise<ApiResponse<void>> {
    const response: any = await httpClient.delete(API_ENDPOINTS.categories.delete(id))
    return response as ApiResponse<void>
  }

  async reorder(categories: Array<{ id: string; displayOrder: number }>): Promise<ApiResponse<void>> {
    const response: any = await httpClient.post(API_ENDPOINTS.categories.reorder, { categories })
    return response as ApiResponse<void>
  }
}

