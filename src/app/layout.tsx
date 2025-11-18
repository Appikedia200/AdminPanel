import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from 'sonner'
import { AuthProviderWrapper } from '@/presentation/components/providers/auth-provider-wrapper'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'GlowNatura Admin',
  description: 'Professional admin dashboard for GlowNatura e-commerce platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthProviderWrapper>
          {children}
        </AuthProviderWrapper>
        <Toaster position="top-right" richColors closeButton />
      </body>
    </html>
  )
}

