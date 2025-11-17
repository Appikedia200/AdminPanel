'use client'

import { useState, useEffect } from 'react'
import { httpClient } from '@/infrastructure/api/client'
import { API_ENDPOINTS } from '@/infrastructure/config/api.config'

export function usePendingReviewsCount() {
  const [count, setCount] = useState(0)
  const [loading, setLoading] = useState(true)

  const fetchCount = async () => {
    try {
      const response: any = await httpClient.get(
        `${API_ENDPOINTS.reviews.list}?status=pending&limit=1`
      )
      
      if (response.success) {
        // Get count from pagination metadata
        setCount(response.data?.pagination?.totalItems || response.data?.total || 0)
      }
    } catch {
      // Silently fail, just show 0
      setCount(0)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCount()
    
    // Refresh count every 60 seconds
    const interval = setInterval(fetchCount, 60000)
    
    return () => clearInterval(interval)
  }, [])

  return { count, loading, refetch: fetchCount }
}

