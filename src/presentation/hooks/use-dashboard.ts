'use client'

import { useState, useEffect } from 'react'
import { httpClient } from '@/infrastructure/api/client'
import { API_ENDPOINTS } from '@/infrastructure/config/api.config'

interface DashboardStats {
  totalRevenue: number
  totalOrders: number
  pendingOrders: number
  totalProducts: number
  lowStockProducts: number
  totalCustomers: number
  totalReviews: number
  pendingReviews: number
  revenueChange: number
  ordersChange: number
}

interface RecentOrder {
  _id: string
  orderNumber: string
  customer: {
    name: string
    email: string
  }
  total: number
  status: string
  createdAt: string
}

interface TopProduct {
  product: {
    _id: string
    name: string
    images: Array<{ url: string }>
  }
  totalSold: number
  revenue: number
}

interface SalesData {
  labels: string[]
  revenue: number[]
  orders: number[]
}

export function useDashboardStats(period: 'today' | 'week' | 'month' | 'year' = 'month') {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStats = async () => {
    setLoading(true)
    setError(null)
    try {
      const response: any = await httpClient.get(API_ENDPOINTS.dashboard.stats, {
        params: { period },
      })
      if (response.success) {
        setStats(response.data)
      } else {
        setError(response.error?.message || 'Failed to load dashboard stats')
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load dashboard stats')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [period]) // eslint-disable-line react-hooks/exhaustive-deps

  return { stats, loading, error, refetch: fetchStats }
}

export function useRecentOrders(limit: number = 10) {
  const [orders, setOrders] = useState<RecentOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchRecentOrders = async () => {
      setLoading(true)
      setError(null)
      try {
        const response: any = await httpClient.get(API_ENDPOINTS.dashboard.recentOrders, {
          params: { limit },
        })
        if (response.success) {
          setOrders(response.data || [])
        } else {
          setError(response.error?.message || 'Failed to load recent orders')
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load recent orders')
      } finally {
        setLoading(false)
      }
    }

    fetchRecentOrders()
  }, [limit])

  return { orders, loading, error }
}

export function useTopProducts(period: 'week' | 'month' | 'year' = 'month', limit: number = 10) {
  const [products, setProducts] = useState<TopProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTopProducts = async () => {
      setLoading(true)
      setError(null)
      try {
        const response: any = await httpClient.get(API_ENDPOINTS.dashboard.topProducts, {
          params: { period, limit },
        })
        if (response.success) {
          setProducts(response.data || [])
        } else {
          setError(response.error?.message || 'Failed to load top products')
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load top products')
      } finally {
        setLoading(false)
      }
    }

    fetchTopProducts()
  }, [period, limit])

  return { products, loading, error }
}

export function useSalesData(period: 'week' | 'month' | 'year' = 'month', groupBy: 'day' | 'week' | 'month' = 'day') {
  const [salesData, setSalesData] = useState<SalesData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSalesData = async () => {
      setLoading(true)
      setError(null)
      try {
        const response: any = await httpClient.get(API_ENDPOINTS.dashboard.salesData, {
          params: { period, groupBy },
        })
        if (response.success) {
          setSalesData(response.data)
        } else {
          setError(response.error?.message || 'Failed to load sales data')
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load sales data')
      } finally {
        setLoading(false)
      }
    }

    fetchSalesData()
  }, [period, groupBy])

  return { salesData, loading, error }
}

