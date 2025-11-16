'use client'

import { useState, useEffect, useCallback } from 'react'
import type { Category } from '@/core/entities/category.entity'
import type { PaginatedResponse, QueryParams } from '@/shared/types'
import { CategoryRepositoryImpl } from '@/infrastructure/repositories/category.repository.impl'
import { toast } from 'sonner'

export function useCategories(params?: QueryParams) {
  const [categories, setCategories] = useState<Category[]>([])
  const [pagination, setPagination] = useState<PaginatedResponse<Category>['pagination'] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const repository = new CategoryRepositoryImpl()

  const fetchCategories = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await repository.findAll(params)
      setCategories(response.data)
      setPagination(response.pagination)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load categories'
      setError(message)
      toast.error(message)
    } finally {
      setLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params])

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  const deleteCategory = async (id: string) => {
    try {
      await repository.delete(id)
      toast.success('Category deleted successfully')
      fetchCategories()
    } catch (err) {
      toast.error('Failed to delete category')
      throw err
    }
  }

  const createCategory = async (data: Partial<Category>) => {
    try {
      await repository.create(data)
      toast.success('Category created successfully')
      fetchCategories()
    } catch (err) {
      toast.error('Failed to create category')
      throw err
    }
  }

  const updateCategory = async (id: string, data: Partial<Category>) => {
    try {
      await repository.update(id, data)
      toast.success('Category updated successfully')
      fetchCategories()
    } catch (err) {
      toast.error('Failed to update category')
      throw err
    }
  }

  return {
    categories,
    pagination,
    loading,
    error,
    refetch: fetchCategories,
    deleteCategory,
    createCategory,
    updateCategory,
  }
}

