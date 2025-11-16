import { useState } from 'react'
import { httpClient } from '@/infrastructure/api/client'
import { API_ENDPOINTS } from '@/infrastructure/config/api.config'
import { toast } from 'sonner'

export interface UploadedImage {
  url: string
  altText: string
  isDefault: boolean
  _id?: string
}

export function useImageUpload() {
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  const uploadImage = async (file: File): Promise<UploadedImage | null> => {
    const formData = new FormData()
    formData.append('image', file)

    try {
      setUploading(true)
      setUploadProgress(0)

      const response: any = await httpClient.post(API_ENDPOINTS.media.upload, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent: any) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
            setUploadProgress(percentCompleted)
          }
        },
      })

      if (response.success && response.data) {
        return {
          url: response.data.cloudinaryUrl,
          altText: file.name.replace(/\.[^/.]+$/, ''),
          isDefault: false,
          _id: response.data._id,
        }
      }

      return null
    } catch (error: any) {
      toast.error(error.error || 'Failed to upload image')
      return null
    } finally {
      setUploading(false)
      setUploadProgress(0)
    }
  }

  const uploadMultipleImages = async (files: File[]): Promise<UploadedImage[]> => {
    const uploadedImages: UploadedImage[] = []

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const image = await uploadImage(file)
      
      if (image) {
        // Set first image as default
        if (i === 0) {
          image.isDefault = true
        }
        uploadedImages.push(image)
      }
    }

    return uploadedImages
  }

  return {
    uploadImage,
    uploadMultipleImages,
    uploading,
    uploadProgress,
  }
}

