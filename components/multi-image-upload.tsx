"use client"

import React, { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { LoadingSpinner } from "@/components/loading-spinner"
import { Upload, X, Image as ImageIcon, Link as LinkIcon, Plus } from "lucide-react"
import toast from "react-hot-toast"
import Image from "next/image"

interface MultiImageUploadProps {
  label: string
  currentImages?: string[]
  onImagesChange: (urls: string[]) => void
  maxImages?: number
  folder?: "profile-pictures" | "service-images" | "images"
  accept?: string
  maxSizeMB?: number
  className?: string
}

export default function MultiImageUpload({
  label,
  currentImages = [],
  onImagesChange,
  maxImages = 5,
  folder = "service-images",
  accept = "image/*",
  maxSizeMB = 5,
  className = ""
}: MultiImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [images, setImages] = useState<string[]>(currentImages)
  const [showUrlInput, setShowUrlInput] = useState(false)
  const [imageUrl, setImageUrl] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    setImages(currentImages)
  }, [currentImages])

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    // Check if adding these files would exceed max images
    if (images.length + files.length > maxImages) {
      toast.error(`Maximum ${maxImages} images allowed`)
      return
    }

    // Upload all selected files
    Array.from(files).forEach(file => {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} is not an image file`)
        return
      }

      // Validate file size
      const maxSizeBytes = maxSizeMB * 1024 * 1024
      if (file.size > maxSizeBytes) {
        toast.error(`${file.name} exceeds ${maxSizeMB}MB limit`)
        return
      }

      uploadFile(file)
    })

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const uploadFile = async (file: File) => {
    try {
      setUploading(true)

      const formData = new FormData()
      formData.append('file', file)

      // Use specific endpoint based on folder
      let endpoint = '/api/upload/image'
      if (folder === 'profile-pictures') {
        endpoint = '/api/upload/profile-picture'
      } else if (folder === 'service-images') {
        endpoint = '/api/upload/service-image'
      } else {
        formData.append('folder', folder)
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        const newImages = [...images, data.url]
        setImages(newImages)
        onImagesChange(newImages)
        toast.success("Image uploaded successfully!")
      } else {
        const error = await response.json()
        toast.error(error.error || "Failed to upload image")
      }
    } catch (error) {
      console.error("Error uploading image:", error)
      toast.error("Network error. Please try again.")
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (imageUrl: string, index: number) => {
    try {
      // Optimistically remove from UI
      const newImages = images.filter((_, i) => i !== index)
      setImages(newImages)
      onImagesChange(newImages)

      // Only attempt CDN deletion if the image appears to be from our CDN
      // (contains our CDN domain or was uploaded through our system)
      const isCdnImage = imageUrl.includes(window.location.hostname) ||
                         imageUrl.includes('cloudinary') ||
                         imageUrl.includes('cdn') ||
                         imageUrl.startsWith('/uploads')

      if (isCdnImage) {
        // Delete from CDN
        const response = await fetch('/api/cdn/delete', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ fileUrl: imageUrl }),
        })

        if (!response.ok) {
          // Just log the error, don't revert since external URLs shouldn't block deletion
          console.warn("Failed to delete image from CDN storage:", imageUrl)
        } else {
          toast.success("Image deleted successfully!")
        }
      } else {
        // External URL - just removed from list
        toast.success("Image removed successfully!")
      }
    } catch (error) {
      console.error("Error deleting image:", error)
      toast.error("Failed to remove image")
      // Revert on error
      setImages(images)
      onImagesChange(images)
    }
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const handleAddUrl = () => {
    // Validate URL
    if (!imageUrl.trim()) {
      toast.error("Please enter an image URL")
      return
    }

    // Basic URL validation
    try {
      new URL(imageUrl)
    } catch {
      toast.error("Please enter a valid URL")
      return
    }

    // Check if URL is already added
    if (images.includes(imageUrl.trim())) {
      toast.error("This image URL is already added")
      return
    }

    // Check max images limit
    if (images.length >= maxImages) {
      toast.error(`Maximum ${maxImages} images allowed`)
      return
    }

    // Add URL to images
    const newImages = [...images, imageUrl.trim()]
    setImages(newImages)
    onImagesChange(newImages)

    // Reset URL input
    setImageUrl("")
    setShowUrlInput(false)
    toast.success("Image URL added successfully!")
  }

  const handleCancelUrl = () => {
    setImageUrl("")
    setShowUrlInput(false)
  }

  const remainingSlots = maxImages - images.length

  return (
    <div className={className}>
      <Label className="text-sm font-medium">{label}</Label>
      <div className="mt-2 space-y-4">
        {/* Image Grid */}
        {images.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {images.map((imageUrl, index) => (
              <Card key={index} className="relative overflow-hidden group">
                <CardContent className="p-0">
                  <div className="relative aspect-square">
                    <Image
                      src={imageUrl}
                      alt={`Image ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleDelete(imageUrl, index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Upload Button */}
        {remainingSlots > 0 && (
          <div className="space-y-4">
            {!showUrlInput ? (
              <Card className="border-dashed">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center justify-center text-center space-y-4">
                    <div className="p-4 bg-primary/10 rounded-full">
                      {uploading ? (
                        <LoadingSpinner size="lg" />
                      ) : (
                        <Upload className="h-8 w-8 text-primary" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        {images.length === 0 ? "Upload images or add by URL" : `Add more images`}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {remainingSlots} {remainingSlots === 1 ? 'slot' : 'slots'} remaining (max {maxImages})
                      </p>
                      <p className="text-xs text-muted-foreground">
                        PNG, JPG, GIF, WebP up to {maxSizeMB}MB
                      </p>
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept={accept}
                      multiple
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleUploadClick}
                        disabled={uploading}
                      >
                        {uploading ? (
                          <>
                            <LoadingSpinner size="sm" className="mr-2" />
                            Uploading...
                          </>
                        ) : (
                          <>
                            <ImageIcon className="mr-2 h-4 w-4" />
                            Upload Images
                          </>
                        )}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowUrlInput(true)}
                        disabled={uploading}
                      >
                        <LinkIcon className="mr-2 h-4 w-4" />
                        Add by URL
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="imageUrl">Image URL</Label>
                      <Input
                        id="imageUrl"
                        type="url"
                        placeholder="https://example.com/image.jpg"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault()
                            handleAddUrl()
                          }
                        }}
                        className="mt-2"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        onClick={handleAddUrl}
                        className="flex-1"
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Image
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleCancelUrl}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
