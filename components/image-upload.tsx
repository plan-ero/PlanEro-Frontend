"use client";

import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { LoadingSpinner } from "@/components/loading-spinner";
import { Upload, X, Image as ImageIcon, Link as LinkIcon } from "lucide-react";
import toast from "react-hot-toast";
import Image from "next/image";

interface ImageUploadProps {
  label: string;
  currentImageUrl?: string;
  onImageUploaded: (url: string) => void;
  onImageDeleted?: () => void;
  folder?: "profile-pictures" | "service-images" | "images";
  accept?: string;
  maxSizeMB?: number;
  className?: string;
}

export default function ImageUpload({
  label,
  currentImageUrl,
  onImageUploaded,
  onImageDeleted,
  folder = "images",
  accept = "image/*",
  maxSizeMB = 5,
  className = "",
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [preview, setPreview] = useState<string | null>(
    currentImageUrl || null,
  );
  //   const [showUrlInput, setShowUrlInput] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    // Validate file size
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      toast.error(`File size must be less than ${maxSizeMB}MB`);
      return;
    }

    // Show preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Upload file
    uploadFile(file);
  };

  const uploadFile = async (file: File) => {
    console.log("=== ImageUpload.uploadFile START ===");
    console.log("File name:", file.name);
    console.log("File size:", file.size, "bytes");
    console.log("File type:", file.type);
    console.log("Folder:", folder);

    try {
      setUploading(true);

      const formData = new FormData();
      formData.append("file", file);

      // Use specific endpoint based on folder
      let endpoint = "/api/upload/image";
      if (folder === "profile-pictures") {
        endpoint = "/api/upload/profile-picture";
      } else if (folder === "service-images") {
        endpoint = "/api/upload/service-image";
      } else {
        formData.append("folder", folder);
      }

      console.log("Upload endpoint:", endpoint);
      console.log("Sending request...");

      const response = await fetch(endpoint, {
        method: "POST",
        body: formData,
      });

      console.log("Response status:", response.status);
      console.log("Response OK:", response.ok);

      if (response.ok) {
        const data = await response.json();
        console.log("Response data:", data);
        console.log("Uploaded URL:", data.url);

        if (!data.url) {
          throw new Error("No URL returned from upload");
        }

        setPreview(data.url);
        onImageUploaded(data.url);
        toast.success("Image uploaded successfully!");
        console.log("=== ImageUpload.uploadFile END (SUCCESS) ===");
      } else {
        let errorMessage = "Failed to upload image";
        try {
          const error = await response.json();
          console.error("Upload failed with error:", error);
          errorMessage = error.error || error.message || errorMessage;
        } catch (e) {
          errorMessage = `Upload failed with status ${response.status}`;
        }

        toast.error(errorMessage);
        setPreview(currentImageUrl || null);
        console.log("=== ImageUpload.uploadFile END (FAILED) ===");
        console.error("Error details:", errorMessage);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Network error. Please try again.";
      toast.error(errorMessage);
      setPreview(currentImageUrl || null);
      console.log("=== ImageUpload.uploadFile END (EXCEPTION) ===");
      console.error("Exception details:", error);
    } finally {
      setUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleDelete = async () => {
    if (!preview && !currentImageUrl) return;

    console.log("=== ImageUpload.handleDelete START ===");
    const urlToDelete = preview || currentImageUrl;
    console.log("URL to delete:", urlToDelete);

    try {
      setDeleting(true);

      // Only attempt CDN deletion if the image appears to be from our CDN or S3
      const isCdnImage =
        urlToDelete &&
        (urlToDelete.includes(window.location.hostname) ||
          urlToDelete.includes("cloudinary") ||
          urlToDelete.includes("cdn") ||
          urlToDelete.includes("amazonaws.com") || // AWS S3
          urlToDelete.includes("s3.") || // S3 URLs
          urlToDelete.startsWith("/uploads"));

      console.log("Is CDN image:", isCdnImage);

      if (isCdnImage) {
        console.log("Attempting CDN deletion...");
        console.log(
          "Delete endpoint: /api/upload/image?url=" +
            encodeURIComponent(urlToDelete),
        );

        const response = await fetch("/api/upload/image", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ url: urlToDelete }),
        });

        console.log("Delete response status:", response.status);
        console.log("Delete response OK:", response.ok);

        if (!response.ok) {
          const responseText = await response.text();
          console.warn("Failed to delete image from CDN storage");
          console.warn("Response:", responseText);
        } else {
          const data = await response.json();
          console.log("Delete response data:", data);
        }
      } else {
        console.log("Skipping CDN deletion (external image)");
      }

      // Always remove from UI regardless of CDN deletion
      setPreview(null);
      if (onImageDeleted) {
        console.log("Calling onImageDeleted callback...");
        onImageDeleted();
      }
      toast.success("Image removed successfully!");
      console.log("=== ImageUpload.handleDelete END (SUCCESS) ===");
    } catch (error) {
      console.error("Error deleting image:", error);
      toast.error("Network error. Please try again.");
      console.log("=== ImageUpload.handleDelete END (EXCEPTION) ===");
    } finally {
      setDeleting(false);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleAddUrl = () => {
    // Validate URL
    if (!imageUrl.trim()) {
      toast.error("Please enter an image URL");
      return;
    }

    // Basic URL validation
    try {
      new URL(imageUrl);
    } catch {
      toast.error("Please enter a valid URL");
      return;
    }

    // Set preview and notify parent
    setPreview(imageUrl.trim());
    onImageUploaded(imageUrl.trim());

    // Reset URL input
    setImageUrl("");
    // setShowUrlInput(false);
    toast.success("Image URL added successfully!");
  };

  const handleCancelUrl = () => {
    setImageUrl("");
    // setShowUrlInput(false);
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <Label>{label}</Label>

      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileSelect}
        className="hidden"
      />

      <Card className="relative overflow-hidden">
        <CardContent className="p-0">
          {preview ? (
            <div className="relative group">
              <div className="relative w-full h-48">
                <Image
                  src={preview}
                  alt={label}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>

              <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={triggerFileSelect}
                  disabled={uploading || deleting}
                >
                  {uploading ? (
                    <LoadingSpinner size="sm" className="mr-2" />
                  ) : (
                    <Upload className="h-4 w-4 mr-2" />
                  )}
                  Replace
                </Button>

                <Button
                  size="sm"
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={uploading || deleting}
                >
                  {deleting ? (
                    <LoadingSpinner size="sm" className="mr-2" />
                  ) : (
                    <X className="h-4 w-4 mr-2" />
                  )}
                  Delete
                </Button>
              </div>
            </div>
          ) : (
            <>
              {
                <div
                  className="h-48 border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors cursor-pointer flex flex-col items-center justify-center space-y-3 p-6"
                  onClick={triggerFileSelect}
                >
                  {uploading ? (
                    <>
                      <LoadingSpinner size="lg" />
                      <p className="text-sm text-gray-500">Uploading...</p>
                    </>
                  ) : (
                    <>
                      <ImageIcon className="h-12 w-12 text-gray-400" />
                      <div className="text-center">
                        <p className="text-sm font-medium text-gray-700">
                          Click to upload {label.toLowerCase()}
                        </p>
                        <p className="text-xs text-gray-500">
                          PNG, JPG, GIF up to {maxSizeMB}MB
                        </p>
                      </div>
                      {/* <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowUrlInput(true);
                        }}
                      >
                        <LinkIcon className="mr-2 h-4 w-4" />
                        Or add by URL
                      </Button> */}
                    </>
                  )}
                </div>
              }
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
