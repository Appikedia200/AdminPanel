'use client'

import { useState, useEffect, useCallback } from 'react'
import { httpClient } from '@/infrastructure/api/client'
import { API_ENDPOINTS } from '@/infrastructure/config/api.config'
import { toast } from 'sonner'

interface DateRange {
  from?: string
  to?: string
}

interface AnalyticsSummary {
  totalOrders: number
  totalRevenue: number
  paidOrders: number
  pendingOrders: number
  averageOrderValue: number
  totalItemsSold: number
  dateRange?: {
    from: string
    to: string
  }
}

interface RevenueData {
  date: string
  revenue: number
  orders: number
}

interface TopProduct {
  productId: string
  name: string
  totalSold: number
  revenue: number
  image?: {
    mediaId?: {
      cloudinaryUrl?: string
    } | null
  }
}

interface SalesByCategory {
  categoryId: string
  categoryName: string
  totalSales: number
  itemsSold: number
}

interface ExportData {
  type: 'orders' | 'products' | 'revenue'
  data: any[]
  dateRange?: {
    from: string
    to: string
  }
  exportedAt: string
}

export function useAnalyticsSummary(dateRange: DateRange) {
  const [data, setData] = useState<AnalyticsSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchSummary = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response: any = await httpClient.get(
        API_ENDPOINTS.analytics.summary,
        { params: dateRange }
      )
      if (response.success && response.data) {
        setData(response.data)
      } else {
        const errorMsg = response.error?.message || 'Failed to fetch analytics summary'
        setError(errorMsg)
      }
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || err.error || err.message || 'Failed to fetch analytics summary'
      setError(errorMsg)
    } finally {
      setLoading(false)
    }
  }, [dateRange.from, dateRange.to])

  useEffect(() => {
    fetchSummary()
  }, [fetchSummary])

  return { data, loading, error, refetch: fetchSummary }
}

export function useRevenueOverTime(
  dateRange: DateRange, 
  groupBy: 'day' | 'week' | 'month' = 'day'
) {
  const [data, setData] = useState<RevenueData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchRevenue = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response: any = await httpClient.get(
        API_ENDPOINTS.analytics.revenue,
        { params: { ...dateRange, groupBy } }
      )
      if (response.success && response.data) {
        setData(response.data)
      } else {
        const errorMsg = response.error?.message || 'Failed to fetch revenue data'
        setError(errorMsg)
      }
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || err.error || err.message || 'Failed to fetch revenue data'
      setError(errorMsg)
    } finally {
      setLoading(false)
    }
  }, [dateRange.from, dateRange.to, groupBy])

  useEffect(() => {
    fetchRevenue()
  }, [fetchRevenue])

  return { data, loading, error, refetch: fetchRevenue }
}

export function useTopProducts(dateRange: DateRange, limit: number = 5) {
  const [data, setData] = useState<TopProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTopProducts = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response: any = await httpClient.get(
        API_ENDPOINTS.analytics.topProducts,
        { params: { ...dateRange, limit } }
      )
      if (response.success && response.data) {
        setData(response.data)
      } else {
        const errorMsg = response.error?.message || 'Failed to fetch top products'
        setError(errorMsg)
      }
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || err.error || err.message || 'Failed to fetch top products'
      setError(errorMsg)
    } finally {
      setLoading(false)
    }
  }, [dateRange.from, dateRange.to, limit])

  useEffect(() => {
    fetchTopProducts()
  }, [fetchTopProducts])

  return { data, loading, error, refetch: fetchTopProducts }
}

export function useSalesByCategory(dateRange: DateRange) {
  const [data, setData] = useState<SalesByCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchSalesByCategory = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response: any = await httpClient.get(
        API_ENDPOINTS.analytics.salesByCategory,
        { params: dateRange }
      )
      if (response.success && response.data) {
        setData(response.data)
      } else {
        const errorMsg = response.error?.message || 'Failed to fetch sales by category'
        setError(errorMsg)
      }
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || err.error || err.message || 'Failed to fetch sales by category'
      setError(errorMsg)
    } finally {
      setLoading(false)
    }
  }, [dateRange.from, dateRange.to])

  useEffect(() => {
    fetchSalesByCategory()
  }, [fetchSalesByCategory])

  return { data, loading, error, refetch: fetchSalesByCategory }
}

export function useExportAnalytics() {
  const [loading, setLoading] = useState(false)

  const exportData = async (
    type: 'orders' | 'products' | 'revenue',
    dateRange: DateRange
  ): Promise<ExportData | null> => {
    setLoading(true)
    try {
      const response: any = await httpClient.get(
        API_ENDPOINTS.analytics.export,
        { params: { ...dateRange, type } }
      )
      if (response.success && response.data) {
        return response.data
      } else {
        const errorMsg = response.error?.message || 'Failed to export data'
        toast.error(errorMsg)
        return null
      }
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || err.error || err.message || 'Failed to export data'
      toast.error(errorMsg)
      return null
    } finally {
      setLoading(false)
    }
  }

  return { exportData, loading }
}

