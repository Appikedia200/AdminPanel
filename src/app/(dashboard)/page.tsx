'use client'

import { useState } from 'react'
import { Package, ShoppingCart, Star, TrendingUp, ArrowRight, Clock } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/presentation/components/ui/card'
import { Skeleton } from '@/presentation/components/ui/skeleton'
import { Badge } from '@/presentation/components/ui/badge'
import Link from 'next/link'
import { Button } from '@/presentation/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/presentation/components/ui/select'
import { useDashboardStats, useRecentOrders, useTopProducts } from '@/presentation/hooks/use-dashboard'
import { formatCurrency } from '@/shared/utils/format'
import { ROUTES } from '@/infrastructure/config/constants'

export default function DashboardPage() {
  const [period, setPeriod] = useState<'today' | 'week' | 'month' | 'year'>('month')
  const { stats, loading: statsLoading } = useDashboardStats(period)
  const { orders: recentOrders, loading: ordersLoading } = useRecentOrders(5)
  const { products: topProducts, loading: productsLoading } = useTopProducts('month', 5)

  if (statsLoading && !stats) {
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

  const hasProducts = stats && stats.totalProducts > 0
  const hasOrders = stats && stats.totalOrders > 0
  const hasRevenue = stats && stats.totalRevenue > 0

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'pending':
        return 'outline'
      case 'confirmed':
      case 'delivered':
        return 'success'
      case 'processing':
      case 'shipped':
        return 'default'
      case 'cancelled':
        return 'destructive'
      default:
        return 'outline'
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-2">Welcome to GlowNatura Admin Panel</p>
        </div>
        <Select value={period} onValueChange={(value: 'today' | 'week' | 'month' | 'year') => setPeriod(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
            <SelectItem value="year">This Year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalProducts || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats?.lowStockProducts ? `${stats.lowStockProducts} low stock` : 'No products added yet'}
            </p>
            {stats && stats.lowStockProducts > 0 && (
              <Link href={ROUTES.PRODUCTS_LOW_STOCK}>
                <Button variant="link" size="sm" className="h-auto p-0 mt-2 text-xs">
                  View low stock <ArrowRight className="ml-1 h-3 w-3" />
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalOrders || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {hasOrders ? `${stats.pendingOrders || 0} pending` : 'No orders received yet'}
            </p>
            {stats && stats.ordersChange !== undefined && (
              <p className={`text-xs mt-2 flex items-center gap-1 ${stats.ordersChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {stats.ordersChange >= 0 ? '↑' : '↓'} {Math.abs(stats.ordersChange)}% from last period
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.pendingReviews || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats?.totalReviews ? `${stats.totalReviews} total reviews` : 'No pending reviews'}
            </p>
            {stats && stats.pendingReviews > 0 && (
              <Link href={ROUTES.REVIEWS}>
                <Button variant="link" size="sm" className="h-auto p-0 mt-2 text-xs">
                  Review now <ArrowRight className="ml-1 h-3 w-3" />
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats ? formatCurrency(stats.totalRevenue) : '₦0.00'}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {hasRevenue ? `From ${stats.totalOrders} orders` : 'No sales yet'}
            </p>
            {stats && stats.revenueChange !== undefined && (
              <p className={`text-xs mt-2 flex items-center gap-1 ${stats.revenueChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {stats.revenueChange >= 0 ? '↑' : '↓'} {Math.abs(stats.revenueChange)}% from last period
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {!hasProducts ? (
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
                <Link href={ROUTES.CATEGORIES}>
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
                <Link href={ROUTES.PRODUCTS_NEW}>
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
                <Link href={ROUTES.SETTINGS}>
                  <Button size="sm" variant="outline">
                    Open Settings
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Recent Orders Widget */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Recent Orders</CardTitle>
                <Link href={ROUTES.ORDERS}>
                  <Button variant="ghost" size="sm">
                    View All <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {ordersLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : recentOrders.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Clock className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No recent orders</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <Link key={order._id} href={ROUTES.ORDERS_DETAIL(order._id)}>
                      <div className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent/50 transition-colors cursor-pointer">
                        <div className="space-y-1">
                          <p className="font-medium text-sm">{order.orderNumber}</p>
                          <p className="text-xs text-muted-foreground">{order.customer.name}</p>
                        </div>
                        <div className="text-right space-y-1">
                          <p className="font-semibold text-sm">{formatCurrency(order.total)}</p>
                          <Badge variant={getStatusBadgeVariant(order.status)}>
                            {order.status}
                          </Badge>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Top Products Widget */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Top Selling Products</CardTitle>
                <Link href={ROUTES.PRODUCTS}>
                  <Button variant="ghost" size="sm">
                    View All <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {productsLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : topProducts.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Package className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No sales data available</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {topProducts.map((item) => (
                    <Link key={item.product._id} href={ROUTES.PRODUCTS_EDIT(item.product._id)}>
                      <div className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent/50 transition-colors cursor-pointer">
                        <div className="flex items-center gap-3">
                          {item.product.images?.[0]?.url && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={item.product.images[0].url}
                              alt={item.product.name}
                              className="h-10 w-10 rounded object-cover"
                            />
                          )}
                          <div className="space-y-1">
                            <p className="font-medium text-sm">{item.product.name}</p>
                            <p className="text-xs text-muted-foreground">{item.totalSold} sold</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-sm">{formatCurrency(item.revenue)}</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
