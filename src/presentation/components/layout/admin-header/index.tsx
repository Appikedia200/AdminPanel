'use client'

import { Menu, Bell, LogOut, User, X } from 'lucide-react'
import { Button } from '@/presentation/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/presentation/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/presentation/components/ui/avatar'
import { AuthServiceImpl } from '@/infrastructure/repositories/auth.service.impl'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { ROUTES } from '@/infrastructure/config/constants'
import { useNotifications } from '@/presentation/hooks/use-notifications'
import { formatDistanceToNow } from 'date-fns'

interface AdminHeaderProps {
  onMenuClick: () => void
  user?: {
    name: string
    email: string
    avatar?: string
  }
}

export function AdminHeader({ onMenuClick, user }: AdminHeaderProps) {
  const router = useRouter()
  const authService = new AuthServiceImpl()
  
  // ✅ Professional: Use real notifications hook
  const { 
    notifications, 
    unreadCount, 
    isLoading: notificationsLoading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  } = useNotifications()

  const handleLogout = async () => {
    try {
      await authService.logout()
      toast.success('Logged out successfully')
      router.push('/login')
    } catch (error) {
      toast.error('Logout failed')
      console.error('Logout error:', error)
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const handleNotificationClick = (notification: any) => {
    // Mark as read
    if (!notification.isRead) {
      markAsRead(notification._id)
    }
    
    // Navigate based on notification type
    if (notification.type === 'review' && notification.relatedId) {
      router.push(ROUTES.REVIEWS)
    } else if (notification.type === 'order' && notification.relatedId) {
      router.push(ROUTES.ORDERS_DETAIL(notification.relatedId))
    } else if (notification.type === 'product' && notification.relatedId) {
      router.push(ROUTES.PRODUCTS_EDIT(notification.relatedId))
    }
  }

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 lg:px-6">
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        onClick={onMenuClick}
      >
        <Menu className="h-6 w-6" />
        <span className="sr-only">Toggle menu</span>
      </Button>

      <div className="flex-1" />

      {/* ✅ Professional: Real Notifications */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
            <span className="sr-only">Notifications</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-96" align="end" forceMount>
          <div className="flex items-center justify-between px-4 py-2">
            <DropdownMenuLabel className="p-0">Notifications</DropdownMenuLabel>
            {unreadCount > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-auto p-0 text-xs"
                onClick={(e) => {
                  e.stopPropagation()
                  markAllAsRead()
                }}
              >
                Mark all as read
              </Button>
            )}
          </div>
          <DropdownMenuSeparator />
          <div className="max-h-96 overflow-y-auto">
            {notificationsLoading ? (
              <div className="flex items-center justify-center py-8 text-sm text-muted-foreground">
                Loading notifications...
              </div>
            ) : notifications.length === 0 ? (
              <div className="flex items-center justify-center py-8 text-sm text-muted-foreground">
                No notifications
              </div>
            ) : (
              notifications.map((notification) => (
                <div key={notification._id} className="relative group">
                  <DropdownMenuItem 
                    className="flex flex-col items-start py-3 cursor-pointer pr-8"
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="flex items-start gap-3 w-full">
                      {!notification.isRead && (
                        <div className="h-2 w-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                      )}
                      {notification.isRead && (
                        <div className="h-2 w-2 rounded-full bg-transparent mt-2 flex-shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm ${!notification.isRead ? 'font-medium' : ''}`}>
                          {notification.title}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                          {notification.message}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                  </DropdownMenuItem>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation()
                      deleteNotification(notification._id)
                    }}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                  <DropdownMenuSeparator />
                </div>
              ))
            )}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-10 w-10 rounded-full">
            <Avatar className="h-10 w-10">
              <AvatarImage src={user?.avatar} alt={user?.name} />
              <AvatarFallback className="bg-primary/10 text-primary">
                {user ? getInitials(user.name) : 'AU'}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">
                {user?.name || 'Admin User'}
              </p>
              <p className="text-xs leading-none text-muted-foreground">
                {user?.email || 'admin@glownatura.com'}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => router.push(ROUTES.PROFILE)}>
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}

