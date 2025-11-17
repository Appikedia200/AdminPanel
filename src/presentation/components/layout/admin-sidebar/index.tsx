'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Package, FolderTree, Star, ShoppingCart, Image, Settings, Mail, Sparkles } from 'lucide-react'
import { cn } from '@/shared/utils/cn'
import { Separator } from '@/presentation/components/ui/separator'
import { usePendingReviewsCount } from '@/presentation/hooks/use-pending-reviews-count'

const menuItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/products', label: 'Products', icon: Package },
  { href: '/categories', label: 'Categories', icon: FolderTree },
  { href: '/reviews', label: 'Reviews', icon: Star, badgeKey: 'reviews' },
  { href: '/orders', label: 'Orders', icon: ShoppingCart },
  { href: '/media', label: 'Media', icon: Image },
  { href: '/email-templates', label: 'Email Templates', icon: Mail },
  { href: '/settings', label: 'Settings', icon: Settings },
]

interface AdminSidebarProps {
  onNavigate?: () => void
}

export function AdminSidebar({ onNavigate }: AdminSidebarProps) {
  const pathname = usePathname()
  const { count: pendingReviewsCount } = usePendingReviewsCount()
  
  const getBadgeValue = (item: typeof menuItems[0]) => {
    if (item.badgeKey === 'reviews') return pendingReviewsCount
    return null
  }

  return (
    <div className="flex h-full flex-col gap-2">
      <div className="flex h-16 items-center border-b px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Sparkles className="h-6 w-6 text-primary" />
          <span className="text-lg">GlowNatura</span>
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid gap-1 px-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon
            
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onNavigate}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-accent touch-target',
                  isActive ? 'bg-accent text-accent-foreground' : 'text-muted-foreground'
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
                {(() => {
                  const badgeValue = getBadgeValue(item)
                  return badgeValue !== null && badgeValue > 0 && (
                    <span className="ml-auto flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
                      {badgeValue}
                    </span>
                  )
                })()}
              </Link>
            )
          })}
        </nav>
      </div>
      <Separator />
      <div className="p-4">
        <div className="rounded-lg bg-muted p-3 text-sm">
          <p className="font-medium">Admin Panel</p>
          <p className="text-xs text-muted-foreground mt-1">
            v1.0.0
          </p>
        </div>
      </div>
    </div>
  )
}

