'use client'

import { useState } from 'react'
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core'
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, Plus, Search, X, AlertCircle, Eye, EyeOff } from 'lucide-react'
import { Button } from '@/presentation/components/ui/button'
import { Input } from '@/presentation/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/presentation/components/ui/card'
import { Badge } from '@/presentation/components/ui/badge'
import { Skeleton } from '@/presentation/components/ui/skeleton'
import { useHomepageSections } from '@/presentation/hooks/use-homepage-sections'
import { useProducts } from '@/presentation/hooks/use-products'
import type { HomepageSection, Product } from '@/shared/types/entity.types'
import { formatCurrency } from '@/shared/utils/format'
import { toast } from 'sonner'

// Sortable Product Item Component
function SortableProductItem({ product, onRemove }: { product: Product; onRemove: () => void }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: product._id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  // ✅ Professional null-safe image URL extraction
  const productImage = product.images?.[0]
  const imageUrl = (() => {
    if (!productImage || typeof productImage !== 'object' || !('mediaId' in productImage)) {
      return '/placeholder-image.png'
    }
    const mediaId = productImage.mediaId as any
    // Handle both null and valid mediaId objects
    if (!mediaId || typeof mediaId !== 'object' || !('cloudinaryUrl' in mediaId)) {
      return '/placeholder-image.png'
    }
    return (mediaId.cloudinaryUrl as string) || '/placeholder-image.png'
  })()

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="grid grid-cols-[auto_auto_1fr_auto] items-center gap-3 p-3 bg-card border rounded-lg"
    >
      <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing flex-shrink-0">
        <GripVertical className="h-5 w-5 text-muted-foreground" />
      </div>
      
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={imageUrl}
        alt={product.name}
        className="h-12 w-12 rounded object-cover flex-shrink-0"
      />
      
      <div className="min-w-0 overflow-hidden">
        <p className="font-medium truncate">{product.name}</p>
        <div className="flex items-center gap-2 text-sm flex-wrap">
          <span className="text-muted-foreground whitespace-nowrap">{formatCurrency(product.price)}</span>
          {product.stock === 0 && (
            <Badge variant="destructive" className="text-xs whitespace-nowrap">Out of Stock</Badge>
          )}
          {product.stock > 0 && product.stock <= 10 && (
            <Badge variant="outline" className="text-xs border-orange-500 text-orange-500 whitespace-nowrap">Low Stock</Badge>
          )}
        </div>
      </div>

      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={onRemove}
        className="flex-shrink-0"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  )
}

