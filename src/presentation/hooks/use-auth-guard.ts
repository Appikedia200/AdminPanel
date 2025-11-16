'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'
import { AUTH_TOKEN_KEY } from '@/infrastructure/config/constants'

export function useAuthGuard() {
  const router = useRouter()

  useEffect(() => {
    const token = Cookies.get(AUTH_TOKEN_KEY)
    if (!token) {
      router.push('/login')
    }
  }, [router])
}

