'use client'

import { useEffect, useState } from 'react'
import { Upload, Trash2, Copy, Loader2, Image as ImageIcon, Search } from 'lucide-react'
import { Button } from '@/presentation/components/ui/button'
import { Card, CardContent } from '@/presentation/components/ui/card'
import { Input } from '@/presentation/components/ui/input'
import { httpClient } from '@/infrastructure/api/client'
import { API_ENDPOINTS } from '@/infrastructure/config/api.config'
import { toast } from 'sonner'
import { useImageUpload } from '@/presentation/hooks/use-image-upload'

interface MediaItem {
  _id: string
  url: string
  filename: string
  alt?: string
  size: number
  mimeType: string
  createdAt: string
}

export default function MediaPage() {
  const [media, setMedia] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  
  const { uploadMultipleImages, uploading } = useImageUpload()

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search)
      setPage(1) // Reset to page 1 on new search
    }, 500)
    return () => clearTimeout(timer)
  }, [search])

  useEffect(() => {
    fetchMedia()
  }, [page, debouncedSearch]) // eslint-disable-line react-hooks/exhaustive-deps

  const fetchMedia = async () => {
    setLoading(true)
    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: '30',
        ...(debouncedSearch && { search: debouncedSearch })
      })
      
      const response: any = await httpClient.get(
        `${API_ENDPOINTS.media.list}?${queryParams}`
      )
      
      if (response.success) {
        setMedia(response.data?.media || response.data || [])
        setTotalPages(response.data?.pagination?.totalPages || 1)
      }
    } catch (error: any) {
      toast.error(error.error || 'Failed to load media')
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const fileArray = Array.from(files)
    if (fileArray.length > 10) {
      toast.error('Maximum 10 files allowed per upload')
      return
    }

    try {
      const uploaded = await uploadMultipleImages(fileArray)
      if (uploaded.length > 0) {
        toast.success(`${uploaded.length} image(s) uploaded successfully`)
        fetchMedia() // Refresh list
      }
      e.target.value = '' // Reset input
    } catch {
      toast.error('Failed to upload images')
    }
  }

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url)
    toast.success('URL copied to clipboard')
  }

  const handleDelete = async (id: string, filename: string) => {
    if (!confirm(`Delete ${filename}?`)) return

    try {
      await httpClient.delete(API_ENDPOINTS.media.delete(id))
      toast.success('Image deleted')
      fetchMedia()
    } catch (error: any) {
      toast.error(error.error || 'Failed to delete image')
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Media Library</h1>
          <p className="text-muted-foreground mt-2">Manage your uploaded images</p>
        </div>
        <label htmlFor="file-upload">
          <Button asChild disabled={uploading}>
            <span>
              <Upload className="mr-2 h-4 w-4" />
              {uploading ? 'Uploading...' : 'Upload Images'}
            </span>
          </Button>
          <input
            id="file-upload"
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
            disabled={uploading}
          />
        </label>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search images..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : media.length === 0 ? (
        <Card className="p-12 text-center">
          <ImageIcon className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No images found</h3>
          <p className="text-muted-foreground mb-4">
            {debouncedSearch ? 'Try a different search term' : 'Upload images to get started'}
          </p>
          {!debouncedSearch && (
            <label htmlFor="file-upload-empty">
              <Button asChild>
                <span>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload First Image
                </span>
              </Button>
              <input
                id="file-upload-empty"
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          )}
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {media.map((item) => (
              <Card key={item._id} className="overflow-hidden group">
                <div className="aspect-square relative bg-muted">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.url}
                    alt={item.alt || item.filename}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button
                      size="icon"
                      variant="secondary"
                      onClick={() => handleCopyUrl(item.url)}
                      title="Copy URL"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="destructive"
                      onClick={() => handleDelete(item._id, item.filename)}
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <CardContent className="p-2">
                  <p className="text-xs truncate font-medium" title={item.filename}>
                    {item.filename}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(item.size)}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 pt-4">
              <Button
                variant="outline"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              >
                Previous
              </Button>
              <span className="flex items-center px-4 text-sm">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
