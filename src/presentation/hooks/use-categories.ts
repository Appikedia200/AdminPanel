import { useState, useEffect, useCallback } from 'react'
import { Category } from '@/shared/types/entity.types'
import { CategoryRepositoryImpl } from '@/infrastructure/repositories/category.repository.impl'
import { toast } from 'sonner'

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const repository = new CategoryRepositoryImpl()

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await repository.findAll()
      // ✅ FIX: Backend returns { data: { categories: [] } }
      const responseData = response.data as any
      const categoriesData = responseData?.categories || responseData || []
      // Ensure we always set an array
      setCategories(Array.isArray(categoriesData) ? categoriesData : [])
    } catch (err: any) {
      const errorMessage = err.error || 'Failed to load categories'
      setError(errorMessage)
      toast.error(errorMessage)
      // Ensure categories is empty array on error
      setCategories([])
    } finally {
      setLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  return {
    categories,
    loading,
    error,
    refetch: fetchCategories,
  }
}
