import { z } from 'zod'

export const productSchema = z.object({
  name: z.string().min(3, 'Product name must be at least 3 characters'),
  slug: z.string().min(3, 'Slug is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  shortDescription: z.string().optional(),
  sku: z.string().min(2, 'SKU is required'),
  price: z.number().min(0.01, 'Price must be greater than 0'),
  salePrice: z.number().optional(),
  costPrice: z.number().optional(),
  stock: z.number().int().min(0, 'Stock cannot be negative'),
  lowStockThreshold: z.number().int().min(0, 'Threshold cannot be negative'),
  category: z.string().min(1, 'Category is required'),
  images: z.array(z.object({
    url: z.string().url(),
    publicId: z.string(),
    alt: z.string().optional(),
  })).min(1, 'At least one image is required'),
  featured: z.boolean().default(false),
  status: z.enum(['active', 'inactive', 'draft']).default('draft'),
  tags: z.array(z.string()).optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  weight: z.number().optional(),
  dimensions: z.object({
    length: z.number().optional(),
    width: z.number().optional(),
    height: z.number().optional(),
  }).optional(),
})

export type ProductFormData = z.infer<typeof productSchema>

