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

interface MediaItem {
  _id: string
  cloudinaryUrl: string
  cloudinaryPublicId: string
  filename: string
  originalName?: string
  fileSize?: number
  mimeType?: string
}

interface MediaUploadResponse {
  success: boolean
  count: number
  data: MediaItem[]
}

interface ProgressEvent {
  loaded: number
  total?: number
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

      const response = await httpClient.post<MediaUploadResponse>(
        API_ENDPOINTS.media.upload, 
        formData, 
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (progressEvent: ProgressEvent) => {
            if (progressEvent.total) {
              const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
              setUploadProgress(percentCompleted)
            }
          },
        }
      )

      console.log('Upload response:', response)

      // Backend returns array in data field
      if (response.success && response.data && response.data.length > 0) {
        const media = response.data[0]
        
        if (!media.cloudinaryUrl) {
          console.error('Invalid upload response - missing cloudinaryUrl:', media)
          throw new Error('Invalid server response - missing image URL')
        }
        
        return {
          url: media.cloudinaryUrl,
          altText: file.name.replace(/\.[^/.]+$/, ''),
          isDefault: false,
          _id: media._id,
        }
      }

      throw new Error('Invalid server response - no data returned')
    } catch (error) {
      console.error('Upload error:', error)
      const apiError = error as { error?: string; message?: string }
      const errorMessage = apiError.error || apiError.message || 'Failed to upload image'
      toast.error(errorMessage)
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

