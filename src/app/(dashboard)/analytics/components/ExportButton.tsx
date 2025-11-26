'use client'

import { useState } from 'react'
import { Download, FileSpreadsheet, FileText } from 'lucide-react'
import { Button } from '@/presentation/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/presentation/components/ui/dropdown-menu'
import { useExportAnalytics } from '@/presentation/hooks/use-analytics'
import { exportToCSV } from '@/shared/utils/export-csv'
import { exportToExcel } from '@/shared/utils/export-excel'
import { toast } from 'sonner'

interface ExportButtonProps {
  dateRange: { from?: string; to?: string }
}

export function ExportButton({ dateRange }: ExportButtonProps) {
  const { exportData, loading } = useExportAnalytics()
  const [exportType, setExportType] = useState<'orders' | 'products' | 'revenue' | null>(null)

  const handleExport = async (
    type: 'orders' | 'products' | 'revenue',
    format: 'csv' | 'excel'
  ) => {
    setExportType(type)
    
    try {
      const result = await exportData(type, dateRange)
      
      if (!result) {
        return // Error already shown by the hook
      }

      if (!result.data || result.data.length === 0) {
        toast.error('No data available to export')
        return
      }

      // Format filename
      const filename = `${type}-analytics-${result.dateRange?.from || 'all'}`

      // Export based on format
      if (format === 'csv') {
        exportToCSV(result.data, filename)
        toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} exported to CSV successfully`)
      } else {
        exportToExcel(result.data, filename, type.charAt(0).toUpperCase() + type.slice(1))
        toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} exported to Excel successfully`)
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to export data')
    } finally {
      setExportType(null)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" disabled={loading}>
          {loading ? (
            <>
              <Download className="mr-2 h-4 w-4 animate-spin" />
              Exporting...
            </>
          ) : (
            <>
              <Download className="mr-2 h-4 w-4" />
              Export Data
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Export Options</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
          Orders
        </DropdownMenuLabel>
        <DropdownMenuItem
          onClick={() => handleExport('orders', 'csv')}
          disabled={loading && exportType === 'orders'}
        >
          <FileText className="mr-2 h-4 w-4" />
          Export Orders (CSV)
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleExport('orders', 'excel')}
          disabled={loading && exportType === 'orders'}
        >
          <FileSpreadsheet className="mr-2 h-4 w-4" />
          Export Orders (Excel)
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
          Products
        </DropdownMenuLabel>
        <DropdownMenuItem
          onClick={() => handleExport('products', 'csv')}
          disabled={loading && exportType === 'products'}
        >
          <FileText className="mr-2 h-4 w-4" />
          Export Products (CSV)
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleExport('products', 'excel')}
          disabled={loading && exportType === 'products'}
        >
          <FileSpreadsheet className="mr-2 h-4 w-4" />
          Export Products (Excel)
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
          Revenue
        </DropdownMenuLabel>
        <DropdownMenuItem
          onClick={() => handleExport('revenue', 'csv')}
          disabled={loading && exportType === 'revenue'}
        >
          <FileText className="mr-2 h-4 w-4" />
          Export Revenue (CSV)
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleExport('revenue', 'excel')}
          disabled={loading && exportType === 'revenue'}
        >
          <FileSpreadsheet className="mr-2 h-4 w-4" />
          Export Revenue (Excel)
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

