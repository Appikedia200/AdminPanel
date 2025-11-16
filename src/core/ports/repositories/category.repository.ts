import type { Category } from '@/core/entities/category.entity'
import type { ApiResponse, PaginatedResponse, QueryParams } from '@/shared/types'

export interface ICategoryRepository {
  findAll(params?: QueryParams): Promise<PaginatedResponse<Category>>
  findById(id: string): Promise<ApiResponse<Category>>
  create(data: Partial<Category>): Promise<ApiResponse<Category>>
  update(id: string, data: Partial<Category>): Promise<ApiResponse<Category>>
  delete(id: string): Promise<ApiResponse<void>>
  reorder(categories: Array<{ id: string; displayOrder: number }>): Promise<ApiResponse<void>>
}

