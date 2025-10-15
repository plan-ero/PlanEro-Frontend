"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import {
  Plus,
  Upload,
  Trash2,
  Image as ImageIcon,
  Camera,
  Eye,
  ExternalLink,
} from "lucide-react";
import { LoadingSpinner } from "@/components/loading-spinner";
import toast from "react-hot-toast";
import Image from "next/image";

interface GalleryImage {
  id: number;
  imageUrl: string;
  caption?: string;
  vendorId: number;
  createdAt: string;
}

export default function VendorGallery() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState("");
  const [newImageCaption, setNewImageCaption] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
      return;
    }

    if (session?.user && status === "authenticated") {
      fetchGallery();
    }
  }, [session, status, router]);

  const fetchGallery = async () => {
    try {
      setLoading(true);

      const response = await fetch(`/api/vendors/gallery`, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setImages(data);
      }
    } catch (error) {
      console.error("Error fetching gallery:", error);
      toast.error("Failed to load gallery");
    } finally {
      setLoading(false);
    }
  };

  const addImage = async () => {
    if (!newImageUrl.trim()) {
      toast.error("Please enter an image URL");
      return;
    }

    try {
      setUploading(true);

      const response = await fetch(`/api/vendors/gallery`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageUrl: newImageUrl,
          caption: newImageCaption || undefined,
        }),
      });

      if (response.ok) {
        toast.success("Image added successfully!");
        setDialogOpen(false);
        setNewImageUrl("");
        setNewImageCaption("");
        fetchGallery();
      } else {
        const error = await response.json();
        toast.error(error.message || "Failed to add image");
      }
    } catch (error) {
      console.error("Error adding image:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const deleteImage = async (imageId: number) => {
    if (!confirm("Are you sure you want to delete this image?")) return;

    try {
      const response = await fetch(`/api/vendors/gallery/${imageId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        toast.success("Image deleted successfully!");
        fetchGallery();
      } else {
        toast.error("Failed to delete image");
      }
    } catch (error) {
      console.error("Error deleting image:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  if (loading || status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 max-w-6xl">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Photo Gallery</h1>
            <p className="text-muted-foreground">
              Showcase your work to potential clients
            </p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Photo
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Photo</DialogTitle>
                <DialogDescription>
                  Add a photo to showcase your work
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="imageUrl">Image URL *</Label>
                  <Input
                    id="imageUrl"
                    placeholder="https://example.com/image.jpg"
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="caption">Caption</Label>
                  <Input
                    id="caption"
                    placeholder="Description of this photo..."
                    value={newImageCaption}
                    onChange={(e) => setNewImageCaption(e.target.value)}
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={addImage} disabled={uploading}>
                    {uploading ? (
                      <LoadingSpinner size="sm" className="mr-2" />
                    ) : (
                      <Upload className="h-4 w-4 mr-2" />
                    )}
                    Add Photo
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Gallery Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <ImageIcon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{images.length}</p>
                  <p className="text-sm text-muted-foreground">Total Photos</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Eye className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">-</p>
                  <p className="text-sm text-muted-foreground">Photo Views</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Camera className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {images.length > 0
                      ? new Date(images[0]?.createdAt).toLocaleDateString()
                      : "-"}
                  </p>
                  <p className="text-sm text-muted-foreground">Last Upload</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Gallery Grid */}
        {images.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center py-12">
              <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                <Camera className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No Photos Yet</h3>
              <p className="text-muted-foreground mb-4">
                Start building your portfolio by adding photos of your work
              </p>
              <Button onClick={() => setDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Photo
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {images.map((image) => (
              <Card key={image.id} className="group overflow-hidden">
                <div className="relative">
                  <AspectRatio ratio={4 / 3}>
                    <Image
                      src={image.imageUrl}
                      alt={image.caption || "Gallery image"}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/placeholder.jpg";
                      }}
                    />
                  </AspectRatio>

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => window.open(image.imageUrl, "_blank")}
                      >
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => deleteImage(image.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>

                {image.caption && (
                  <CardContent className="pt-4">
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {image.caption}
                    </p>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        )}

        {/* Tips */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="h-5 w-5" />
              Photography Tips
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-medium">✨ High Quality Images</p>
                <p className="text-muted-foreground">
                  Use high-resolution photos that showcase your best work
                </p>
              </div>
              <div>
                <p className="font-medium">📱 Multiple Angles</p>
                <p className="text-muted-foreground">
                  Show different perspectives and details of your services
                </p>
              </div>
              <div>
                <p className="font-medium">🎨 Variety</p>
                <p className="text-muted-foreground">
                  Include a diverse range of your work and styles
                </p>
              </div>
              <div>
                <p className="font-medium">📝 Descriptions</p>
                <p className="text-muted-foreground">
                  Add captions to provide context and details
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
