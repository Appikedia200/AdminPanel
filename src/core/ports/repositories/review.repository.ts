import type { Review } from '@/core/entities/review.entity'
import type { ApiResponse, PaginatedResponse, QueryParams } from '@/shared/types'
import type { ReviewStatus } from '@/shared/types/api.types'

export interface IReviewRepository {
  findAll(params?: QueryParams): Promise<PaginatedResponse<Review>>
  findById(id: string): Promise<ApiResponse<Review>>
  updateStatus(id: string, status: ReviewStatus): Promise<ApiResponse<Review>>
  delete(id: string): Promise<ApiResponse<void>>
  bulkUpdateStatus(ids: string[], status: ReviewStatus): Promise<ApiResponse<void>>
}

