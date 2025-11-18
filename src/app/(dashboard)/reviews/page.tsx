'use client'

import { useState } from 'react'
import { Star, Check, X, Trash2, Search } from 'lucide-react'
import { Button } from '@/presentation/components/ui/button'
import { Input } from '@/presentation/components/ui/input'
import { Card, CardContent } from '@/presentation/components/ui/card'
import { Badge } from '@/presentation/components/ui/badge'
import { Skeleton } from '@/presentation/components/ui/skeleton'
import { Checkbox } from '@/presentation/components/ui/checkbox'
import { useReviews } from '@/presentation/hooks/use-reviews'
import { ReviewRepositoryImpl } from '@/infrastructure/repositories/review.repository.impl'
import { formatRelativeTime } from '@/shared/utils/format'
import { toast } from 'sonner'
import type { Review } from '@/core/entities/review.entity'
import { Pagination } from '@/presentation/components/shared/pagination'

export default function ReviewsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all')
  const [selectedReviews, setSelectedReviews] = useState<string[]>([])
  const [bulkActionLoading, setBulkActionLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  
  const params = {
    search: searchQuery,
    page: currentPage,
    limit: 20,
    ...(statusFilter !== 'all' && { status: statusFilter }),
  }
  
  const { reviews, pagination, loading, refetch } = useReviews(params)
  const reviewRepository = new ReviewRepositoryImpl()

  const handleApprove = async (id: string) => {
    try {
      await reviewRepository.updateStatus(id, 'approved')
      toast.success('Review approved')
      refetch()
    } catch {
      toast.error('Failed to approve review')
    }
  }

  const handleReject = async (id: string) => {
    try {
      await reviewRepository.updateStatus(id, 'rejected')
      toast.success('Review rejected')
      refetch()
    } catch {
      toast.error('Failed to reject review')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this review?')) return
    
    try {
      await reviewRepository.delete(id)
      toast.success('Review deleted')
      refetch()
    } catch {
      toast.error('Failed to delete review')
    }
  }

  const toggleSelectReview = (id: string) => {
    setSelectedReviews(prev =>
      prev.includes(id)
        ? prev.filter(reviewId => reviewId !== id)
        : [...prev, id]
    )
  }

  const toggleSelectAll = () => {
    if (selectedReviews.length === reviews.length) {
      setSelectedReviews([])
    } else {
      setSelectedReviews(reviews.map(r => r._id))
    }
  }

  const handleBulkApprove = async () => {
    if (selectedReviews.length === 0) {
      toast.error('Please select at least one review')
      return
    }

    setBulkActionLoading(true)
    try {
      await reviewRepository.bulkUpdateStatus(selectedReviews, 'approved')
      toast.success(`${selectedReviews.length} review(s) approved`)
      setSelectedReviews([])
      refetch()
    } catch {
      toast.error('Failed to approve reviews')
    } finally {
      setBulkActionLoading(false)
    }
  }

  const handleBulkReject = async () => {
    if (selectedReviews.length === 0) {
      toast.error('Please select at least one review')
      return
    }

    setBulkActionLoading(true)
    try {
      await reviewRepository.bulkUpdateStatus(selectedReviews, 'rejected')
      toast.success(`${selectedReviews.length} review(s) rejected`)
      setSelectedReviews([])
      refetch()
    } catch {
      toast.error('Failed to reject reviews')
    } finally {
      setBulkActionLoading(false)
    }
  }

  const handleBulkDelete = async () => {
    if (selectedReviews.length === 0) {
      toast.error('Please select at least one review')
      return
    }

    if (!confirm(`Are you sure you want to delete ${selectedReviews.length} review(s)?`)) return

    setBulkActionLoading(true)
    try {
      await Promise.all(selectedReviews.map(id => reviewRepository.delete(id)))
      toast.success(`${selectedReviews.length} review(s) deleted`)
      setSelectedReviews([])
      refetch()
    } catch {
      toast.error('Failed to delete reviews')
    } finally {
      setBulkActionLoading(false)
    }
  }

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ))
  }

  const getStatusBadge = (review: Review) => {
    if (review.status === 'approved') return <Badge variant="default">Approved</Badge>
    if (review.status === 'rejected') return <Badge variant="destructive">Rejected</Badge>
    return <Badge variant="secondary">Pending</Badge>
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <div className="grid gap-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Reviews</h1>
        <p className="text-muted-foreground mt-2">Manage customer reviews and ratings</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <Card className="flex-1 p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search reviews..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </Card>

        <div className="flex gap-2 flex-wrap">
          <Button
            variant={statusFilter === 'all' ? 'default' : 'outline'}
            onClick={() => setStatusFilter('all')}
            size="sm"
          >
            All
          </Button>
          <Button
            variant={statusFilter === 'pending' ? 'default' : 'outline'}
            onClick={() => setStatusFilter('pending')}
            size="sm"
          >
            Pending
          </Button>
          <Button
            variant={statusFilter === 'approved' ? 'default' : 'outline'}
            onClick={() => setStatusFilter('approved')}
            size="sm"
          >
            Approved
          </Button>
          <Button
            variant={statusFilter === 'rejected' ? 'default' : 'outline'}
            onClick={() => setStatusFilter('rejected')}
            size="sm"
          >
            Rejected
          </Button>
        </div>
      </div>

      {selectedReviews.length > 0 && (
        <Card className="p-4 bg-primary/5 border-primary/20">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-medium">
              {selectedReviews.length} review(s) selected
            </span>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="default"
                onClick={handleBulkApprove}
                disabled={bulkActionLoading}
              >
                <Check className="mr-2 h-4 w-4" />
                Approve
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleBulkReject}
                disabled={bulkActionLoading}
              >
                <X className="mr-2 h-4 w-4" />
                Reject
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={handleBulkDelete}
                disabled={bulkActionLoading}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setSelectedReviews([])}
            >
              Clear Selection
            </Button>
          </div>
        </Card>
      )}

      {reviews.length === 0 ? (
        <Card className="p-12 text-center">
          <Star className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No reviews found</h3>
          <p className="text-muted-foreground">
            {statusFilter !== 'all'
              ? `No ${statusFilter} reviews at the moment`
              : 'No reviews have been submitted yet'}
          </p>
        </Card>
      ) : (
        <>
          {reviews.length > 0 && (
            <div className="flex items-center gap-2 pb-2">
              <Checkbox
                checked={selectedReviews.length === reviews.length}
                onCheckedChange={toggleSelectAll}
              />
              <span className="text-sm text-muted-foreground">Select all</span>
            </div>
          )}
          
          <div className="grid gap-4">
            {reviews.map((review) => (
              <Card key={review._id}>
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <div className="flex items-start pt-1">
                      <Checkbox
                        checked={selectedReviews.includes(review._id)}
                        onCheckedChange={() => toggleSelectReview(review._id)}
                      />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="flex">{renderStars(review.rating)}</div>
                        {getStatusBadge(review)}
                        {review.verified && (
                          <Badge variant="outline" className="text-xs">
                            Verified Purchase
                          </Badge>
                        )}
                      </div>

                      {review.title && (
                        <h3 className="font-semibold text-lg mb-2">{review.title}</h3>
                      )}

                      <p className="text-muted-foreground mb-3">{review.comment}</p>

                      <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-4">
                        <span className="font-medium">{review.user?.name || 'Anonymous'}</span>
                        {review.user?.email && <span>{review.user.email}</span>}
                        <span>{formatRelativeTime(review.createdAt)}</span>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {review.status === 'pending' && (
                          <>
                            <Button
                              size="sm"
                              variant="default"
                              onClick={() => handleApprove(review._id)}
                            >
                              <Check className="h-4 w-4 mr-1" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleReject(review._id)}
                            >
                              <X className="h-4 w-4 mr-1" />
                              Reject
                            </Button>
                          </>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDelete(review._id)}
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          totalItems={pagination.total}
          itemsPerPage={pagination.limit}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  )
}
