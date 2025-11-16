import type { IProductRepository } from '@/core/ports/repositories/product.repository'
import type { Product } from '@/core/entities/product.entity'
import type { ApiResponse, PaginatedResponse, QueryParams } from '@/shared/types'
import { httpClient } from '@/infrastructure/api/client'
import { API_ENDPOINTS } from '@/infrastructure/config/api.config'

export class ProductRepositoryImpl implements IProductRepository {
  async findAll(params?: QueryParams): Promise<PaginatedResponse<Product>> {
    const queryString = params ? new URLSearchParams(params as Record<string, string>).toString() : ''
    const url = `${API_ENDPOINTS.products.list}${queryString ? `?${queryString}` : ''}`
    return httpClient.get<PaginatedResponse<Product>>(url)
  }

  async findById(id: string): Promise<ApiResponse<Product>> {
    return httpClient.get<ApiResponse<Product>>(API_ENDPOINTS.products.get(id))
  }

  async create(data: Partial<Product>): Promise<ApiResponse<Product>> {
    return httpClient.post<ApiResponse<Product>>(API_ENDPOINTS.products.create, data)
  }

  async update(id: string, data: Partial<Product>): Promise<ApiResponse<Product>> {
    return httpClient.put<ApiResponse<Product>>(API_ENDPOINTS.products.update(id), data)
  }

  async delete(id: string): Promise<ApiResponse<void>> {
    return httpClient.delete<ApiResponse<void>>(API_ENDPOINTS.products.delete(id))
  }

  async generateSKU(): Promise<ApiResponse<{ sku: string }>> {
    return httpClient.get<ApiResponse<{ sku: string }>>(API_ENDPOINTS.products.generateSKU)
  }

  async getLowStock(): Promise<ApiResponse<Product[]>> {
    return httpClient.get<ApiResponse<Product[]>>(API_ENDPOINTS.products.lowStock)
  }
}

