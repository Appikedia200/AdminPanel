'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save, Loader2, Upload, X, Image as ImageIcon } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/presentation/components/ui/button'
import { Input } from '@/presentation/components/ui/input'
import { Label } from '@/presentation/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/presentation/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/presentation/components/ui/select'
import { Checkbox } from '@/presentation/components/ui/checkbox'
import { httpClient } from '@/infrastructure/api/client'
import { API_ENDPOINTS } from '@/infrastructure/config/api.config'
import { useCategories } from '@/presentation/hooks/use-categories'
import { useImageUpload, type UploadedImage } from '@/presentation/hooks/use-image-upload'
import { JewelryFields } from '@/presentation/components/products/JewelryFields'
import { toast } from 'sonner'
import { ROUTES } from '@/infrastructure/config/constants'
import type { JewelryDetails } from '@/shared/types/entity.types'

export default function NewProductPage() {
  const router = useRouter()
  const { categories, loading: categoriesLoading } = useCategories()
  const { uploadMultipleImages, uploading } = useImageUpload()
  
  const [loading, setLoading] = useState(false)
  const [images, setImages] = useState<UploadedImage[]>([])
  const [jewelry, setJewelry] = useState<Partial<JewelryDetails>>({})
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    shortDescription: '',
    price: '',
    comparePrice: '', // Changed from salePrice
    sku: '',
    stock: '',
    category: '',
    keywords: '',
    ingredients: '',
    brand: '',
    trackInventory: true,
    featured: false,
    status: 'draft' as 'draft' | 'active' | 'inactive',
  })

  // Determine if selected category is jewelry
  const selectedCategory = categories.find(cat => cat._id === formData.category)
  const isJewelryCategory = selectedCategory?.name?.toLowerCase().includes('jewelry') || 
                             selectedCategory?.name?.toLowerCase().includes('jewellery') || false

  // Auto-generate slug from name
  useEffect(() => {
    if (formData.name && !formData.slug) {
      const slug = formData.name
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '')
      setFormData({ ...formData, slug })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.name])

  const handleChange = (field: string, value: string) => {
    // Handle boolean fields
    if (field === 'featured' || field === 'trackInventory') {
      setFormData({ ...formData, [field]: value === 'true' })
    } else {
      setFormData({ ...formData, [field]: value })
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const fileArray = Array.from(files)
    const uploadedImages = await uploadMultipleImages(fileArray)
    
    if (uploadedImages.length > 0) {
      setImages([...images, ...uploadedImages])
      toast.success(`${uploadedImages.length} image(s) uploaded successfully`)
    }
  }

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index))
  }

  const handleSetPrimaryImage = (index: number) => {
    setImages(images.map((img, i) => ({ ...img, isPrimary: i === index, order: i })))
  }

  const handleGenerateSKU = async () => {
    try {
      const response: any = await httpClient.post(API_ENDPOINTS.products.generateSKU, {
        categoryId: formData.category || undefined,
      })
      
      if (response.success && response.data?.sku) {
        setFormData({ ...formData, sku: response.data.sku })
        toast.success('SKU generated')
      }
    } catch (error: any) {
      toast.error(error.error || 'Failed to generate SKU')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (!formData.name || !formData.description || !formData.price || !formData.sku || !formData.category) {
      toast.error('Please fill in all required fields')
      return
    }

    if (images.length === 0) {
      toast.error('Please upload at least one product image')
      return
    }

    // Validate jewelry-specific required fields
    if (isJewelryCategory) {
      if (!jewelry.material) {
        toast.error('Material is required for jewelry products')
        return
      }
      if (!jewelry.type) {
        toast.error('Jewelry type is required for jewelry products')
        return
      }
    }

    setLoading(true)

    try {
      const payload: Record<string, unknown> = {
        name: formData.name,
        slug: formData.slug,
        description: formData.description, // Flat field
        shortDescription: formData.shortDescription || formData.description.substring(0, 160), // Flat field
        price: parseFloat(formData.price),
        comparePrice: formData.comparePrice ? parseFloat(formData.comparePrice) : undefined, // Changed from salePrice
        sku: formData.sku,
        stock: parseInt(formData.stock) || 0,
        trackInventory: formData.trackInventory,
        category: formData.category,
        images: images, // Already in correct format: { mediaId, isPrimary, order }
        keywords: formData.keywords ? formData.keywords.split(',').map((k) => k.trim()) : [],
        ingredients: formData.ingredients ? formData.ingredients.split(',').map((i) => i.trim()) : [],
        brand: formData.brand || undefined,
        featured: formData.featured,
        status: formData.status,
      }

      // Include jewelry details if this is a jewelry product
      if (isJewelryCategory && Object.keys(jewelry).length > 0) {
        payload.jewelry = jewelry
      }

      const response: { success: boolean } = await httpClient.post(API_ENDPOINTS.products.create, payload)
      
      if (response.success) {
        toast.success('Product created successfully')
        router.push(ROUTES.PRODUCTS)
      }
    } catch (error) {
      const apiError = error as { error?: string }
      toast.error(apiError.error || 'Failed to create product')
    } finally {
      setLoading(false)
    }
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
          <h1 className="text-3xl font-bold">Add New Product</h1>
          <p className="text-muted-foreground mt-1">Create a new product listing</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder="e.g., Vitamin C Serum"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">URL Slug *</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => handleChange('slug', e.target.value)}
                  placeholder="vitamin-c-serum"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                rows={4}
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                placeholder="Detailed product description..."
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="shortDescription">Short Description</Label>
              <Input
                id="shortDescription"
                value={formData.shortDescription}
                onChange={(e) => handleChange('shortDescription', e.target.value)}
                placeholder="Brief description for listings"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="keywords">Keywords (comma-separated)</Label>
              <Input
                id="keywords"
                value={formData.keywords}
                onChange={(e) => handleChange('keywords', e.target.value)}
                placeholder="vitamin c, serum, brightening"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ingredients">Ingredients (comma-separated)</Label>
              <Input
                id="ingredients"
                value={formData.ingredients}
                onChange={(e) => handleChange('ingredients', e.target.value)}
                placeholder="Water, Vitamin C, Hyaluronic Acid"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="brand">Brand</Label>
              <Input
                id="brand"
                value={formData.brand}
                onChange={(e) => handleChange('brand', e.target.value)}
                placeholder="Brand name"
              />
            </div>
          </CardContent>
        </Card>

        {/* Images */}
        <Card>
          <CardHeader>
            <CardTitle>Product Images *</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="images">Upload Images</Label>
              <div className="flex items-center gap-4">
                <Input
                  id="images"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  disabled={uploading}
                  className="cursor-pointer"
                />
                <Button type="button" disabled={uploading} variant="outline">
                  <Upload className="h-4 w-4 mr-2" />
                  {uploading ? 'Uploading...' : 'Upload'}
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Upload product images (JPEG, PNG, WebP). First image will be the default.
              </p>
            </div>

            {images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {images.map((image, index) => (
                  <div key={index} className="relative group border rounded-lg p-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={image._previewUrl || '/placeholder-image.png'}
                      alt={`Product image ${index + 1}`}
                      className="w-full h-32 object-cover rounded"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                      {!image.isPrimary && (
                        <Button
                          type="button"
                        size="sm"
                        variant="secondary"
                        onClick={() => handleSetPrimaryImage(index)}
                      >
                        Set Primary
                        </Button>
                      )}
                      <Button
                        type="button"
                        size="sm"
                        variant="destructive"
                        onClick={() => handleRemoveImage(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    {image.isPrimary && (
                      <div className="absolute top-3 left-3 bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
                        Primary
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {images.length === 0 && (
              <div className="border-2 border-dashed rounded-lg p-12 text-center">
                <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No images uploaded yet</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pricing */}
        <Card>
          <CardHeader>
            <CardTitle>Pricing</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="price">Price (₦) *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => handleChange('price', e.target.value)}
                  placeholder="0.00"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="comparePrice">Compare at Price (₦)</Label>
                <Input
                  id="comparePrice"
                  type="number"
                  step="0.01"
                  value={formData.comparePrice}
                  onChange={(e) => handleChange('comparePrice', e.target.value)}
                  placeholder="0.00"
                />
                <p className="text-xs text-muted-foreground">
                  Original price for showing discounts
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Inventory */}
        <Card>
          <CardHeader>
            <CardTitle>Inventory</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="sku">SKU *</Label>
                <div className="flex gap-2">
                  <Input
                    id="sku"
                    value={formData.sku}
                    onChange={(e) => handleChange('sku', e.target.value)}
                    placeholder="PROD-001"
                    required
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleGenerateSKU}
                  >
                    Generate
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="stock">Stock Quantity *</Label>
                <Input
                  id="stock"
                  type="number"
                  value={formData.stock}
                  onChange={(e) => handleChange('stock', e.target.value)}
                  placeholder="0"
                  required
                />
              </div>

            </div>
          </CardContent>
        </Card>

        {/* Category */}
        <Card>
          <CardHeader>
            <CardTitle>Category *</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="category">Select Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => handleChange('category', value)}
                disabled={categoriesLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder={categoriesLoading ? 'Loading categories...' : 'Select a category'} />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category._id} value={category._id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {categories.length === 0 && !categoriesLoading && (
                <p className="text-sm text-destructive">
                  No categories found. Please create a category first.
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Jewelry Details (conditionally rendered) */}
        <JewelryFields 
          jewelry={jewelry}
          setJewelry={setJewelry}
          isJewelryCategory={isJewelryCategory}
        />

        {/* Status & Options */}
        <Card>
          <CardHeader>
            <CardTitle>Status & Options</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="status">Product Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value: 'draft' | 'active' | 'inactive') => handleChange('status', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="featured"
                checked={formData.featured}
                onCheckedChange={(checked) => handleChange('featured', checked ? 'true' : 'false')}
              />
              <Label htmlFor="featured" className="cursor-pointer">
                Featured product (show on homepage)
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="trackInventory"
                checked={formData.trackInventory}
                onCheckedChange={(checked) => handleChange('trackInventory', checked ? 'true' : 'false')}
              />
              <Label htmlFor="trackInventory" className="cursor-pointer">
                Track inventory
              </Label>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <Link href={ROUTES.PRODUCTS}>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </Link>
          <Button type="submit" disabled={loading || uploading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Create Product
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
