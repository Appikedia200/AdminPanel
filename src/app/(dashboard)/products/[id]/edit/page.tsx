'use client'

import { useState, useEffect } from 'react'

import { useRouter, useParams } from 'next/navigation'
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
import { Skeleton } from '@/presentation/components/ui/skeleton'
import type { JewelryDetails } from '@/shared/types/entity.types'

export default function EditProductPage() {
  const router = useRouter()
  const params = useParams()
  const productId = params?.id as string
  const { categories, loading: categoriesLoading } = useCategories()
  const { uploadMultipleImages, uploading } = useImageUpload()
  
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [images, setImages] = useState<UploadedImage[]>([])
  const [jewelry, setJewelry] = useState<Partial<JewelryDetails>>({})
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    shortDescription: '',
    price: '',
    comparePrice: '',
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

  // Fetch product data - MUST be before any conditional returns
  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) {
        setFetching(false)
        return
      }

      setFetching(true)
      try {
        const response = await httpClient.get(API_ENDPOINTS.products.get(productId))
        
        if (!response || !response.success || !response.data) {
          throw new Error('Failed to load product data')
        }
        
        const product = response.data
        
        // Safely extract category ID
        const categoryId = typeof product.category === 'string' 
          ? product.category 
          : (product.category && typeof product.category === 'object' ? product.category._id : '')
        
        setFormData({
          name: product.name || '',
          slug: product.slug || '',
          description: product.description || '',
          shortDescription: product.shortDescription || '',
          price: product.price?.toString() || '',
          comparePrice: product.comparePrice?.toString() || '',
          sku: product.sku || '',
          stock: product.stock?.toString() || '',
          category: categoryId,
          keywords: Array.isArray(product.keywords) ? product.keywords.join(', ') : '',
          ingredients: Array.isArray(product.ingredients) ? product.ingredients.join(', ') : '',
          brand: product.brand || '',
          trackInventory: product.trackInventory ?? true,
          featured: product.featured ?? false,
          status: product.status || 'draft',
        })
        
        // Set images - backend returns populated media references
        if (Array.isArray(product.images) && product.images.length > 0) {
          try {
            const productImages = product.images.map((img: Record<string, unknown>, index: number) => {
              // mediaId can be a string (ID) or populated object (Media)
              let mediaId = ''
              let previewUrl = ''
              
              if (typeof img.mediaId === 'string') {
                mediaId = img.mediaId
              } else if (img.mediaId && typeof img.mediaId === 'object') {
                const mediaObj = img.mediaId as Record<string, unknown>
                mediaId = (mediaObj._id as string) || ''
                previewUrl = (mediaObj.cloudinaryUrl as string) || ''
              } else if (img._id) {
                mediaId = img._id as string
              }
              
              return {
                mediaId: mediaId || `temp-${index}`,
                isPrimary: (img.isPrimary as boolean) ?? (index === 0),
                order: (img.order as number) ?? index,
                _previewUrl: previewUrl || '/placeholder-image.png',
              }
            }).filter(img => img.mediaId && !img.mediaId.startsWith('temp-'))
            
            setImages(productImages)
          } catch {
            setImages([])
          }
        }

        // Set jewelry details if present
        if (product.jewelry && typeof product.jewelry === 'object') {
          setJewelry(product.jewelry)
        }
      } catch (error) {
        const apiError = error as { response?: { data?: { error?: string } }; error?: string; message?: string }
        const errorMessage = apiError?.response?.data?.error || apiError?.error || apiError?.message || 'Failed to load product'
        setError(errorMessage)
        toast.error(errorMessage)
      } finally {
        setFetching(false)
      }
    }

    fetchProduct()
  }, [productId, router])

  const handleChange = (field: string, value: string) => {
    // Handle boolean fields
    if (field === 'featured' || field === 'trackInventory') {
      setFormData({ ...formData, [field]: value === 'true' })
    } else {
      setFormData({ ...formData, [field]: value })
    }
  }
  
  // Safely determine if selected category is jewelry (after all hooks)
  const categoriesArray = Array.isArray(categories) ? categories : []
  const selectedCategory = categoriesArray.find(cat => cat?._id === formData?.category)
  const isJewelryCategory = selectedCategory?.name?.toLowerCase().includes('jewelry') || 
                             selectedCategory?.name?.toLowerCase().includes('jewellery') || false
  
  // Handle missing product ID (after all hooks)
  if (!productId) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Invalid Product ID</h2>
          <Button onClick={() => router.push(ROUTES.PRODUCTS)}>
            Go Back to Products
          </Button>
        </div>
      </div>
    )
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
      // ✅ CRITICAL FIX: Ensure images array only contains mediaId STRING, not objects
      const cleanImages = images.map(img => ({
        mediaId: typeof img.mediaId === 'string' ? img.mediaId : String(img.mediaId),
        isPrimary: img.isPrimary,
        order: img.order
      }))

      const payload: Record<string, unknown> = {
        name: formData.name,
        slug: formData.slug,
        description: formData.description,
        shortDescription: formData.shortDescription || formData.description.substring(0, 160),
        price: parseFloat(formData.price),
        comparePrice: formData.comparePrice ? parseFloat(formData.comparePrice) : undefined,
        sku: formData.sku,
        stock: parseInt(formData.stock) || 0,
        trackInventory: formData.trackInventory,
        category: formData.category,
        images: cleanImages, // ✅ Use cleaned images array
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

      const response: { success: boolean } = await httpClient.put(API_ENDPOINTS.products.update(productId), payload)
      
      if (response.success) {
        toast.success('Product updated successfully')
        router.push(ROUTES.PRODUCTS)
      }
    } catch (error) {
      const apiError = error as { error?: string }
      toast.error(apiError.error || 'Failed to update product')
    } finally {
      setLoading(false)
    }
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-bold mb-4 text-destructive">Error Loading Product</h2>
          <p className="text-muted-foreground mb-6">{error}</p>
          <div className="flex gap-4 justify-center">
            <Button onClick={() => router.push(ROUTES.PRODUCTS)}>
              Go Back to Products
            </Button>
            <Button variant="outline" onClick={() => window.location.reload()}>
              Retry
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (fetching) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-6 w-64" />
        <div className="space-y-6">
          <Card>
            <CardHeader><Skeleton className="h-6 w-32" /></CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-32 w-full" />
            </CardContent>
          </Card>
        </div>
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
          <h1 className="text-3xl font-bold">Edit Product</h1>
          <p className="text-muted-foreground mt-1">Update product information</p>
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
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="price">Regular Price (₦) *</Label>
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

              <div className="space-y-2">
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
                Updating...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Update Product
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}

