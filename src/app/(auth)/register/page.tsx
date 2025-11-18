'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Sparkles } from 'lucide-react'
import { Button } from '@/presentation/components/ui/button'
import { Input } from '@/presentation/components/ui/input'
import { Label } from '@/presentation/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/presentation/components/ui/card'
import { httpClient } from '@/infrastructure/api/client'
import { API_ENDPOINTS } from '@/infrastructure/config/api.config'
import { toast } from 'sonner'
import type { RegisterResponse, ApiError } from '@/shared/types/api-responses'

export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Client-side validation
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }

    setLoading(true)

    try {
      const response = await httpClient.post<RegisterResponse>(API_ENDPOINTS.auth.register, {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      })

      if (response.success) {
        // Redirect to verification sent page with email
        router.push(`/verification-sent?email=${encodeURIComponent(formData.email)}`)
      }
    } catch (err) {
      const error = err as ApiError
      const errorMessage = typeof error.error === 'string' ? error.error : ''
      
      // Handle specific error cases
      if (error.errorCode === 'EMAIL_ALREADY_EXISTS' || errorMessage.includes('already exists')) {
        toast.error('Email already registered', {
          description: 'This email is already in use. Try logging in or use a different email.',
          duration: 5000
        })
      } else if (error.errorCode === 'INVALID_EMAIL') {
        toast.error('Invalid email address', {
          description: 'Please provide a valid email address.',
          duration: 4000
        })
      } else if (error.errorCode === 'WEAK_PASSWORD') {
        toast.error('Password too weak', {
          description: 'Password must be at least 6 characters long.',
          duration: 4000
        })
      } else if (error.errorCode === 'EMAIL_SERVICE_ERROR') {
        toast.error('Registration successful, but email failed', {
          description: 'Your account was created but we could not send the verification email. Please contact support.',
          duration: 7000
        })
      } else if (error.errorCode === 'NETWORK_ERROR') {
        toast.error('Connection failed', {
          description: 'Please check your internet connection and try again.',
          duration: 5000
        })
      } else {
        toast.error('Registration failed', {
          description: errorMessage || 'Something went wrong. Please try again.',
          duration: 5000
        })
      }
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value })
  }

  return (
    <Card>
      <CardHeader className="space-y-4 text-center">
        <div className="flex justify-center">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Sparkles className="h-6 w-6 text-primary" />
          </div>
        </div>
        <div className="space-y-2">
          <CardTitle className="text-2xl">Create Admin Account</CardTitle>
          <CardDescription>Sign up to manage GlowNatura</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="John Doe"
              disabled={loading}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="admin@glownatura.com"
              disabled={loading}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => handleChange('password', e.target.value)}
              placeholder="At least 6 characters"
              disabled={loading}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => handleChange('confirmPassword', e.target.value)}
              placeholder="Re-enter your password"
              disabled={loading}
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Creating account...' : 'Create account'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link href="/login" className="text-primary font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
