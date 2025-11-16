'use client'

import { useState, useEffect, useCallback } from 'react'
import type { Order } from '@/core/entities/order.entity'
import type { PaginatedResponse, QueryParams } from '@/shared/types'
import type { OrderStatus } from '@/shared/types/api.types'
import { OrderRepositoryImpl } from '@/infrastructure/repositories/order.repository.impl'
import { toast } from 'sonner'

export function useOrders(params?: QueryParams) {
  const [orders, setOrders] = useState<Order[]>([])
  const [pagination, setPagination] = useState<PaginatedResponse<Order>['pagination'] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const repository = new OrderRepositoryImpl()

  const fetchOrders = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await repository.findAll(params)
      setOrders(response.data)
      setPagination(response.pagination)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load orders'
      setError(message)
      toast.error(message)
    } finally {
      setLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params])

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  const updateStatus = async (id: string, status: OrderStatus) => {
    try {
      await repository.updateStatus(id, status)
      toast.success('Order status updated')
      fetchOrders()
    } catch (err) {
      toast.error('Failed to update order status')
      throw err
    }
  }

  const confirmPayment = async (id: string) => {
    try {
      await repository.confirmPayment(id)
      toast.success('Payment confirmed')
      fetchOrders()
    } catch (err) {
      toast.error('Failed to confirm payment')
      throw err
    }
  }

  const cancelOrder = async (id: string, reason: string) => {
    try {
      await repository.cancel(id, reason)
      toast.success('Order cancelled')
      fetchOrders()
    } catch (err) {
      toast.error('Failed to cancel order')
      throw err
    }
  }

  return {
    orders,
    pagination,
    loading,
    error,
    refetch: fetchOrders,
    updateStatus,
    confirmPayment,
    cancelOrder,
  }
}

export function useOrder(id: string) {
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const repository = new OrderRepositoryImpl()

  const fetchOrder = async () => {
    try {
      const response = await repository.findById(id)
      setOrder(response.data)
    } catch {
      toast.error('Failed to load order')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrder()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  return { order, loading, refetch: fetchOrder }
}

