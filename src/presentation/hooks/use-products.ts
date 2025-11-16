'use client'

import { useState, useEffect, useCallback } from 'react'
import type { Product } from '@/core/entities/product.entity'
import type { PaginatedResponse, QueryParams } from '@/shared/types'
import { ProductRepositoryImpl } from '@/infrastructure/repositories/product.repository.impl'
import { toast } from 'sonner'

export function useProducts(params?: QueryParams) {
  const [products, setProducts] = useState<Product[]>([])
  const [pagination, setPagination] = useState<PaginatedResponse<Product>['pagination'] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const repository = new ProductRepositoryImpl()

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await repository.findAll(params)
      setProducts(response.data)
      setPagination(response.pagination)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load products'
      setError(message)
      toast.error(message)
    } finally {
      setLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  const deleteProduct = async (id: string) => {
    try {
      await repository.delete(id)
      toast.success('Product deleted successfully')
      fetchProducts()
    } catch (err) {
      toast.error('Failed to delete product')
      throw err
    }
  }

  return {
    products,
    pagination,
    loading,
    error,
    refetch: fetchProducts,
    deleteProduct,
  }
}

