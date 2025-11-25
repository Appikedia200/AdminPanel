'use client'

import { useState } from 'react'
import { AdminSidebar } from '@/presentation/components/layout/admin-sidebar'
import { AdminHeader } from '@/presentation/components/layout/admin-header'
import { Sheet, SheetContent } from '@/presentation/components/ui/sheet'
import { useAuthGuard } from '@/presentation/hooks/use-auth-guard'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  useAuthGuard()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex min-h-screen">
      {/* Mobile Sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="w-64 p-0">
          <AdminSidebar onNavigate={() => setSidebarOpen(false)} />
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar - Fixed/Sticky */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:z-20 lg:flex lg:w-64 lg:flex-col lg:border-r lg:bg-background">
        <AdminSidebar />
      </aside>

      {/* Main Content - With left margin to account for fixed sidebar */}
      <div className="flex flex-1 flex-col lg:pl-64">
        <AdminHeader onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

