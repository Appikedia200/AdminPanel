'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/presentation/components/ui/button'
import { Input } from '@/presentation/components/ui/input'
import { Label } from '@/presentation/components/ui/label'
import { Card } from '@/presentation/components/ui/card'
import { Sparkles, ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'
import { httpClient } from '@/infrastructure/api/client'
import { API_ENDPOINTS } from '@/infrastructure/config/api.config'
import type { ForgotPasswordResponse, ApiError } from '@/shared/types/api-responses'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await httpClient.post<ForgotPasswordResponse>(API_ENDPOINTS.auth.forgotPassword, {
        email,
      })

      if (response.success) {
        setSubmitted(true)
        toast.success('Reset link sent!', {
          description: 'Check your email for password reset instructions.',
          duration: 5000
        })
      }
    } catch (err) {
      const error = err as ApiError
      const errorMessage = typeof error.error === 'string' ? error.error : ''
      
      if (error.errorCode === 'USER_NOT_FOUND' || errorMessage.includes('not found')) {
        toast.error('Email not found', {
          description: 'No account exists with this email address.',
          duration: 5000
        })
      } else if (error.errorCode === 'EMAIL_SERVICE_ERROR') {
        toast.error('Email service unavailable', {
          description: 'Unable to send reset link at this time. Please try again later.',
          duration: 6000
        })
      } else if (error.errorCode === 'NETWORK_ERROR') {
        toast.error('Connection failed', {
          description: 'Please check your internet connection and try again.',
          duration: 5000
        })
      } else {
        toast.error('Failed to send reset link', {
          description: errorMessage || 'Something went wrong. Please try again.',
          duration: 5000
        })
      }
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 to-accent p-4">
        <Card className="w-full max-w-md p-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
              <Sparkles className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Check your email</h1>
            <p className="text-muted-foreground mb-6">
              We&apos;ve sent a password reset link to <strong>{email}</strong>
            </p>
            <p className="text-sm text-muted-foreground mb-6">
              Didn&apos;t receive the email? Check your spam folder or try again.
            </p>
            <Link href="/login">
              <Button variant="outline" className="w-full">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to login
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 to-accent p-4">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <Sparkles className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold">Forgot password?</h1>
          <p className="text-muted-foreground mt-2">
            Enter your email and we&apos;ll send you a reset link
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@glownatura.com"
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Sending...' : 'Send reset link'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <Link 
            href="/login" 
            className="text-sm text-muted-foreground hover:text-primary inline-flex items-center"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to login
          </Link>
        </div>
      </Card>
    </div>
  )
}

