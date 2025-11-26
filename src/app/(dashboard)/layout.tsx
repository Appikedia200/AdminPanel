'use client'

import { useState } from 'react'
import { AdminSidebar } from '@/presentation/components/layout/admin-sidebar'
import { AdminHeader } from '@/presentation/components/layout/admin-header'
import { Sheet, SheetContent } from '@/presentation/components/ui/sheet'
import { useAuthGuard } from '@/presentation/hooks/use-auth-guard'
import { useAuth } from '@/presentation/context/auth.context'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  useAuthGuard()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  
  // ✅ Professional: Get user data from Auth Context
  const { user } = useAuth()

  return (
    <div className="flex min-h-screen bg-background">
      {/* Mobile Sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="w-64 p-0">
          <AdminSidebar onNavigate={() => setSidebarOpen(false)} />
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar - Fixed/Sticky */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:z-20 lg:flex lg:w-64 lg:flex-col lg:border-r lg:bg-background lg:shadow-sm">
        <AdminSidebar />
      </aside>

      {/* Main Content - With left margin to account for fixed sidebar */}
      <div className="flex flex-1 flex-col lg:pl-64 w-full">
        <AdminHeader 
          onMenuClick={() => setSidebarOpen(true)} 
          user={user || undefined} // ✅ Pass actual user data from context
        />
        {/* ✅ Smart layout: prevents jumping with proper min-height */}
        <main className="flex-1 w-full p-4 lg:p-6 relative">
          <div className="max-w-[1600px] mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

