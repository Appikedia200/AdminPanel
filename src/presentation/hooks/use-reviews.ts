'use client'

import { useState, useEffect, useCallback } from 'react'
import type { Review } from '@/core/entities/review.entity'
import type { PaginatedResponse, QueryParams } from '@/shared/types'
import type { ReviewStatus } from '@/shared/types/api.types'
import { ReviewRepositoryImpl } from '@/infrastructure/repositories/review.repository.impl'
import { toast } from 'sonner'

export function useReviews(params?: QueryParams) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [pagination, setPagination] = useState<PaginatedResponse<Review>['pagination'] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const repository = new ReviewRepositoryImpl()

  const fetchReviews = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await repository.findAll(params)
      setReviews(response.data)
      setPagination(response.pagination)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load reviews'
      setError(message)
      toast.error(message)
    } finally {
      setLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params])

  useEffect(() => {
    fetchReviews()
  }, [fetchReviews])

  const updateStatus = async (id: string, status: ReviewStatus) => {
    try {
      await repository.updateStatus(id, status)
      toast.success(`Review ${status}`)
      fetchReviews()
    } catch (err) {
      toast.error('Failed to update review status')
      throw err
    }
  }

  const deleteReview = async (id: string) => {
    try {
      await repository.delete(id)
      toast.success('Review deleted successfully')
      fetchReviews()
    } catch (err) {
      toast.error('Failed to delete review')
      throw err
    }
  }

  return {
    reviews,
    pagination,
    loading,
    error,
    refetch: fetchReviews,
    updateStatus,
    deleteReview,
  }
}

