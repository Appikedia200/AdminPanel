'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Mail, CheckCircle, RefreshCw } from 'lucide-react'
import { Button } from '@/presentation/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/presentation/components/ui/card'
import { Skeleton } from '@/presentation/components/ui/skeleton'
import { httpClient } from '@/infrastructure/api/client'
import { API_ENDPOINTS } from '@/infrastructure/config/api.config'
import { toast } from 'sonner'

function VerificationSentContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get('email')
  const [resending, setResending] = useState(false)
  const [canResend, setCanResend] = useState(true)
  const [countdown, setCountdown] = useState(0)

  useEffect(() => {
    if (!email) {
      router.push('/register')
    }
  }, [email, router])

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
    setCanResend(true)
    return undefined
  }, [countdown])

  const handleResendVerification = async () => {
    if (!email || !canResend) return

    setResending(true)
    setCanResend(false)

    try {
      const response: { success: boolean; message?: string } = await httpClient.post(
        API_ENDPOINTS.auth.resendVerification,
        { email }
      )

      if (response.success) {
        toast.success('Verification email sent!', {
          description: 'Please check your inbox for the verification link.',
          duration: 5000
        })
        setCountdown(60) // 60 seconds cooldown
      }
    } catch (error) {
      const apiError = error as { error?: string }
      toast.error('Failed to resend', {
        description: apiError.error || 'Please try again later.',
        duration: 5000
      })
      setCanResend(true)
    } finally {
      setResending(false)
    }
  }

  if (!email) {
    return null
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 to-accent p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-primary" />
            </div>
          </div>
          <div className="space-y-2">
            <CardTitle className="text-2xl">Account Created Successfully!</CardTitle>
            <CardDescription className="text-base">
              Please check your email to verify your account
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Email Info */}
          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Mail className="h-4 w-4 text-primary" />
              <span>Verification email sent to:</span>
            </div>
            <p className="text-sm font-mono bg-background px-3 py-2 rounded border">
              {email}
            </p>
          </div>

          {/* Instructions */}
          <div className="space-y-3 text-sm text-muted-foreground">
            <p className="flex items-start gap-2">
              <span className="text-primary font-bold">1.</span>
              <span>Check your inbox for an email from GlowNatura</span>
            </p>
            <p className="flex items-start gap-2">
              <span className="text-primary font-bold">2.</span>
              <span>Click the verification link in the email</span>
            </p>
            <p className="flex items-start gap-2">
              <span className="text-primary font-bold">3.</span>
              <span>You&apos;ll be automatically logged in and redirected to the dashboard</span>
            </p>
          </div>

          {/* Resend Button */}
          <div className="space-y-3">
            <Button
              onClick={handleResendVerification}
              disabled={resending || !canResend}
              variant="outline"
              className="w-full"
            >
              {resending ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : countdown > 0 ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Resend in {countdown}s
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Resend Verification Email
                </>
              )}
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              Didn&apos;t receive the email? Check your spam folder or click resend
            </p>
          </div>

          {/* Back to Login */}
          <div className="pt-4 border-t">
            <p className="text-sm text-center text-muted-foreground mb-3">
              Already verified your email?
            </p>
            <Link href="/login" className="block">
              <Button variant="default" className="w-full">
                Go to Login
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function VerificationSentPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 to-accent p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center space-y-4">
              <Skeleton className="h-16 w-16 rounded-full mx-auto" />
              <Skeleton className="h-8 w-64 mx-auto" />
              <Skeleton className="h-4 w-48 mx-auto" />
            </CardHeader>
            <CardContent className="space-y-6">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-10 w-full" />
            </CardContent>
          </Card>
        </div>
      }
    >
      <VerificationSentContent />
    </Suspense>
  )
}

