'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Mail } from 'lucide-react'
import { Button } from '@/presentation/components/ui/button'
import { Input } from '@/presentation/components/ui/input'
import { Label } from '@/presentation/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/presentation/components/ui/card'
import { httpClient } from '@/infrastructure/api/client'
import { API_ENDPOINTS } from '@/infrastructure/config/api.config'
import { toast } from 'sonner'

export default function VerifyEmailPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [resending, setResending] = useState(false)

  useEffect(() => {
    // Get email from session storage
    const storedEmail = sessionStorage.getItem('verification_email')
    if (storedEmail) {
      setEmail(storedEmail)
    } else {
      // If no email found, redirect to register
      toast.error('Please register first')
      router.push('/register')
    }
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!otp || otp.length < 6) {
      toast.error('Please enter a valid OTP code')
      return
    }

    setLoading(true)

    try {
      const response: any = await httpClient.post(API_ENDPOINTS.auth.verifyEmail, {
        email,
        otp,
      })

      if (response.success) {
        toast.success('Email verified successfully! You can now login.')
        sessionStorage.removeItem('verification_email')
        router.push('/login')
      }
    } catch (error: any) {
      toast.error(error.error || 'Invalid verification code')
    } finally {
      setLoading(false)
    }
  }

  const handleResendOTP = async () => {
    setResending(true)

    try {
      const response: any = await httpClient.post(API_ENDPOINTS.auth.register, {
        email,
        resend: true,
      })

      if (response.success) {
        toast.success('Verification code resent to your email')
      }
    } catch (error: any) {
      toast.error(error.error || 'Failed to resend code')
    } finally {
      setResending(false)
    }
  }

  return (
    <Card>
      <CardHeader className="space-y-4 text-center">
        <div className="flex justify-center">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Mail className="h-6 w-6 text-primary" />
          </div>
        </div>
        <div className="space-y-2">
          <CardTitle className="text-2xl">Verify Your Email</CardTitle>
          <CardDescription>
            We sent a verification code to<br />
            <strong>{email}</strong>
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="otp">Verification Code</Label>
            <Input
              id="otp"
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter 6-digit code"
              maxLength={6}
              disabled={loading}
              required
              className="text-center text-lg tracking-widest"
            />
            <p className="text-xs text-muted-foreground text-center">
              Check your email inbox and spam folder
            </p>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Verifying...' : 'Verify Email'}
          </Button>
        </form>

        <div className="mt-6 space-y-4">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Didn&apos;t receive the code?{' '}
              <button
                type="button"
                onClick={handleResendOTP}
                disabled={resending}
                className="text-primary font-medium hover:underline disabled:opacity-50"
              >
                {resending ? 'Resending...' : 'Resend code'}
              </button>
            </p>
          </div>

          <div className="text-center">
            <Link
              href="/login"
              className="text-sm text-muted-foreground hover:text-primary"
            >
              Back to login
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

