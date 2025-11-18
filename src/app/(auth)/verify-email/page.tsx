'use client'

import { Suspense, useEffect, useState, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Loader2, CheckCircle2, XCircle } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/presentation/components/ui/card'
import { Button } from '@/presentation/components/ui/button'
import { httpClient } from '@/infrastructure/api/client'
import { API_ENDPOINTS } from '@/infrastructure/config/api.config'
import { toast } from 'sonner'

type VerificationState = 'loading' | 'success' | 'error'

function VerifyEmailContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [state, setState] = useState<VerificationState>('loading')
  const [message, setMessage] = useState('Verifying your email...')

  const verifyEmail = useCallback(async (token: string) => {
    try {
      const response: { success: boolean; message?: string } = await httpClient.post(API_ENDPOINTS.auth.verifyEmail, {
        token
      })
      
      if (response.success) {
        setState('success')
        setMessage('Email verified successfully! Redirecting to login...')
        toast.success('Email verified! You can now login.')
        setTimeout(() => router.push('/login'), 2000)
      }
    } catch (error: unknown) {
      const apiError = error as { error?: string | { message?: string }; message?: string }
      setState('error')
      
      // Extract error message safely
      let errorMessage = 'Verification failed. The link may be invalid or expired.'
      if (typeof apiError.error === 'string') {
        errorMessage = apiError.error
      } else if (typeof apiError.error === 'object' && apiError.error?.message) {
        errorMessage = apiError.error.message
      } else if (apiError.message) {
        errorMessage = apiError.message
      }
      
      setMessage(errorMessage)
      toast.error('Verification failed. Please try again or request a new link.')
    }
  }, [router])

  useEffect(() => {
    const token = searchParams.get('token')
    
    if (!token) {
      setState('error')
      setMessage('Invalid verification link. Please check your email for the correct link.')
      return
    }

    verifyEmail(token)
  }, [searchParams, verifyEmail])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 to-accent">
      <Card className="w-full max-w-md p-8">
        <CardHeader className="space-y-4 text-center">
          <div className="flex justify-center">
            <div className={`h-12 w-12 rounded-full flex items-center justify-center ${
              state === 'loading' ? 'bg-blue-100' :
              state === 'success' ? 'bg-green-100' : 'bg-red-100'
            }`}>
              {state === 'loading' && <Loader2 className="h-6 w-6 text-blue-600 animate-spin" />}
              {state === 'success' && <CheckCircle2 className="h-6 w-6 text-green-600" />}
              {state === 'error' && <XCircle className="h-6 w-6 text-red-600" />}
            </div>
          </div>
          <CardTitle className="text-2xl">
            {state === 'loading' && 'Verifying Email'}
            {state === 'success' && 'Email Verified!'}
            {state === 'error' && 'Verification Failed'}
          </CardTitle>
          <CardDescription>{message}</CardDescription>
        </CardHeader>
        <CardContent>
          {state === 'error' && (
            <Button onClick={() => router.push('/login')} className="w-full">
              Back to Login
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 to-accent">
        <Card className="w-full max-w-md p-8">
          <CardContent className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
          </CardContent>
        </Card>
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  )
}
