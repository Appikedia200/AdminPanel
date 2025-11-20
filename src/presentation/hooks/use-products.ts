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
      // Safely extract error message
      let message = 'Failed to load products'
      
      if (err instanceof Error) {
        message = err.message
      } else if (typeof err === 'object' && err !== null) {
        const apiError = err as { error?: string; message?: string }
        message = apiError.error || apiError.message || message
      } else if (typeof err === 'string') {
        message = err
      }
      
      setError(message)
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }, [JSON.stringify(params)]) // Stringify params to prevent infinite loops

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  const deleteProduct = async (id: string) => {
    try {
      await repository.delete(id)
      toast.success('Product deleted successfully')
      fetchProducts()
    } catch (err) {
      // Safely extract error message
      let message = 'Failed to delete product'
      
      if (err instanceof Error) {
        message = err.message
      } else if (typeof err === 'object' && err !== null) {
        const apiError = err as { error?: string; message?: string }
        message = apiError.error || apiError.message || message
      }
      
      toast.error(message)
      throw new Error(message)
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

