'use client'

import { Upload } from 'lucide-react'
import { Card } from '@/presentation/components/ui/card'

export default function MediaPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Media Library</h1>
        <p className="text-muted-foreground mt-2">Manage your media files</p>
      </div>

      <Card className="p-12 text-center border-dashed">
        <div className="flex justify-center mb-4">
          <Upload className="h-12 w-12 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">Media Library</h3>
        <p className="text-muted-foreground mb-4">
          Upload images to Cloudinary through product/category forms
        </p>
        <p className="text-sm text-muted-foreground">
          Media management is handled through the /api/media endpoint
        </p>
      </Card>
    </div>
  )
}
