'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Sparkles } from 'lucide-react'
import Cookies from 'js-cookie'
import { Button } from '@/presentation/components/ui/button'
import { Input } from '@/presentation/components/ui/input'
import { Label } from '@/presentation/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/presentation/components/ui/card'
import { Checkbox } from '@/presentation/components/ui/checkbox'
import { httpClient } from '@/infrastructure/api/client'
import { API_ENDPOINTS } from '@/infrastructure/config/api.config'
import { toast } from 'sonner'

// Generate unique device ID
const getDeviceId = () => {
  let deviceId = Cookies.get('device_id')
  if (!deviceId) {
    deviceId = `device_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    Cookies.set('device_id', deviceId, { expires: 365 }) // Store for 1 year
  }
  return deviceId
}

export default function LoginPage() {
  const router = useRouter()
  const [step, setStep] = useState<'credentials' | 'otp'>('credentials')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [otp, setOtp] = useState('')
  const [rememberDevice, setRememberDevice] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !password) {
      toast.error('Please fill in all fields')
      return
    }

    setLoading(true)

    try {
      const deviceId = getDeviceId()
      
      const response: any = await httpClient.post(API_ENDPOINTS.auth.login, {
        email,
        password,
        deviceId, // Backend might skip OTP if device is recognized
      })

      if (response.success) {
        // Check if backend returned token directly (trusted device)
        if (response.token) {
          // Set cookie with appropriate expiry
          const cookieExpiry = rememberDevice ? 30 : undefined
          Cookies.set('auth_token', response.token, { expires: cookieExpiry })
          
          toast.success('Login successful')
          router.push('/')
        } else {
          // OTP sent to email - move to step 2
          toast.success('OTP sent to your email')
          setStep('otp')
        }
      }
    } catch (error: any) {
      toast.error(error.error || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!otp || otp.length < 6) {
      toast.error('Please enter a valid OTP code')
      return
    }

    setLoading(true)

    try {
      const deviceId = getDeviceId()
      
      const response: any = await httpClient.post(API_ENDPOINTS.auth.verifyOtp, {
        email,
        otp,
        deviceId,
      })

      if (response.success && response.token) {
        // Set cookie with appropriate expiry
        const cookieExpiry = rememberDevice ? 30 : undefined
        Cookies.set('auth_token', response.token, { expires: cookieExpiry })
        
        toast.success('Login successful')
        router.push('/')
      }
    } catch (error: any) {
      toast.error(error.error || 'Invalid OTP code')
    } finally {
      setLoading(false)
    }
  }

  const handleResendOTP = async () => {
    try {
      await httpClient.post(API_ENDPOINTS.auth.login, {
        email,
        password,
        deviceId: getDeviceId(),
      })
      
      toast.success('OTP resent to your email')
    } catch (error: any) {
      toast.error(error.error || 'Failed to resend OTP')
    }
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
          <CardTitle className="text-2xl">GlowNatura Admin</CardTitle>
          <CardDescription>
            {step === 'credentials' ? 'Sign in to manage your store' : 'Enter the verification code'}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        {step === 'credentials' ? (
          <form onSubmit={handleCredentialsSubmit} className="space-y-4">
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
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link 
                  href="/forgot-password" 
                  className="text-sm text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                required
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="remember"
                checked={rememberDevice}
                onCheckedChange={(checked) => setRememberDevice(checked === true)}
              />
              <label
                htmlFor="remember"
                className="text-sm text-muted-foreground cursor-pointer"
              >
                Remember this device for 30 days
              </label>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleOtpSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="otp">Verification Code</Label>
              <Input
                id="otp"
                type="text"
                placeholder="Enter 6-digit code"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength={6}
                disabled={loading}
                required
                className="text-center text-lg tracking-widest"
              />
              <p className="text-xs text-muted-foreground text-center">
                Code sent to {email}
              </p>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Verifying...' : 'Verify & Login'}
            </Button>

            <div className="text-center">
              <button
                type="button"
                onClick={handleResendOTP}
                className="text-sm text-primary hover:underline"
              >
                Resend code
              </button>
            </div>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setStep('credentials')}
                className="text-sm text-muted-foreground hover:text-primary"
              >
                Back to login
              </button>
            </div>
          </form>
        )}

        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-primary font-medium hover:underline">
              Create account
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
