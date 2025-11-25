import { useState, useEffect, useCallback } from 'react'
import type { HomepageSection } from '@/shared/types/entity.types'
import { HomepageSectionRepositoryImpl } from '@/infrastructure/repositories/homepage-section.repository.impl'
import { toast } from 'sonner'

export function useHomepageSections() {
  const [sections, setSections] = useState<HomepageSection[]>([])
  const [loading, setLoading] = useState(true)
  const repository = new HomepageSectionRepositoryImpl()

  const fetchSections = useCallback(async () => {
    setLoading(true)
    try {
      const response: any = await repository.findAll()
      setSections(response.data || [])
    } catch (error: any) {
      const errorMessage = error?.response?.data?.error || error?.error || 'Failed to fetch homepage sections'
      toast.error(errorMessage)
      console.error('Failed to fetch sections:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchSections()
  }, [fetchSections])

  const addProducts = useCallback(async (type: string, productIds: string[]) => {
    try {
      const response: any = await repository.addProducts(type, productIds)
      toast.success(`Added ${productIds.length} product(s) to section`)
      await fetchSections()
      return response.data
    } catch (error: any) {
      const errorMessage = error?.response?.data?.error || error?.error || 'Failed to add products'
      toast.error(errorMessage)
      throw error
    }
  }, [fetchSections])

  const removeProducts = useCallback(async (type: string, productIds: string[]) => {
    try {
      const response: any = await repository.removeProducts(type, productIds)
      toast.success(`Removed ${productIds.length} product(s) from section`)
      await fetchSections()
      return response.data
    } catch (error: any) {
      const errorMessage = error?.response?.data?.error || error?.error || 'Failed to remove products'
      toast.error(errorMessage)
      throw error
    }
  }, [fetchSections])

  const reorderProducts = useCallback(async (type: string, productIds: string[]) => {
    try {
      const response: any = await repository.reorderProducts(type, productIds)
      await fetchSections()
      return response.data
    } catch (error: any) {
      const errorMessage = error?.response?.data?.error || error?.error || 'Failed to reorder products'
      toast.error(errorMessage)
      throw error
    }
  }, [fetchSections])

  const updateSection = useCallback(async (type: string, data: Partial<HomepageSection>) => {
    try {
      const response: any = await repository.update(type, data)
      toast.success('Section updated successfully')
      await fetchSections()
      return response.data
    } catch (error: any) {
      const errorMessage = error?.response?.data?.error || error?.error || 'Failed to update section'
      toast.error(errorMessage)
      throw error
    }
  }, [fetchSections])

  const toggleActive = useCallback(async (type: string) => {
    try {
      const response: any = await repository.toggleActive(type)
      const newStatus = response.data?.active || response.data?.isActive ? 'activated' : 'deactivated'
      toast.success(`Section ${newStatus}`)
      await fetchSections()
      return response.data
    } catch (error: any) {
      const errorMessage = error?.response?.data?.error || error?.error || 'Failed to toggle section'
      toast.error(errorMessage)
      throw error
    }
  }, [fetchSections])

  const deleteSection = useCallback(async (type: string) => {
    try {
      await repository.delete(type)
      toast.success('Section deleted successfully')
      await fetchSections()
    } catch (error: any) {
      const errorMessage = error?.response?.data?.error || error?.error || 'Failed to delete section'
      toast.error(errorMessage)
      throw error
    }
  }, [fetchSections])

  return {
    sections,
    loading,
    refetch: fetchSections,
    addProducts,
    removeProducts,
    reorderProducts,
    updateSection,
    toggleActive,
    deleteSection,
  }
}

export function useHomepageSection(type: string) {
  const [section, setSection] = useState<HomepageSection | null>(null)
  const [loading, setLoading] = useState(true)
  const repository = new HomepageSectionRepositoryImpl()

  const fetchSection = useCallback(async () => {
    setLoading(true)
    try {
      const response: any = await repository.findByType(type)
      setSection(response.data)
    } catch (error: any) {
      const errorMessage = error?.response?.data?.error || error?.error || 'Failed to fetch section'
      toast.error(errorMessage)
      console.error('Failed to fetch section:', error)
    } finally {
      setLoading(false)
    }
  }, [type])

  useEffect(() => {
    if (type) {
      fetchSection()
    }
  }, [type, fetchSection])

  return {
    section,
    loading,
    refetch: fetchSection,
  }
}

