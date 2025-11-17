import type { IReviewRepository } from '@/core/ports/repositories/review.repository'
import type { Review } from '@/core/entities/review.entity'
import type { ApiResponse, PaginatedResponse, QueryParams } from '@/shared/types'
import type { ReviewStatus } from '@/shared/types/api.types'
import { httpClient } from '@/infrastructure/api/client'
import { API_ENDPOINTS } from '@/infrastructure/config/api.config'

export class ReviewRepositoryImpl implements IReviewRepository {
  async findAll(params?: QueryParams): Promise<PaginatedResponse<Review>> {
    const queryString = params ? new URLSearchParams(params as Record<string, string>).toString() : ''
    const url = `${API_ENDPOINTS.reviews.list}${queryString ? `?${queryString}` : ''}`
    return httpClient.get<PaginatedResponse<Review>>(url)
  }

  async findById(id: string): Promise<ApiResponse<Review>> {
    return httpClient.get<ApiResponse<Review>>(API_ENDPOINTS.reviews.get(id))
  }

  async updateStatus(id: string, status: ReviewStatus): Promise<ApiResponse<Review>> {
    return httpClient.put<ApiResponse<Review>>(API_ENDPOINTS.reviews.updateStatus(id), { status })
  }

  async delete(id: string): Promise<ApiResponse<void>> {
    return httpClient.delete<ApiResponse<void>>(API_ENDPOINTS.reviews.delete(id))
  }

  async bulkUpdateStatus(reviewIds: string[], status: ReviewStatus): Promise<ApiResponse<void>> {
    return httpClient.put<ApiResponse<void>>(API_ENDPOINTS.reviews.bulkStatus, { reviewIds, status })
  }
}

