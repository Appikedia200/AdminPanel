'use client'

import { useState, useEffect, useCallback } from 'react'
import { httpClient } from '@/infrastructure/api/client'
import { API_ENDPOINTS } from '@/infrastructure/config/api.config'
import { toast } from 'sonner'

export interface Notification {
  _id: string
  type: 'review' | 'order' | 'product' | 'system'
  title: string
  message: string
  relatedId?: string
  relatedModel?: string
  isRead: boolean
  createdAt: string
  updatedAt: string
}

// ✅ Professional: Hook with manual state management (no React Query dependency)
export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  const fetchNotifications = useCallback(async () => {
    try {
      const response = await httpClient.get<{ success: boolean; data: Notification[] }>(
        API_ENDPOINTS.notifications.list
      )
      if (response.success) {
        setNotifications(response.data)
      }
    } catch {
      // Silently fail if endpoint doesn't exist yet
      console.log('Notifications not available yet')
      setNotifications([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  const fetchUnreadCount = useCallback(async () => {
    try {
      const response = await httpClient.get<{ success: boolean; data: { count: number } }>(
        API_ENDPOINTS.notifications.unreadCount
      )
      if (response.success) {
        setUnreadCount(response.data.count)
      }
    } catch {
      setUnreadCount(0)
    }
  }, [])

  // Fetch on mount and poll every 30 seconds
  useEffect(() => {
    fetchNotifications()
    fetchUnreadCount()

    const interval = setInterval(() => {
      fetchNotifications()
      fetchUnreadCount()
    }, 30000) // 30 seconds

    return () => clearInterval(interval)
  }, [fetchNotifications, fetchUnreadCount])

  const markAsRead = useCallback(async (id: string) => {
    try {
      await httpClient.put(`${API_ENDPOINTS.notifications.list}/${id}/read`)
      await fetchNotifications()
      await fetchUnreadCount()
    } catch (error: any) {
      toast.error(error?.error || 'Failed to mark notification as read')
    }
  }, [fetchNotifications, fetchUnreadCount])

  const markAllAsRead = useCallback(async () => {
    try {
      await httpClient.put(`${API_ENDPOINTS.notifications.list}/read-all`)
      await fetchNotifications()
      await fetchUnreadCount()
      toast.success('All notifications marked as read')
    } catch (error: any) {
      toast.error(error?.error || 'Failed to mark all as read')
    }
  }, [fetchNotifications, fetchUnreadCount])

  const deleteNotification = useCallback(async (id: string) => {
    try {
      await httpClient.delete(`${API_ENDPOINTS.notifications.list}/${id}`)
      await fetchNotifications()
      await fetchUnreadCount()
      toast.success('Notification dismissed')
    } catch (error: any) {
      toast.error(error?.error || 'Failed to dismiss notification')
    }
  }, [fetchNotifications, fetchUnreadCount])

  return {
    notifications,
    unreadCount,
    isLoading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  }
}

