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
      setCategories(response.data)
    } catch (err: any) {
      const errorMessage = err.error || 'Failed to load categories'
      setError(errorMessage)
      toast.error(errorMessage)
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
