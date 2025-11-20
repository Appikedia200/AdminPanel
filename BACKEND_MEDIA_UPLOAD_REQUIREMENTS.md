# 📷 BACKEND: Media Upload Requirements

## ✅ FRONTEND IMPROVEMENTS

The frontend now has:
- ✅ File type validation (JPEG, PNG, GIF, WebP only)
- ✅ File size validation (max 5MB per file)
- ✅ Maximum 10 files per upload
- ✅ Upload progress indicator
- ✅ Better error handling and user feedback
- ✅ Console logging for debugging

---

## 🔍 MEDIA UPLOAD ENDPOINT REQUIREMENTS

### Endpoint: `POST /api/media`

**Request Format:**
```
Content-Type: multipart/form-data
Authorization: Bearer <token>

Body:
- image: File (required)
```

**Expected Response:**
```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "cloudinaryUrl": "https://res.cloudinary.com/xxx/image/upload/v123/abc.jpg",
      "cloudinaryPublicId": "glownatura/abc123",
      "filename": "product-image.jpg",
      "originalName": "my-product.jpg",
      "fileSize": 1024000,
      "mimeType": "image/jpeg"
    }
  ]
}
```

### **CRITICAL FIELDS:**

1. ✅ **`cloudinaryUrl`** - Full URL to the uploaded image (REQUIRED)
2. ✅ **`_id`** - MongoDB ID of the media record (REQUIRED)
3. ✅ **`filename`** - Stored filename (REQUIRED)
4. ⚠️ **`cloudinaryPublicId`** - For deletion (RECOMMENDED)
5. ⚠️ **`fileSize`** - In bytes (OPTIONAL)
6. ⚠️ **`mimeType`** - e.g., "image/jpeg" (OPTIONAL)

---

## 🧪 BACKEND VALIDATION CHECKLIST

### 1. File Type Validation
```javascript
const allowedMimeTypes = [
  'image/jpeg',
  'image/jpg', 
  'image/png',
  'image/gif',
  'image/webp'
]

if (!allowedMimeTypes.includes(file.mimetype)) {
  return res.status(400).json({
    success: false,
    error: 'Only image files (JPEG, PNG, GIF, WebP) are allowed'
  })
}
```

### 2. File Size Validation
```javascript
const maxSize = 5 * 1024 * 1024 // 5MB

if (file.size > maxSize) {
  return res.status(400).json({
    success: false,
    error: 'File size must be less than 5MB'
  })
}
```

### 3. Multiple File Upload (Optional)
Frontend sends one file at a time, but backend should be prepared for batch uploads:

```javascript
router.post('/media', upload.single('image'), async (req, res) => {
  // or upload.array('images', 10) for multiple
  
  const file = req.file
  if (!file) {
    return res.status(400).json({
      success: false,
      error: 'No image file provided'
    })
  }
  
  // Upload to Cloudinary
  const result = await cloudinary.uploader.upload(file.path, {
    folder: 'glownatura',
    resource_type: 'image'
  })
  
  // Save to database
  const media = await Media.create({
    cloudinaryUrl: result.secure_url,
    cloudinaryPublicId: result.public_id,
    filename: result.original_filename,
    originalName: file.originalname,
    fileSize: file.size,
    mimeType: file.mimetype
  })
  
  res.json({
    success: true,
    count: 1,
    data: [media]
  })
})
```

---

## 📋 MEDIA LIST ENDPOINT

### Endpoint: `GET /api/media`

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 30)
- `search`: Search by filename (optional)

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "media": [
      {
        "_id": "...",
        "url": "https://res.cloudinary.com/...",
        "filename": "product-1.jpg",
        "alt": "Product image",
        "size": 1024000,
        "mimeType": "image/jpeg",
        "createdAt": "2025-11-20T12:00:00.000Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalItems": 150,
      "itemsPerPage": 30
    }
  }
}
```

---

## 🗑️ MEDIA DELETE ENDPOINT

### Endpoint: `DELETE /api/media/:id`

**Expected Response:**
```json
{
  "success": true,
  "message": "Image deleted successfully"
}
```

**Backend Must:**
1. Delete from Cloudinary using `cloudinaryPublicId`
2. Delete from database
3. Handle errors gracefully

```javascript
router.delete('/media/:id', async (req, res) => {
  const media = await Media.findById(req.params.id)
  
  if (!media) {
    return res.status(404).json({
      success: false,
      error: 'Image not found'
    })
  }
  
  // Delete from Cloudinary
  try {
    await cloudinary.uploader.destroy(media.cloudinaryPublicId)
  } catch (error) {
    console.error('Cloudinary deletion failed:', error)
    // Continue anyway to remove from database
  }
  
  // Delete from database
  await media.remove()
  
  res.json({
    success: true,
    message: 'Image deleted successfully'
  })
})
```

---

## ⚠️ COMMON ERRORS TO HANDLE

### 1. Cloudinary Configuration Missing
```javascript
if (!process.env.CLOUDINARY_CLOUD_NAME || 
    !process.env.CLOUDINARY_API_KEY || 
    !process.env.CLOUDINARY_API_SECRET) {
  throw new Error('Cloudinary configuration missing')
}
```

### 2. Upload Failed
```javascript
try {
  const result = await cloudinary.uploader.upload(file.path)
} catch (error) {
  return res.status(500).json({
    success: false,
    error: 'Failed to upload image to cloud storage'
  })
}
```

### 3. Database Save Failed
```javascript
try {
  const media = await Media.create({ ... })
} catch (error) {
  // Delete from Cloudinary if DB save fails
  await cloudinary.uploader.destroy(result.public_id)
  
  return res.status(500).json({
    success: false,
    error: 'Failed to save image metadata'
  })
}
```

---

## 🧪 TESTING CHECKLIST

### Upload Tests:
- [ ] Single image upload works
- [ ] Returns correct response format
- [ ] `cloudinaryUrl` field is present and valid
- [ ] Image is accessible at returned URL
- [ ] Validation rejects non-image files
- [ ] Validation rejects files > 5MB
- [ ] Upload works with JPEG, PNG, GIF, WebP

### List Tests:
- [ ] Returns paginated media list
- [ ] Search filter works
- [ ] Returns correct pagination metadata

### Delete Tests:
- [ ] Deletes from Cloudinary
- [ ] Deletes from database
- [ ] Returns 404 for non-existent media
- [ ] Handles Cloudinary errors gracefully

---

## ✅ FRONTEND STATUS

- ✅ File validation implemented
- ✅ Upload progress tracking
- ✅ Multiple file support (up to 10)
- ✅ Error handling and user feedback
- ✅ Media library with search
- ✅ Copy URL functionality
- ✅ Delete confirmation

**No additional frontend work needed** - just ensure backend returns correct response format! 🎉

