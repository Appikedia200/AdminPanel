'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import type { Admin } from '@/core/entities/admin.entity'
import type { LoginRequest } from '@/shared/types/api.types'
import { AuthServiceImpl } from '@/infrastructure/repositories/auth.service.impl'
import { toast } from 'sonner'

interface AuthContextType {
  user: Admin | null
  loading: boolean
  login: (credentials: LoginRequest) => Promise<void>
  logout: () => Promise<void>
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Admin | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const authService = new AuthServiceImpl()

  useEffect(() => {
    checkAuth()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const checkAuth = async () => {
    try {
      if (authService.isAuthenticated()) {
        const response = await authService.getCurrentUser()
        if (response.success) {
          setUser(response.data)
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error)
    } finally {
      setLoading(false)
    }
  }

  const login = async (credentials: LoginRequest) => {
    try {
      setLoading(true)
      const response = await authService.login(credentials)
      
      if (response.success) {
        setUser(response.data.admin)
        toast.success('Login successful')
        router.push('/')
      }
    } catch (error) {
      console.error('Login error:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      await authService.logout()
      setUser(null)
      toast.success('Logged out successfully')
      router.push('/login')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

