'use client'

import { useState } from 'react'
import { Plus, Pencil, Trash2, Search } from 'lucide-react'
import { Button } from '@/presentation/components/ui/button'
import { Input } from '@/presentation/components/ui/input'
import { Card } from '@/presentation/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/presentation/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/presentation/components/ui/dialog'
import { Label } from '@/presentation/components/ui/label'
import { Skeleton } from '@/presentation/components/ui/skeleton'
import { useCategories } from '@/presentation/hooks/use-categories'
import { CategoryRepositoryImpl } from '@/infrastructure/repositories/category.repository.impl'
import type { Category } from '@/core/entities/category.entity'
import { toast } from 'sonner'

export default function CategoriesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const { categories, loading, refetch } = useCategories()
  const repository = new CategoryRepositoryImpl()
  
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    displayOrder: 1,
    isActive: true, // ✅ Backend expects 'isActive', not 'active'
    parentCategory: null as string | null, // ✅ Hierarchical categories support
  })
  const [submitting, setSubmitting] = useState(false)

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleOpenDialog = (category?: Category) => {
    if (category) {
      setEditingCategory(category)
      setFormData({
        name: category.name,
        slug: category.slug,
        description: category.description || '',
        displayOrder: category.displayOrder,
        isActive: category.active, // ✅ Map 'active' from category to 'isActive' for form
        parentCategory: category.parentCategory || null, // ✅ Populate parentCategory for editing
      })
    } else {
      setEditingCategory(null)
      setFormData({
        name: '',
        slug: '',
        description: '',
        displayOrder: categories.length + 1,
        isActive: true, // ✅ Default to active for new categories
        parentCategory: null, // ✅ Default to root category (no parent)
      })
    }
    setDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setDialogOpen(false)
    setEditingCategory(null)
    setFormData({
      name: '',
      slug: '',
      description: '',
      displayOrder: 1,
      isActive: true, // ✅ Reset to active
      parentCategory: null, // ✅ Reset to root category
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      // ✅ CRITICAL: Include ALL required fields with correct field names
      const dataToSend: Record<string, any> = {
        name: formData.name,
        displayOrder: formData.displayOrder,
        isActive: formData.isActive, // ✅ Backend expects 'isActive', not 'active'
        parentCategory: formData.parentCategory || null, // ✅ Send parentCategory (null for root categories)
      }
      
      // Only include optional fields if they have values
      if (formData.slug?.trim()) {
        dataToSend.slug = formData.slug.trim()
      }
      if (formData.description?.trim()) {
        dataToSend.description = formData.description.trim()
      }

      if (editingCategory) {
        await repository.update(editingCategory._id, dataToSend)
        toast.success('Category updated successfully')
      } else {
        await repository.create(dataToSend)
        toast.success('Category created successfully')
      }
      
      handleCloseDialog()
      refetch()
    } catch (error: any) {
      // ✅ PROFESSIONAL: Extract backend error message (handles ALL formats)
      let errorMessage = 'Operation failed'
      
      // Check each potential error source and ensure it's a STRING
      if (typeof error?.response?.data?.error === 'string' && error.response.data.error) {
        errorMessage = error.response.data.error
      } else if (error?.response?.data?.error && typeof error.response.data.error === 'object') {
        // If error is an object, extract message from it
        errorMessage = error.response.data.error.message || JSON.stringify(error.response.data.error)
      } else if (typeof error?.response?.data?.message === 'string' && error.response.data.message) {
        errorMessage = error.response.data.message
      } else if (typeof error?.error === 'string' && error.error) {
        errorMessage = error.error
      } else if (typeof error?.message === 'string' && error.message) {
        errorMessage = error.message
      }
      
      toast.error(errorMessage, {
        duration: 5000, // Show for 5 seconds so user can read
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: string, name: string) => {
    // ✅ PROTECTION: Check if this category has children
    const hasChildren = categories.some(cat => cat.parentCategory === id)
    
    if (hasChildren) {
      toast.error('Cannot delete category with subcategories. Please remove or reassign subcategories first.', {
        duration: 5000,
      })
      return
    }

    if (!confirm(`Are you sure you want to delete "${name}"?`)) return

    try {
      await repository.delete(id)
      toast.success('Category deleted successfully')
      refetch()
    } catch (error: any) {
      // ✅ PROFESSIONAL: Extract specific backend error message (handles ALL formats)
      let errorMessage = 'Failed to delete category'
      
      // Check each potential error source and ensure it's a STRING
      if (typeof error?.response?.data?.error === 'string' && error.response.data.error) {
        errorMessage = error.response.data.error
      } else if (error?.response?.data?.error && typeof error.response.data.error === 'object') {
        // If error is an object, extract message from it
        errorMessage = error.response.data.error.message || JSON.stringify(error.response.data.error)
      } else if (typeof error?.response?.data?.message === 'string' && error.response.data.message) {
        errorMessage = error.response.data.message
      } else if (typeof error?.error === 'string' && error.error) {
        errorMessage = error.error
      } else if (typeof error?.message === 'string' && error.message) {
        errorMessage = error.message
      }
      
      toast.error(errorMessage, {
        duration: 5000, // Show for 5 seconds so user can read
      })
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Card className="p-6">
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Categories</h1>
          <p className="text-muted-foreground mt-2">Manage your product categories</p>
        </div>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="h-4 w-4 mr-2" />
          Add Category
        </Button>
      </div>

      <Card className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {filteredCategories.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              {searchQuery ? 'No categories found' : 'No categories yet. Create your first category!'}
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="w-24">Order</TableHead>
                <TableHead className="w-24">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCategories.map((category) => {
                // ✅ Find parent category if this is a child
                const parentCat = categories.find(c => c._id === category.parentCategory)
                const isChild = !!category.parentCategory
                
                return (
                  <TableRow key={category._id}>
                    <TableCell className="font-medium">
                      {/* ✅ Visual hierarchy indicator */}
                      {isChild && (
                        <span className="text-muted-foreground mr-2">└─</span>
                      )}
                      {category.name}
                      {/* ✅ Show parent name for child categories */}
                      {parentCat && (
                        <span className="text-xs text-muted-foreground ml-2 font-normal">
                          (child of {parentCat.name})
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground">{category.slug}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {category.description || '-'}
                    </TableCell>
                    <TableCell>{category.displayOrder}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenDialog(category)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(category._id, category.name)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        )}
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? 'Edit Category' : 'Create Category'}
            </DialogTitle>
            <DialogDescription>
              {editingCategory
                ? 'Update category information'
                : 'Add a new product category'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="name">Category Name *</Label>
                <span className={`text-xs ${formData.name.length > 100 ? 'text-red-500 font-medium' : 'text-muted-foreground'}`}>
                  {formData.name.length}/100
                </span>
              </div>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => {
                  const name = e.target.value
                  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
                  setFormData({ ...formData, name, slug })
                }}
                maxLength={100}
                placeholder="e.g., Serums"
                required
                className={formData.name.length > 100 ? 'border-red-500' : ''}
              />
              {formData.name.length > 100 && (
                <p className="text-xs text-red-500">
                  Name is too long. Maximum 100 characters allowed.
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Slug (auto-generated if empty)</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="serums (auto-generated from name)"
              />
              <p className="text-xs text-muted-foreground">
                Leave empty to auto-generate from category name
              </p>
            </div>

            {/* ✅ NEW: Parent Category Selection for Hierarchical Categories */}
            <div className="space-y-2">
              <Label htmlFor="parentCategory">Parent Category</Label>
              <select
                id="parentCategory"
                value={formData.parentCategory || ''}
                onChange={(e) => setFormData({ ...formData, parentCategory: e.target.value || null })}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">None (Root Category)</option>
                {categories
                  .filter(cat => {
                    // ✅ Only show root categories as parent options
                    // ✅ Exclude self when editing to prevent circular reference
                    return !cat.parentCategory && cat._id !== editingCategory?._id
                  })
                  .sort((a, b) => a.displayOrder - b.displayOrder)
                  .map(cat => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
              </select>
              <p className="text-xs text-muted-foreground">
                Select a parent category to create a subcategory. Leave as &quot;None&quot; to create a root category.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="description">Description</Label>
                <span className={`text-xs ${formData.description.length > 500 ? 'text-red-500 font-medium' : 'text-muted-foreground'}`}>
                  {formData.description.length}/500
                </span>
              </div>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                maxLength={500}
                rows={3}
                className={`flex w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
                  formData.description.length > 500 
                    ? 'border-red-500 focus-visible:ring-red-500' 
                    : 'border-input focus-visible:ring-ring'
                }`}
                placeholder="Category description..."
              />
              {formData.description.length > 500 && (
                <p className="text-xs text-red-500">
                  Description is too long. Maximum 500 characters allowed.
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="displayOrder">Display Order</Label>
              <Input
                id="displayOrder"
                type="number"
                value={formData.displayOrder}
                onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) })}
                min={1}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseDialog}>
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? 'Saving...' : editingCategory ? 'Update' : 'Create'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
