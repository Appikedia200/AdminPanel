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
      
      // ✅ CRITICAL FIX: Backend returns { success: true, data: { categories: [...] } }
      let categoriesArray: Category[] = []
      
      if (response.success && response.data) {
        // Check if data contains nested 'categories' array (NEW BACKEND FORMAT)
        if (response.data.categories && Array.isArray(response.data.categories)) {
          categoriesArray = response.data.categories
        } 
        // Or if data is directly an array (OLD FORMAT)
        else if (Array.isArray(response.data)) {
          categoriesArray = response.data
        }
      }
      // Fallback: check if response itself is an array
      else if (Array.isArray(response)) {
        categoriesArray = response
      }
      
      // Return in PaginatedResponse format
      return {
        success: true,
        data: categoriesArray,
        pagination: {
          page: 1,
          limit: categoriesArray.length || 10,
          total: categoriesArray.length,
          totalPages: categoriesArray.length > 0 ? 1 : 0,
          hasNextPage: false,
          hasPrevPage: false
        }
      } as PaginatedResponse<Category>
    } catch {
      // Return empty paginated response on error
      return {
        success: true,
        data: [],
        pagination: {
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 0,
          hasNextPage: false,
          hasPrevPage: false
        }
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