// Section Card Component
function SectionCard({ section, onAddProducts, onRemoveProduct, onReorder, onToggleActive }: {
  section: HomepageSection
  onAddProducts: (type: string) => void
  onRemoveProduct: (type: string, productId: string) => void
  onReorder: (type: string, productIds: string[]) => void
  onToggleActive: (type: string) => void
}) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const products = (section.products || []).filter((p): p is Product => typeof p !== 'string')
  const productIds = products.map(p => p._id)

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = productIds.indexOf(active.id as string)
      const newIndex = productIds.indexOf(over.id as string)
      const newOrder = arrayMove(productIds, oldIndex, newIndex)
      onReorder(section.type, newOrder)
    }
  }

  const sectionActive = section.active !== undefined ? section.active : section.isActive

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CardTitle className="capitalize">{section.title}</CardTitle>
            <Badge variant={sectionActive ? 'success' : 'secondary'}>
              {sectionActive ? 'Active' : 'Inactive'}
            </Badge>
            <Badge variant="outline">
              {products.length}/{section.maxProducts} Products
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onToggleActive(section.type)}
            >
              {sectionActive ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
              {sectionActive ? 'Hide' : 'Show'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onAddProducts(section.type)}
              disabled={products.length >= section.maxProducts}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Products
            </Button>
          </div>
        </div>
        {section.subtitle && (
          <p className="text-sm text-muted-foreground">{section.subtitle}</p>
        )}
      </CardHeader>
      <CardContent>
        {products.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <AlertCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No products added yet</p>
            <p className="text-sm mt-1">Click &quot;Add Products&quot; to get started</p>
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={productIds} strategy={verticalListSortingStrategy}>
              <div className="space-y-2">
                {products.map((product) => (
                  <SortableProductItem
                    key={product._id}
                    product={product}
                    onRemove={() => onRemoveProduct(section.type, product._id)}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </CardContent>
    </Card>
  )
}

// Product Selection Modal
function ProductSelectionModal({ 
  isOpen, 
  onClose, 
  onSelect,
  excludeIds = [],
}: {
  isOpen: boolean
  onClose: () => void
  onSelect: (productIds: string[]) => void
  excludeIds?: string[]
}) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const { products, loading } = useProducts({ search: searchQuery, limit: 50 })

  const availableProducts = products.filter(p => 
    !excludeIds.includes(p._id) && 
    p.status === 'active' &&
    p.stock > 0
  )

  const handleSelect = () => {
    onSelect(selectedIds)
    setSelectedIds([])
    setSearchQuery('')
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[95vw] sm:w-full max-w-3xl max-h-[85vh] overflow-hidden">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Select Products</CardTitle>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="relative mt-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardHeader>
          <CardContent className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="space-y-2">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : availableProducts.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <p>No products found</p>
              </div>
            ) : (
              <div className="space-y-2">
                {availableProducts.map((product) => {
                  // ✅ Professional null-safe image URL extraction
                  const productImage = product.images?.[0]
                  const imageUrl = (() => {
                    if (!productImage || typeof productImage !== 'object' || !('mediaId' in productImage)) {
                      return '/placeholder-image.png'
                    }
                    const mediaId = productImage.mediaId as any
                    // Handle both null and valid mediaId objects
                    if (!mediaId || typeof mediaId !== 'object' || !('cloudinaryUrl' in mediaId)) {
                      return '/placeholder-image.png'
                    }
                    return (mediaId.cloudinaryUrl as string) || '/placeholder-image.png'
                  })()
                  const isSelected = selectedIds.includes(product._id)

                  return (
                    <button
                      key={product._id}
                      type="button"
                      onClick={() => {
                        setSelectedIds(prev =>
                          prev.includes(product._id)
                            ? prev.filter(id => id !== product._id)
                            : [...prev, product._id]
                        )
                      }}
                      className={`w-full flex items-center gap-3 p-3 border rounded-lg text-left transition-colors ${
                        isSelected ? 'bg-primary/10 border-primary' : 'hover:bg-accent'
                      }`}
                    >
                      {/* Image */}
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={imageUrl}
                        alt={product.name}
                        className="w-16 h-16 rounded object-cover flex-shrink-0"
                      />
                      
                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm leading-tight mb-1.5">
                          {product.name}
                        </h4>
                        <p className="text-sm text-primary font-semibold">
                          {formatCurrency(product.price)}
                        </p>
                      </div>
                      
                      {/* Checkbox/Selection Indicator */}
                      <div className="flex-shrink-0">
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                          isSelected 
                            ? 'bg-primary border-primary' 
                            : 'border-gray-300'
                        }`}>
                          {isSelected && (
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            )}
          </CardContent>
          <div className="p-6 border-t">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {selectedIds.length} product(s) selected
              </p>
              <div className="flex gap-2">
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button onClick={handleSelect} disabled={selectedIds.length === 0}>
                  Add Selected
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

// Main Page Component
export default function HomepageSectionsPage() {
  const { sections, loading, addProducts, removeProducts, reorderProducts, toggleActive } = useHomepageSections()
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedSection, setSelectedSection] = useState<string>('')

  const handleAddProducts = (type: string) => {
    setSelectedSection(type)
    setModalOpen(true)
  }

  const handleSelectProducts = async (productIds: string[]) => {
    if (!selectedSection) return
    try {
      await addProducts(selectedSection, productIds)
    } catch {
      // Error already handled in hook
    }
  }

  const handleRemoveProduct = async (type: string, productId: string) => {
    try {
      await removeProducts(type, [productId])
    } catch {
      // Error already handled in hook
    }
  }

  const handleReorder = async (type: string, productIds: string[]) => {
    try {
      await reorderProducts(type, productIds)
      toast.success('Products reordered successfully')
    } catch {
      // Error already handled in hook
    }
  }

  const handleToggleActive = async (type: string) => {
    try {
      await toggleActive(type)
    } catch {
      // Error already handled in hook
    }
  }

  const currentSection = sections.find(s => s.type === selectedSection)
  const excludeIds = currentSection?.products
    .map(p => typeof p === 'string' ? p : p._id) || []

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-8 w-48" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-32 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Homepage Sections</h1>
        <p className="text-muted-foreground mt-2">
          Manage product sections displayed on the homepage
        </p>
      </div>

      <div className="space-y-6">
        {sections
          .sort((a, b) => a.displayOrder - b.displayOrder)
          .map((section) => (
            <SectionCard
              key={section._id}
              section={section}
              onAddProducts={handleAddProducts}
              onRemoveProduct={handleRemoveProduct}
              onReorder={handleReorder}
              onToggleActive={handleToggleActive}
            />
          ))}
      </div>

      <ProductSelectionModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSelect={handleSelectProducts}
        excludeIds={excludeIds}
      />
    </div>
  )
}

