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
  DialogFooter,
} from "@/components/ui/dialog";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import {
  Plus,
  Upload,
  Trash2,
  Image as ImageIcon,
  Camera,
  Eye,
  ExternalLink,
  Maximize2,
  MoreVertical,
  X,
  Sparkles,
  Lightbulb
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LoadingSpinner } from "@/components/loading-spinner";
import toast from "react-hot-toast";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

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
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

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
        if (selectedImage?.id === imageId) {
          setSelectedImage(null);
        }
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
    <div className="container mx-auto py-8 max-w-7xl px-4">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-8 rounded-3xl border border-primary/10">
          <div>
            <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
              Photo Gallery
            </h1>
            <p className="text-muted-foreground mt-2">
              Showcase your best work to attract more clients
            </p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="rounded-full shadow-lg hover:shadow-xl transition-all">
                <Plus className="h-5 w-5 mr-2" />
                Add New Photo
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Photo</DialogTitle>
                <DialogDescription>
                  Add a photo URL to showcase your work.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
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
                  <Label htmlFor="caption">Caption (Optional)</Label>
                  <Input
                    id="caption"
                    placeholder="e.g., Wedding at Grand Hotel"
                    value={newImageCaption}
                    onChange={(e) => setNewImageCaption(e.target.value)}
                  />
                </div>

                {newImageUrl && (
                  <div className="mt-4 rounded-lg overflow-hidden border bg-muted aspect-video relative">
                    <img
                      src={newImageUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/placeholder.jpg";
                      }}
                    />
                  </div>
                )}
              </div>

              <DialogFooter>
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
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Gallery Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="border-none shadow-md bg-gradient-to-br from-blue-50 to-transparent dark:from-blue-900/20">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/40 rounded-xl text-blue-600 dark:text-blue-400">
                    <ImageIcon className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold">{images.length}</p>
                    <p className="text-sm text-muted-foreground font-medium">Total Photos</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="border-none shadow-md bg-gradient-to-br from-purple-50 to-transparent dark:from-purple-900/20">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-100 dark:bg-purple-900/40 rounded-xl text-purple-600 dark:text-purple-400">
                    <Eye className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold">-</p>
                    <p className="text-sm text-muted-foreground font-medium">Total Views</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="border-none shadow-md bg-gradient-to-br from-amber-50 to-transparent dark:from-amber-900/20">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-amber-100 dark:bg-amber-900/40 rounded-xl text-amber-600 dark:text-amber-400">
                    <Camera className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-lg font-bold truncate">
                      {images.length > 0
                        ? new Date(images[0]?.createdAt).toLocaleDateString()
                        : "No uploads"}
                    </p>
                    <p className="text-sm text-muted-foreground font-medium">Last Upload</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Gallery Grid */}
        <AnimatePresence>
          {images.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <Card className="border-dashed border-2 bg-muted/30">
                <CardContent className="pt-6 text-center py-20">
                  <div className="mx-auto w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                    <Camera className="h-10 w-10 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Your Gallery is Empty</h3>
                  <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                    Photos are the first thing clients look at. Start building your portfolio by adding high-quality images of your work.
                  </p>
                  <Button onClick={() => setDialogOpen(true)} size="lg">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Photo
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {images.map((image, index) => (
                <motion.div
                  key={image.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  layoutId={`image-${image.id}`}
                >
                  <Card className="group overflow-hidden border-none shadow-md hover:shadow-xl transition-all duration-300 h-full bg-card">
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <Image
                        src={image.imageUrl}
                        alt={image.caption || "Gallery image"}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "/placeholder.jpg";
                        }}
                      />

                      {/* Overlay */}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                        <Button
                          size="icon"
                          variant="secondary"
                          className="rounded-full h-10 w-10 bg-white/90 hover:bg-white text-black"
                          onClick={() => setSelectedImage(image)}
                        >
                          <Maximize2 className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="destructive"
                          className="rounded-full h-10 w-10"
                          onClick={() => deleteImage(image.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="p-3">
                      <p className="text-sm font-medium truncate">
                        {image.caption || "Untitled Image"}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Added {new Date(image.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>

        {/* Image Preview Modal */}
        <Dialog open={!!selectedImage} onOpenChange={(open) => !open && setSelectedImage(null)}>
          <DialogContent className="max-w-4xl p-0 overflow-hidden bg-black border-none">
            <div className="relative w-full h-[80vh] flex items-center justify-center bg-black">
              {selectedImage && (
                <>
                  <img
                    src={selectedImage.imageUrl}
                    alt={selectedImage.caption || "Gallery preview"}
                    className="max-w-full max-h-full object-contain"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent text-white">
                    <h3 className="text-xl font-bold">{selectedImage.caption || "Untitled Image"}</h3>
                    <p className="text-sm text-white/70 mt-1">
                      Added on {new Date(selectedImage.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-full"
                    onClick={() => setSelectedImage(null)}
                  >
                    <X className="h-6 w-6" />
                  </Button>
                </>
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* Tips Section */}
        <Card className="bg-gradient-to-br from-primary/5 to-transparent border-primary/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Lightbulb className="h-5 w-5 text-yellow-500" />
              Pro Tips for a Stunning Gallery
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="flex gap-3">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary font-bold text-sm">1</div>
                <div>
                  <h4 className="font-semibold text-sm mb-1">High Resolution</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Upload clear, high-quality images. Blurry photos can look unprofessional.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary font-bold text-sm">2</div>
                <div>
                  <h4 className="font-semibold text-sm mb-1">Show Variety</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Include different angles, setups, and event types to show your versatility.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary font-bold text-sm">3</div>
                <div>
                  <h4 className="font-semibold text-sm mb-1">Good Lighting</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Ensure your photos are well-lit. Natural light often works best.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary font-bold text-sm">4</div>
                <div>
                  <h4 className="font-semibold text-sm mb-1">Tell a Story</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Use captions to describe the event and your specific contribution.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
