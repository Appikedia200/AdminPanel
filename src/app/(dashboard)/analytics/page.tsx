'use client'

import { useState } from 'react'
import { BarChart3 } from 'lucide-react'
import { AnalyticsSummary } from './components/AnalyticsSummary'
import { RevenueChart } from './components/RevenueChart'
import { TopProductsChart } from './components/TopProductsChart'
import { SalesByCategoryChart } from './components/SalesByCategoryChart'
import { DateRangePicker } from './components/DateRangePicker'
import { ExportButton } from './components/ExportButton'

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState<{ from?: string; to?: string }>({})

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <BarChart3 className="h-8 w-8" />
            Analytics
          </h1>
          <p className="text-muted-foreground mt-2">
            Track your store&apos;s performance and insights
          </p>
        </div>
        <div className="flex flex-col gap-4 sm:flex-row">
          <DateRangePicker onDateChange={setDateRange} />
          <ExportButton dateRange={dateRange} />
        </div>
      </div>

      {/* Summary Cards */}
      <AnalyticsSummary dateRange={dateRange} />

      {/* Charts Grid - Row 1 */}
      <div className="grid gap-6 md:grid-cols-2">
        <RevenueChart dateRange={dateRange} />
        <TopProductsChart dateRange={dateRange} />
      </div>

      {/* Charts Grid - Row 2 */}
      <div className="grid gap-6 md:grid-cols-2">
        <SalesByCategoryChart dateRange={dateRange} />
        {/* Future: Add more charts as needed */}
        <div className="hidden md:block" /> {/* Placeholder for balance */}
      </div>
    </div>
  )
}

