'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search, Eye, Download } from 'lucide-react'
import Cookies from 'js-cookie'
import { Button } from '@/presentation/components/ui/button'
import { Input } from '@/presentation/components/ui/input'
import { Card } from '@/presentation/components/ui/card'
import { Badge } from '@/presentation/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/presentation/components/ui/table'
import { Skeleton } from '@/presentation/components/ui/skeleton'
import { useOrders } from '@/presentation/hooks/use-orders'
import { formatCurrency, formatDate } from '@/shared/utils/format'
import { ROUTES } from '@/infrastructure/config/constants'
import { toast } from 'sonner'
import { Pagination } from '@/presentation/components/shared/pagination'

export default function OrdersPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [exporting, setExporting] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  
  const params = {
    search: searchQuery,
    page: currentPage,
    limit: 20,
    ...(statusFilter !== 'all' && { status: statusFilter }),
  }
  
  const { orders, pagination, loading } = useOrders(params)

  const getStatusVariant = (status: string) => {
    if (status === 'delivered') return 'success'
    if (status === 'cancelled') return 'destructive'
    if (status === 'pending') return 'secondary'
    return 'default'
  }

  const getPaymentStatusVariant = (status: string) => {
    if (status === 'paid') return 'success'
    if (status === 'failed') return 'destructive'
    return 'warning'
  }

  const handleExportOrders = async () => {
    setExporting(true)
    const loadingToast = toast.loading('Preparing export...')
    
    try {
      const token = Cookies.get('auth_token')
      
      const queryParams = new URLSearchParams({
        ...(statusFilter !== 'all' && { status: statusFilter }),
        ...(searchQuery && { search: searchQuery })
      })
      
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'https://backendglownaturas.onrender.com'}/api/orders/export?${queryParams}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      )
      
      if (!response.ok) throw new Error('Export failed')
      
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `orders-export-${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
      
      toast.dismiss(loadingToast)
      toast.success('Orders exported successfully')
    } catch {
      toast.dismiss(loadingToast)
      toast.error('Failed to export orders')
    } finally {
      setExporting(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <Card className="p-6 space-y-4">
          {[...Array(10)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Orders</h1>
          <p className="text-muted-foreground mt-2">Manage customer orders</p>
        </div>
        <Button onClick={handleExportOrders} variant="outline" disabled={exporting || orders.length === 0}>
          <Download className="mr-2 h-4 w-4" />
          {exporting ? 'Exporting...' : 'Export to CSV'}
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <Card className="flex-1 p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by order number, customer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </Card>

        <div className="flex gap-2 flex-wrap">
          <Button
            size="sm"
            variant={statusFilter === 'all' ? 'default' : 'outline'}
            onClick={() => setStatusFilter('all')}
          >
            All
          </Button>
          <Button
            size="sm"
            variant={statusFilter === 'pending' ? 'default' : 'outline'}
            onClick={() => setStatusFilter('pending')}
          >
            Pending
          </Button>
          <Button
            size="sm"
            variant={statusFilter === 'processing' ? 'default' : 'outline'}
            onClick={() => setStatusFilter('processing')}
          >
            Processing
          </Button>
          <Button
            size="sm"
            variant={statusFilter === 'shipped' ? 'default' : 'outline'}
            onClick={() => setStatusFilter('shipped')}
          >
            Shipped
          </Button>
          <Button
            size="sm"
            variant={statusFilter === 'delivered' ? 'default' : 'outline'}
            onClick={() => setStatusFilter('delivered')}
          >
            Delivered
          </Button>
        </div>
      </div>

      <Card>
        <div className="hidden md:block">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order Number</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No orders found
                  </TableCell>
                </TableRow>
              ) : (
                orders.map((order) => (
                  <TableRow key={order._id}>
                    <TableCell className="font-medium">{order.orderNumber}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{order.customer.name}</p>
                        <p className="text-sm text-muted-foreground">{order.customer.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>{formatDate(order.createdAt)}</TableCell>
                    <TableCell>{formatCurrency(order.total)}</TableCell>
                    <TableCell>
                      <Badge variant={getPaymentStatusVariant(order.paymentStatus)}>
                        {order.paymentStatus}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(order.status)}>
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={ROUTES.ORDERS_DETAIL(order._id)}>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Mobile View */}
        <div className="md:hidden p-4 space-y-4">
          {orders.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No orders found
            </div>
          ) : (
            orders.map((order) => (
              <Card key={order._id} className="p-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold">{order.orderNumber}</p>
                      <p className="text-sm text-muted-foreground">{order.customer.name}</p>
                    </div>
                    <Badge variant={getStatusVariant(order.status)}>
                      {order.status}
                    </Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Total:</span>
                    <span className="font-medium">{formatCurrency(order.total)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Payment:</span>
                    <Badge variant={getPaymentStatusVariant(order.paymentStatus)}>
                      {order.paymentStatus}
                    </Badge>
                  </div>
                  <Link href={ROUTES.ORDERS_DETAIL(order._id)} className="block">
                    <Button variant="outline" size="sm" className="w-full">
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </Link>
                </div>
              </Card>
            ))
          )}
        </div>
      </Card>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          totalItems={pagination.total}
          itemsPerPage={pagination.limit}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  )
}
