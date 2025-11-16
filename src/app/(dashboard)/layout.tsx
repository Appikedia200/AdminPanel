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
    <div className="flex h-screen overflow-hidden">
      {/* Mobile Sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="w-64 p-0">
          <AdminSidebar onNavigate={() => setSidebarOpen(false)} />
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:border-r">
        <AdminSidebar />
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <AdminHeader onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

