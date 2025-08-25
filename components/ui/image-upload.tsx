"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { X, Upload, Image as ImageIcon, GripVertical } from "lucide-react";
import { toast } from "sonner";

interface ImageFile {
  id: string;
  file?: File;
  url?: string;
  altText: string;
  caption: string;
  order: number;
  isUploading?: boolean;
}

interface ImageUploadProps {
  images: ImageFile[];
  onImagesChange: (images: ImageFile[]) => void;
  maxImages?: number;
}

export function ImageUpload({
  images,
  onImagesChange,
  maxImages = 10,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (images.length + acceptedFiles.length > maxImages) {
        toast.error(`Maximum ${maxImages} images allowed`);
        return;
      }

      const newImages: ImageFile[] = acceptedFiles.map((file, index) => ({
        id: `temp-${Date.now()}-${index}`,
        file,
        altText: file.name.replace(/\.[^/.]+$/, ""), // Remove extension for alt text
        caption: "",
        order: images.length + index,
      }));

      onImagesChange([...images, ...newImages]);
    },
    [images, maxImages, onImagesChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif", ".webp"],
    },
    maxSize: 5 * 1024 * 1024, // 5MB
  });

  const removeImage = (id: string) => {
    onImagesChange(images.filter((img) => img.id !== id));
  };

  const updateImage = (id: string, updates: Partial<ImageFile>) => {
    onImagesChange(
      images.map((img) => (img.id === id ? { ...img, ...updates } : img))
    );
  };

  const reorderImages = (fromIndex: number, toIndex: number) => {
    const newImages = [...images];
    const [movedImage] = newImages.splice(fromIndex, 1);
    newImages.splice(toIndex, 0, movedImage);

    // Update order indices
    const reorderedImages = newImages.map((img, index) => ({
      ...img,
      order: index,
    }));

    onImagesChange(reorderedImages);
  };

  const uploadImages = async () => {
    setUploading(true);
    try {
      const uploadPromises = images
        .filter((img) => img.file) // Only upload new files
        .map(async (img) => {
          if (!img.file) return img;

          // Create FormData for file upload
          const formData = new FormData();
          formData.append("file", img.file);
          formData.append("altText", img.altText);
          formData.append("caption", img.caption);

          const response = await fetch("/api/upload/image", {
            method: "POST",
            body: formData,
          });

          if (!response.ok) {
            throw new Error("Upload failed");
          }

          const result = await response.json();
          return {
            ...img,
            url: result.url,
            file: undefined, // Remove file after upload
            isUploading: false,
          };
        });

      const uploadedImages = await Promise.all(uploadPromises);
      onImagesChange(uploadedImages);
      toast.success("Images uploaded successfully!");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload images");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <Card>
        <CardContent className="p-6">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive
                ? "border-primary bg-primary/5"
                : "border-muted-foreground/25 hover:border-primary/50"
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            {isDragActive ? (
              <p className="text-lg font-medium">Drop the images here...</p>
            ) : (
              <div>
                <p className="text-lg font-medium mb-2">
                  Drag & drop images here, or click to select
                </p>
                <p className="text-sm text-muted-foreground">
                  Supports JPG, PNG, GIF, WebP up to 5MB each
                </p>
                <p className="text-sm text-muted-foreground">
                  Maximum {maxImages} images
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Image List */}
      {images.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">
              Images ({images.length}/{maxImages})
            </h3>
            <Button
              onClick={uploadImages}
              disabled={uploading || images.every((img) => img.url)}
              size="sm"
            >
              {uploading ? "Uploading..." : "Upload All"}
            </Button>
          </div>

          <div className="grid gap-4">
            {images.map((image, index) => (
              <Card key={image.id}>
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    {/* Drag Handle */}
                    <div className="flex items-center">
                      <GripVertical className="h-5 w-5 text-muted-foreground cursor-move" />
                    </div>

                    {/* Image Preview */}
                    <div className="flex-shrink-0">
                      {image.url ? (
                        <img
                          src={image.url}
                          alt={image.altText}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                      ) : image.file ? (
                        <div className="w-20 h-20 bg-muted rounded-lg flex items-center justify-center">
                          <ImageIcon className="h-8 w-8 text-muted-foreground" />
                        </div>
                      ) : null}
                    </div>

                    {/* Image Details */}
                    <div className="flex-1 space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <Label htmlFor={`alt-${image.id}`}>Alt Text *</Label>
                          <Input
                            id={`alt-${image.id}`}
                            value={image.altText}
                            onChange={(e) =>
                              updateImage(image.id, { altText: e.target.value })
                            }
                            placeholder="Describe the image for accessibility"
                          />
                        </div>
                        <div>
                          <Label htmlFor={`caption-${image.id}`}>Caption</Label>
                          <Input
                            id={`caption-${image.id}`}
                            value={image.caption}
                            onChange={(e) =>
                              updateImage(image.id, { caption: e.target.value })
                            }
                            placeholder="Optional caption"
                          />
                        </div>
                      </div>

                      {image.file && (
                        <p className="text-sm text-muted-foreground">
                          File: {image.file.name} (
                          {(image.file.size / 1024 / 1024).toFixed(2)}MB)
                        </p>
                      )}

                      {image.url && (
                        <p className="text-sm text-green-600">
                          ✓ Uploaded successfully
                        </p>
                      )}
                    </div>

                    {/* Remove Button */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeImage(image.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
