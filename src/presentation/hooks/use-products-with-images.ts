'use client'

import { useState, useEffect } from 'react'
import type { Product } from '@/core/entities/product.entity'
import type { QueryParams } from '@/shared/types'
import { ProductRepositoryImpl } from '@/infrastructure/repositories/product.repository.impl'
import { httpClient } from '@/infrastructure/api/client'

interface ProductWithImage extends Product {
  _imageUrl?: string
}

export function useProductsWithImages(params?: QueryParams) {
  const [products, setProducts] = useState<ProductWithImage[]>([])
  const [loading, setLoading] = useState(true)
  
  const repository = new ProductRepositoryImpl()

  useEffect(() => {
    const fetchProductsWithImages = async () => {
      setLoading(true)
      
      try {
        // Fetch products
        const response = await repository.findAll(params)
        const productsData = response.data
        
        // Fetch media URLs for all products
        const productsWithImages = await Promise.all(
          productsData.map(async (product) => {
            let imageUrl = '/placeholder-image.png'
            
            // Get first image's mediaId
            const firstImage = product.images?.[0]
            if (firstImage && typeof firstImage === 'object' && 'mediaId' in firstImage) {
              const mediaId = (firstImage as any).mediaId
              
              // If mediaId is a string, fetch the media details
              if (typeof mediaId === 'string') {
                try {
                  const mediaResponse: any = await httpClient.get(`/api/media/${mediaId}`)
                  if (mediaResponse.success && mediaResponse.data?.cloudinaryUrl) {
                    imageUrl = mediaResponse.data.cloudinaryUrl
                  }
                } catch (error) {
                  // Silently fail - use placeholder
                  console.warn(`Failed to fetch media for product ${product._id}:`, error)
                }
              } else if (mediaId && typeof mediaId === 'object' && 'cloudinaryUrl' in mediaId) {
                // mediaId is already populated
                imageUrl = (mediaId as any).cloudinaryUrl || '/placeholder-image.png'
              }
            }
            
            return {
              ...product,
              _imageUrl: imageUrl,
            }
          })
        )
        
        setProducts(productsWithImages)
      } catch (error) {
        console.error('Failed to load products with images:', error)
        setProducts([])
      } finally {
        setLoading(false)
      }
    }

    fetchProductsWithImages()
  }, [JSON.stringify(params)])

  return {
    products,
    loading,
  }
}

