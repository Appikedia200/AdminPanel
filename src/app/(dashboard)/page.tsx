'use client'

import { Package, ShoppingCart, Star, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/presentation/components/ui/card'
import { Skeleton } from '@/presentation/components/ui/skeleton'
import Link from 'next/link'
import { Button } from '@/presentation/components/ui/button'
import { useDashboardStats } from '@/presentation/hooks/use-dashboard-stats'

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
  }).format(amount)
}

export default function DashboardPage() {
  const { stats, loading } = useDashboardStats()

  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16 mb-2" />
                <Skeleton className="h-3 w-32" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  const hasProducts = stats && stats.products.total > 0
  const hasOrders = stats && stats.orders.total > 0
  const hasReviews = stats && stats.reviews.total > 0
  const hasRevenue = stats && stats.orders.revenue > 0

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-2">Welcome to GlowNatura Admin Panel</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.products.total || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {hasProducts ? `${stats.products.active} active` : 'No products added yet'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.orders.total || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {hasOrders ? `${stats.orders.pending} pending` : 'No orders received yet'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.reviews.pending || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {hasReviews ? `${stats.reviews.approved} approved` : 'No pending reviews'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats ? formatCurrency(stats.orders.revenue) : '₦0.00'}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {hasRevenue ? `${stats.orders.completed} completed orders` : 'No sales yet'}
            </p>
          </CardContent>
        </Card>
      </div>

      {!hasProducts && (
        <Card>
          <CardHeader>
            <CardTitle>Getting Started</CardTitle>
            <CardDescription>Set up your store in a few simple steps</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-4 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground font-semibold">
                1
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-1">Add Categories</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Create product categories to organize your skincare catalog
                </p>
                <Link href="/categories">
                  <Button size="sm" variant="outline">
                    Go to Categories
                  </Button>
                </Link>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground font-semibold">
                2
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-1">Add Your First Product</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Create your first product with images, pricing, and inventory details
                </p>
                <Link href="/products/new">
                  <Button size="sm" variant="outline">
                    Create Product
                  </Button>
                </Link>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground font-semibold">
                3
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-1">Configure Store Settings</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Update your store information, contact details, and preferences
                </p>
                <Link href="/settings">
                  <Button size="sm" variant="outline">
                    Open Settings
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
