'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Sparkles, Eye, EyeOff, Loader2 } from 'lucide-react'
import Cookies from 'js-cookie'
import { Button } from '@/presentation/components/ui/button'
import { Input } from '@/presentation/components/ui/input'
import { Label } from '@/presentation/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/presentation/components/ui/card'
import { httpClient } from '@/infrastructure/api/client'
import { API_ENDPOINTS } from '@/infrastructure/config/api.config'
import { AUTH_TOKEN_KEY } from '@/infrastructure/config/constants'
import { toast } from 'sonner'
import type { LoginResponse, ApiError } from '@/shared/types/api-responses'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || !password) {
      toast.error('Please fill in all fields')
      return
    }

    setLoading(true)

    try {
      const response = await httpClient.post<LoginResponse>(API_ENDPOINTS.auth.login, {
        email,
        password
      })
      
      if (response.success && response.token) {
        Cookies.set(AUTH_TOKEN_KEY, response.token, { expires: 7 })
        toast.success('Welcome back!', {
          description: 'Redirecting to dashboard...',
          duration: 2000
        })
        setTimeout(() => {
          router.push('/')
        }, 500)
      }
    } catch (err) {
      const error = err as ApiError
      const errorMessage = typeof error.error === 'string' ? error.error : ''
      
      if (error.errorCode === 'EMAIL_NOT_VERIFIED') {
        toast.error('Email not verified', {
          description: 'Please check your inbox for the verification link to activate your account.',
          duration: 6000
        })
      } else if (error.errorCode === 'ACCOUNT_LOCKED') {
        toast.error('Account locked', {
          description: 'Too many failed login attempts. Please try again later or reset your password.',
          duration: 6000
        })
      } else if (error.errorCode === 'INVALID_CREDENTIALS' || errorMessage.includes('Invalid')) {
        toast.error('Invalid credentials', {
          description: 'The email or password you entered is incorrect.',
          duration: 5000
        })
      } else if (error.errorCode === 'NETWORK_ERROR') {
        toast.error('Connection failed', {
          description: 'Please check your internet connection and try again.',
          duration: 5000
        })
      } else {
        toast.error('Login failed', {
          description: errorMessage || 'Unable to sign in. Please try again.',
          duration: 5000
        })
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 to-accent">
      <Card className="w-full max-w-md p-8">
        <CardHeader className="space-y-4 text-center">
          <div className="flex justify-center">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
          </div>
          <div className="space-y-2">
            <CardTitle className="text-2xl">GlowNatura Admin</CardTitle>
            <CardDescription>Sign in to manage your store</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@glownatura.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="password">Password</Label>
                <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign in'
              )}
            </Button>
          </form>
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Don&apos;t have an account?{' '}
              <Link href="/register" className="text-primary font-medium hover:underline">
                Register
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
