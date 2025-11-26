'use client'

import { FolderTree } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/presentation/components/ui/card'
import { Skeleton } from '@/presentation/components/ui/skeleton'
import { useSalesByCategory } from '@/presentation/hooks/use-analytics'
import { formatCurrency } from '@/shared/utils/format'
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'

interface SalesByCategoryChartProps {
  dateRange: { from?: string; to?: string }
}

const COLORS = [
  'hsl(142, 76%, 36%)', // Green
  'hsl(221, 83%, 53%)', // Blue
  'hsl(262, 83%, 58%)', // Purple
  'hsl(31, 97%, 72%)',  // Orange
  'hsl(346, 77%, 49%)', // Red
  'hsl(198, 88%, 48%)', // Cyan
  'hsl(48, 96%, 53%)',  // Yellow
  'hsl(280, 87%, 47%)', // Magenta
]

export function SalesByCategoryChart({ dateRange }: SalesByCategoryChartProps) {
  const { data, loading, error } = useSalesByCategory(dateRange)

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      const percentage = ((data.totalSales / payload[0].payload.totalRevenue) * 100).toFixed(1)
      
      return (
        <div className="rounded-lg border bg-background p-2 shadow-md">
          <div className="grid gap-2">
            <div className="flex flex-col">
              <span className="text-[0.70rem] uppercase text-muted-foreground">
                Category
              </span>
              <span className="font-bold">
                {data.categoryName}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-[0.70rem] uppercase text-muted-foreground">
                Revenue
              </span>
              <span className="font-bold text-green-600">
                {formatCurrency(data.totalSales)}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-[0.70rem] uppercase text-muted-foreground">
                Items Sold
              </span>
              <span className="font-bold text-blue-600">
                {data.itemsSold}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-[0.70rem] uppercase text-muted-foreground">
                Percentage
              </span>
              <span className="font-bold">
                {percentage}%
              </span>
            </div>
          </div>
        </div>
      )
    }
    return null
  }

  const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    const RADIAN = Math.PI / 180
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        className="text-xs font-semibold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    )
  }

  // Calculate total revenue for percentage calculation
  const totalRevenue = data.reduce((sum, item) => sum + item.totalSales, 0)
  const chartData = data.map(item => ({ ...item, totalRevenue }))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sales by Category</CardTitle>
        <CardDescription>Revenue distribution across categories</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-[350px] w-full" />
          </div>
        ) : error || !data || data.length === 0 ? (
          <div className="flex h-[350px] items-center justify-center text-muted-foreground">
            <div className="text-center">
              <FolderTree className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>{error || 'No category sales data available'}</p>
            </div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={CustomLabel}
                outerRadius={120}
                fill="#8884d8"
                dataKey="totalSales"
                nameKey="categoryName"
              >
                {chartData.map((_entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="bottom"
                height={36}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}

