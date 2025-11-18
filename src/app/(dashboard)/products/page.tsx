'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Plus, Search, MoreHorizontal, Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/presentation/components/ui/button'
import { Input } from '@/presentation/components/ui/input'
import { Badge } from '@/presentation/components/ui/badge'
import { Card } from '@/presentation/components/ui/card'
import { Checkbox } from '@/presentation/components/ui/checkbox'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/presentation/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/presentation/components/ui/dropdown-menu'
import { Skeleton } from '@/presentation/components/ui/skeleton'
import { useProducts } from '@/presentation/hooks/use-products'
import { JewelryFilters } from '@/presentation/components/products/JewelryFilters'
import { formatCurrency } from '@/shared/utils/format'
import { ROUTES } from '@/infrastructure/config/constants'
import { httpClient } from '@/infrastructure/api/client'
import { API_ENDPOINTS } from '@/infrastructure/config/api.config'
import { toast } from 'sonner'
import { Pagination } from '@/presentation/components/shared/pagination'

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])
  const [bulkUpdating, setBulkUpdating] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [jewelryFilters, setJewelryFilters] = useState<Record<string, string | undefined>>({})
  
  const { products, pagination, loading, deleteProduct, refetch } = useProducts({ 
    search: searchQuery,
    page: currentPage,
    limit: 20,
    ...jewelryFilters
  })

  const handleJewelryFilterChange = (key: string, value: string | undefined) => {
    setJewelryFilters(prev => ({
      ...prev,
      [key]: value
    }))
    setCurrentPage(1) // Reset to first page when filters change
  }

  const handleClearJewelryFilters = () => {
    setJewelryFilters({})
    setCurrentPage(1)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      await deleteProduct(id)
    }
  }

  const handleBulkStatusUpdate = async (status: 'active' | 'inactive') => {
    if (!confirm(`${status === 'active' ? 'Activate' : 'Deactivate'} ${selectedProducts.length} products?`)) {
      return
    }

    setBulkUpdating(true)
    try {
      await httpClient.put(API_ENDPOINTS.products.bulkStatus, {
        productIds: selectedProducts,
        status
      })
      
      toast.success(`${selectedProducts.length} products ${status === 'active' ? 'activated' : 'deactivated'}`)
      setSelectedProducts([])
      refetch()
    } catch (error: any) {
      toast.error(error.error || 'Failed to update products')
    } finally {
      setBulkUpdating(false)
    }
  }

  const toggleProductSelection = (productId: string) => {
    setSelectedProducts(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    )
  }

  const toggleSelectAll = () => {
    if (selectedProducts.length === products.length && products.length > 0) {
      setSelectedProducts([])
    } else {
      setSelectedProducts(products.map(p => p._id))
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-10 w-32" />
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Products</h1>
          <p className="text-muted-foreground mt-2">Manage your product inventory</p>
        </div>
        <Link href={ROUTES.PRODUCTS_NEW}>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add New Product
          </Button>
        </Link>
      </div>

      <Card className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </Card>

      {/* Jewelry Filters */}
      <Card className="p-4">
        <JewelryFilters
          filters={jewelryFilters}
          onFilterChange={handleJewelryFilterChange}
          onClearFilters={handleClearJewelryFilters}
        />
      </Card>

      {/* Desktop Table View */}
      <div className="hidden md:block">
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedProducts.length === products.length && products.length > 0}
                    onCheckedChange={toggleSelectAll}
                  />
                </TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No products found
                  </TableCell>
                </TableRow>
              ) : (
                products.map((product) => (
                  <TableRow key={product._id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedProducts.includes(product._id)}
                        onCheckedChange={() => toggleProductSelection(product._id)}
                      />
                    </TableCell>
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
                      <span
                        className={
                          product.stock <= product.lowStockThreshold
                            ? 'text-destructive font-medium'
                            : ''
                        }
                      >
                        {product.stock}
                      </span>
                    </TableCell>
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
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={ROUTES.PRODUCTS_EDIT(product._id)}>
                              <Pencil className="h-4 w-4 mr-2" />
                              Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete(product._id)}
                            className="text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Card>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {products.length === 0 ? (
          <Card className="p-8 text-center text-muted-foreground">
            No products found
          </Card>
        ) : (
          products.map((product) => (
            <Card key={product._id} className="p-4">
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
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-medium">{product.name}</h3>
                      <p className="text-sm text-muted-foreground">{product.sku}</p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={ROUTES.PRODUCTS_EDIT(product._id)}>
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(product._id)}
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
                    <div>
                      <span className="text-muted-foreground">Price: </span>
                      <span className="font-medium">{formatCurrency(product.price)}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Stock: </span>
                      <span
                        className={
                          product.stock <= product.lowStockThreshold
                            ? 'text-destructive font-medium'
                            : 'font-medium'
                        }
                      >
                        {product.stock}
                      </span>
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
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

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

      {/* Bulk Action Toolbar */}
      {selectedProducts.length > 0 && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground px-6 py-3 rounded-lg shadow-lg flex items-center gap-4 z-50">
          <span className="font-medium">{selectedProducts.length} product{selectedProducts.length > 1 ? 's' : ''} selected</span>
          
          <Button
            variant="secondary"
            size="sm"
            onClick={() => handleBulkStatusUpdate('active')}
            disabled={bulkUpdating}
          >
            Activate
          </Button>
          
          <Button
            variant="secondary"
            size="sm"
            onClick={() => handleBulkStatusUpdate('inactive')}
            disabled={bulkUpdating}
          >
            Deactivate
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedProducts([])}
            className="hover:bg-primary-foreground/10"
          >
            Cancel
          </Button>
        </div>
      )}
    </div>
  )
}

