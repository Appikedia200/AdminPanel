'use client'

import { ShoppingCart, DollarSign, Package, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/presentation/components/ui/card'
import { Skeleton } from '@/presentation/components/ui/skeleton'
import { useAnalyticsSummary } from '@/presentation/hooks/use-analytics'
import { formatCurrency } from '@/shared/utils/format'

interface AnalyticsSummaryProps {
  dateRange: { from?: string; to?: string }
}

export function AnalyticsSummary({ dateRange }: AnalyticsSummaryProps) {
  const { data, loading, error } = useAnalyticsSummary(dateRange)

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-20 mb-2" />
              <Skeleton className="h-3 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>{error || 'Failed to load analytics summary'}</p>
      </div>
    )
  }

  const summaryCards = [
    {
      title: 'Total Revenue',
      value: formatCurrency(data.totalRevenue),
      description: `From ${data.totalOrders} orders`,
      icon: DollarSign,
      color: 'text-green-600',
    },
    {
      title: 'Total Orders',
      value: data.totalOrders.toString(),
      description: `${data.paidOrders} paid, ${data.pendingOrders} pending`,
      icon: ShoppingCart,
      color: 'text-blue-600',
    },
    {
      title: 'Items Sold',
      value: data.totalItemsSold.toString(),
      description: 'Total quantity sold',
      icon: Package,
      color: 'text-purple-600',
    },
    {
      title: 'Average Order Value',
      value: formatCurrency(data.averageOrderValue),
      description: 'Per order',
      icon: TrendingUp,
      color: 'text-orange-600',
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {summaryCards.map((card) => {
        const Icon = card.icon
        return (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
              <Icon className={`h-4 w-4 ${card.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {card.description}
              </p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

