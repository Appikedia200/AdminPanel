'use client'

import { useState } from 'react'
import { Star, Check, X, Trash2, Search } from 'lucide-react'
import { Button } from '@/presentation/components/ui/button'
import { Input } from '@/presentation/components/ui/input'
import { Card, CardContent } from '@/presentation/components/ui/card'
import { Badge } from '@/presentation/components/ui/badge'
import { Skeleton } from '@/presentation/components/ui/skeleton'
import { useReviews } from '@/presentation/hooks/use-reviews'
import { formatRelativeTime } from '@/shared/utils/format'
import type { Review } from '@/core/entities/review.entity'

export default function ReviewsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all')
  
  const params = {
    search: searchQuery,
    ...(statusFilter !== 'all' && { status: statusFilter }),
  }
  
  const { reviews, loading, updateStatus, deleteReview } = useReviews(params)

  const handleApprove = async (id: string) => {
    await updateStatus(id, 'approved')
  }

  const handleReject = async (id: string) => {
    await updateStatus(id, 'rejected')
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this review?')) {
      await deleteReview(id)
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
    if (review.status === 'approved') return <Badge variant="success">Approved</Badge>
    if (review.status === 'rejected') return <Badge variant="destructive">Rejected</Badge>
    return <Badge variant="warning">Pending</Badge>
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
        <p className="text-muted-foreground mt-2">Manage customer reviews</p>
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

        <div className="flex gap-2">
          <Button
            variant={statusFilter === 'all' ? 'default' : 'outline'}
            onClick={() => setStatusFilter('all')}
          >
            All
          </Button>
          <Button
            variant={statusFilter === 'pending' ? 'default' : 'outline'}
            onClick={() => setStatusFilter('pending')}
          >
            Pending
          </Button>
          <Button
            variant={statusFilter === 'approved' ? 'default' : 'outline'}
            onClick={() => setStatusFilter('approved')}
          >
            Approved
          </Button>
          <Button
            variant={statusFilter === 'rejected' ? 'default' : 'outline'}
            onClick={() => setStatusFilter('rejected')}
          >
            Rejected
          </Button>
        </div>
      </div>

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
        <div className="grid gap-4">
          {reviews.map((review) => (
            <Card key={review._id}>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
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

                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="font-medium">{review.user.name}</span>
                      <span>{review.user.email}</span>
                      <span>{formatRelativeTime(review.createdAt)}</span>
                    </div>
                  </div>

                  <div className="flex md:flex-col gap-2">
                    {review.status === 'pending' && (
                      <>
                        <Button
                          size="sm"
                          variant="default"
                          onClick={() => handleApprove(review._id)}
                          className="w-full md:w-auto"
                        >
                          <Check className="h-4 w-4 mr-2" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleReject(review._id)}
                          className="w-full md:w-auto"
                        >
                          <X className="h-4 w-4 mr-2" />
                          Reject
                        </Button>
                      </>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(review._id)}
                      className="w-full md:w-auto text-destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
