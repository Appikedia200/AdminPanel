import type { Product } from '@/core/entities/product.entity'
import type { ApiResponse, PaginatedResponse, QueryParams } from '@/shared/types'

export interface IProductRepository {
  findAll(params?: QueryParams): Promise<PaginatedResponse<Product>>
  findById(id: string): Promise<ApiResponse<Product>>
  create(data: Partial<Product>): Promise<ApiResponse<Product>>
  update(id: string, data: Partial<Product>): Promise<ApiResponse<Product>>
  delete(id: string): Promise<ApiResponse<void>>
  generateSKU(): Promise<ApiResponse<{ sku: string }>>
  getLowStock(): Promise<ApiResponse<Product[]>>
}

