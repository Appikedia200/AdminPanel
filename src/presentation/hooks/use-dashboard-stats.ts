import { useState, useEffect } from 'react'
import { httpClient } from '@/infrastructure/api/client'
import { API_ENDPOINTS } from '@/infrastructure/config/api.config'
import { toast } from 'sonner'

interface DashboardStats {
  products: {
    total: number
    active: number
    lowStock: number
  }
  orders: {
    total: number
    pending: number
    processing: number
    completed: number
    revenue: number
  }
  reviews: {
    total: number
    pending: number
    approved: number
    averageRating: number
  }
  customers: {
    total: number
    new: number
  }
}

export function useDashboardStats() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStats = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response: any = await httpClient.get(API_ENDPOINTS.dashboard.stats)
      
      if (response.success) {
        setStats(response.data)
      }
    } catch (err: any) {
      const errorMessage = err.error || 'Failed to load dashboard stats'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  return {
    stats,
    loading,
    error,
    refetch: fetchStats,
  }
}

