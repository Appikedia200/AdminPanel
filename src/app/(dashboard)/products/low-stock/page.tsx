'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, AlertTriangle, Pencil, Package } from 'lucide-react'
import { Button } from '@/presentation/components/ui/button'
import { Badge } from '@/presentation/components/ui/badge'
import { Card } from '@/presentation/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/presentation/components/ui/table'
import { Skeleton } from '@/presentation/components/ui/skeleton'
import { httpClient } from '@/infrastructure/api/client'
import { API_ENDPOINTS } from '@/infrastructure/config/api.config'
import { formatCurrency } from '@/shared/utils/format'
import { ROUTES } from '@/infrastructure/config/constants'
import { toast } from 'sonner'
import type { Product } from '@/core/entities/product.entity'

export default function LowStockProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchLowStockProducts()
  }, [])

  const fetchLowStockProducts = async () => {
    setLoading(true)
    try {
      const response: any = await httpClient.get(API_ENDPOINTS.products.lowStock)
      
      if (response.success) {
        setProducts(response.data || [])
      }
    } catch (error: any) {
      toast.error(error.error || 'Failed to load low stock products')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-10 w-48" />
        </div>
        <Card>
          <div className="p-6 space-y-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href={ROUTES.PRODUCTS}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <AlertTriangle className="h-8 w-8 text-amber-600" />
            Low Stock Products
          </h1>
          <p className="text-muted-foreground mt-2">
            Products that are running low on stock and need restocking
          </p>
        </div>
      </div>

      {products.length === 0 ? (
        <Card className="p-12 text-center">
          <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">All Stocked Up!</h2>
          <p className="text-muted-foreground">
            No products are currently running low on stock. Great job! 🎉
          </p>
          <Link href={ROUTES.PRODUCTS}>
            <Button className="mt-6">
              View All Products
            </Button>
          </Link>
        </Card>
      ) : (
        <>
          <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 rounded-lg p-4 flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-amber-900 dark:text-amber-100">
                {products.length} Product{products.length !== 1 ? 's' : ''} Need{products.length === 1 ? 's' : ''} Attention
              </h3>
              <p className="text-sm text-amber-800 dark:text-amber-200 mt-1">
                These products have stock levels at or below their low stock threshold. 
                Consider restocking to avoid running out.
              </p>
            </div>
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block">
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Current Stock</TableHead>
                    <TableHead>Threshold</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product._id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {product.images[0]?.url && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={product.images[0].url}
                              alt={product.name}
                              className="h-10 w-10 rounded object-cover"
                            />
                          )}
                          <div>
                            <p className="font-medium">{product.name}</p>
                            <p className="text-sm text-muted-foreground">{product.sku}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {typeof product.category === 'string' ? product.category : product.category.name}
                      </TableCell>
                      <TableCell>{formatCurrency(product.price)}</TableCell>
                      <TableCell>
                        <span className="text-destructive font-semibold text-base">
                          {product.stock}
                        </span>
                      </TableCell>
                      <TableCell>{product.lowStockThreshold}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            product.status === 'active'
                              ? 'success'
                              : product.status === 'inactive'
                              ? 'secondary'
                              : 'outline'
                          }
                        >
                          {product.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Link href={ROUTES.PRODUCTS_EDIT(product._id)}>
                          <Button variant="outline" size="sm">
                            <Pencil className="h-4 w-4 mr-2" />
                            Update Stock
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-4">
            {products.map((product) => (
              <Card key={product._id} className="p-4 border-l-4 border-l-amber-500">
                <div className="flex gap-4">
                  {product.images[0]?.url && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={product.images[0].url}
                      alt={product.name}
                      className="h-20 w-20 rounded object-cover"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <h3 className="font-medium">{product.name}</h3>
                        <p className="text-sm text-muted-foreground">{product.sku}</p>
                      </div>
                      <Badge
                        variant={
                          product.status === 'active'
                            ? 'success'
                            : product.status === 'inactive'
                            ? 'secondary'
                            : 'outline'
                        }
                      >
                        {product.status}
                      </Badge>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Price:</span>
                        <span className="font-medium">{formatCurrency(product.price)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Current Stock:</span>
                        <span className="text-destructive font-semibold">{product.stock}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Threshold:</span>
                        <span className="font-medium">{product.lowStockThreshold}</span>
                      </div>
                    </div>
                    <Link href={ROUTES.PRODUCTS_EDIT(product._id)} className="mt-3 block">
                      <Button variant="outline" size="sm" className="w-full">
                        <Pencil className="h-4 w-4 mr-2" />
                        Update Stock
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

