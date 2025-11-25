import type { HomepageSection } from '@/shared/types/entity.types'
import type { ApiResponse } from '@/shared/types'
import { httpClient } from '@/infrastructure/api/client'
import { API_ENDPOINTS } from '@/infrastructure/config/api.config'

export class HomepageSectionRepositoryImpl {
  async findAll(): Promise<ApiResponse<HomepageSection[]>> {
    return httpClient.get<ApiResponse<HomepageSection[]>>(API_ENDPOINTS.homepageSections.list)
  }

  async findByType(type: string): Promise<ApiResponse<HomepageSection>> {
    return httpClient.get<ApiResponse<HomepageSection>>(API_ENDPOINTS.homepageSections.get(type))
  }

  async create(data: Partial<HomepageSection>): Promise<ApiResponse<HomepageSection>> {
    // Backend accepts both 'type' and 'sectionType', both 'active' and 'isActive'
    const payload = {
      sectionType: data.type || data.sectionType,
      title: data.title,
      subtitle: data.subtitle,
      products: data.products || [],
      maxProducts: data.maxProducts || 8,
      displayOrder: data.displayOrder || 0,
      isActive: data.active !== undefined ? data.active : data.isActive !== undefined ? data.isActive : true,
      autoUpdate: data.autoUpdate || false,
    }
    return httpClient.post<ApiResponse<HomepageSection>>(API_ENDPOINTS.homepageSections.create, payload)
  }

  async update(type: string, data: Partial<HomepageSection>): Promise<ApiResponse<HomepageSection>> {
    const payload: Record<string, unknown> = {}
    if (data.title !== undefined) payload.title = data.title
    if (data.subtitle !== undefined) payload.subtitle = data.subtitle
    if (data.products !== undefined) payload.products = data.products
    if (data.maxProducts !== undefined) payload.maxProducts = data.maxProducts
    if (data.displayOrder !== undefined) payload.displayOrder = data.displayOrder
    if (data.active !== undefined) payload.isActive = data.active
    if (data.isActive !== undefined) payload.isActive = data.isActive
    if (data.autoUpdate !== undefined) payload.autoUpdate = data.autoUpdate
    
    return httpClient.put<ApiResponse<HomepageSection>>(API_ENDPOINTS.homepageSections.update(type), payload)
  }

  async delete(type: string): Promise<ApiResponse<{ message: string }>> {
    return httpClient.delete<ApiResponse<{ message: string }>>(API_ENDPOINTS.homepageSections.delete(type))
  }

  async addProducts(type: string, productIds: string[]): Promise<ApiResponse<HomepageSection>> {
    return httpClient.post<ApiResponse<HomepageSection>>(
      API_ENDPOINTS.homepageSections.addProducts(type),
      { productIds }
    )
  }

  async removeProducts(type: string, productIds: string[]): Promise<ApiResponse<HomepageSection>> {
    return httpClient.delete<ApiResponse<HomepageSection>>(
      API_ENDPOINTS.homepageSections.removeProducts(type),
      { data: { productIds } }
    )
  }

  async reorderProducts(type: string, productIds: string[]): Promise<ApiResponse<HomepageSection>> {
    return httpClient.put<ApiResponse<HomepageSection>>(
      API_ENDPOINTS.homepageSections.reorder(type),
      { productIds }
    )
  }

  async toggleActive(type: string): Promise<ApiResponse<HomepageSection>> {
    return httpClient.patch<ApiResponse<HomepageSection>>(API_ENDPOINTS.homepageSections.toggle(type))
  }
}

