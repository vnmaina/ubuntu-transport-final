"use client";

import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, X, ImageIcon, Link as LinkIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

interface ImageUploadProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  required?: boolean;
  aspectRatio?: "square" | "video" | "portrait" | "auto";
  maxSizeMB?: number;
}

export function ImageUpload({
  value,
  onChange,
  label = "Image",
  placeholder = "https://example.com/image.jpg",
  required = false,
  aspectRatio = "video",
  maxSizeMB = 5,
}: ImageUploadProps) {
  const [inputMode, setInputMode] = useState<"url" | "upload">("url");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (file: File) => {
    // Validate file size
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      toast.error(`File size exceeds ${maxSizeMB}MB limit`);
      return;
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    try {
      setIsUploading(true);
      setUploadProgress(0);

      // Step 1: Get upload URL from Convex
      const response = await fetch("/api/storage/upload-url", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to get upload URL");
      }

      const { uploadUrl } = await response.json();

      if (!uploadUrl) {
        throw new Error("No upload URL returned");
      }

      // Step 2: Upload file to Convex storage
      const uploadResponse = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });

      if (!uploadResponse.ok) {
        throw new Error("Failed to upload file");
      }

      setUploadProgress(50);

      // Step 3: Get the storage ID from the response
      const { storageId } = await uploadResponse.json();

      if (!storageId) {
        throw new Error("No storage ID returned");
      }

      // Step 4: Get the URL for the uploaded file
      const storageUrl = await fetch("/api/storage/url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ storageId }),
      });

      if (!storageUrl.ok) {
        throw new Error("Failed to get storage URL");
      }

      const { url } = await storageUrl.json();
      setUploadProgress(100);

      onChange(url);
      toast.success("Image uploaded successfully");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to upload image");
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleRemove = () => {
    onChange("");
  };

  const getAspectRatioClass = () => {
    switch (aspectRatio) {
      case "square":
        return "aspect-square";
      case "video":
        return "aspect-video";
      case "portrait":
        return "aspect-[3/4]";
      case "auto":
        return "aspect-auto";
      default:
        return "aspect-video";
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium text-foreground">
          {label} {required && <span className="text-destructive">*</span>}
        </Label>
        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant={inputMode === "url" ? "default" : "outline"}
            size="sm"
            onClick={() => setInputMode("url")}
            className="h-7 text-xs"
          >
            <LinkIcon className="w-3 h-3 mr-1" />
            URL
          </Button>
          <Button
            type="button"
            variant={inputMode === "upload" ? "default" : "outline"}
            size="sm"
            onClick={() => setInputMode("upload")}
            className="h-7 text-xs"
          >
            <Upload className="w-3 h-3 mr-1" />
            Upload
          </Button>
        </div>
      </div>

      {inputMode === "url" && (
        <div className="space-y-2">
          <Input
            type="url"
            placeholder={placeholder}
            value={value}
            onChange={handleUrlChange}
            className="h-10 font-mono text-sm"
          />
          {value && (
            <div className="relative group rounded-xl overflow-hidden border border-border bg-muted/30">
              <div className={"relative " + getAspectRatioClass()}>
                <Image
                  src={value}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = "none";
                    if (target.nextElementSibling) {
                      (target.nextElementSibling as HTMLElement).style.display = "flex";
                    }
                  }}
                  onLoad={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = "block";
                    if (target.nextElementSibling) {
                      (target.nextElementSibling as HTMLElement).style.display = "none";
                    }
                  }}
                
              fill
              sizes="100vw"
            />
                <div className="hidden absolute inset-0 items-center justify-center text-xs text-destructive bg-muted/50">
                  Failed to load image
                </div>
              </div>
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 h-7 w-7 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                onClick={handleRemove}
              >
                <X className="w-3.5 h-3.5" />
              </Button>
            </div>
          )}
        </div>
      )}

      {inputMode === "upload" && (
        <div className="space-y-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            disabled={isUploading}
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="w-full h-10 border-dashed"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Uploading... {uploadProgress}%
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Choose Image
              </>
            )}
          </Button>
          <p className="text-xs text-muted-foreground">
            Max file size: {maxSizeMB}MB. Supported formats: JPG, PNG, GIF, WebP
          </p>
          {value && (
            <div className="relative group rounded-xl overflow-hidden border border-border bg-muted/30">
              <div className={"relative " + getAspectRatioClass()}>
                <Image
                  src={value}
                  alt="Uploaded preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = "none";
                    if (target.nextElementSibling) {
                      (target.nextElementSibling as HTMLElement).style.display = "flex";
                    }
                  }}
                  onLoad={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = "block";
                    if (target.nextElementSibling) {
                      (target.nextElementSibling as HTMLElement).style.display = "none";
                    }
                  }}
                
              fill
              sizes="100vw"
            />
                <div className="hidden absolute inset-0 items-center justify-center text-xs text-destructive bg-muted/50">
                  Failed to load image
                </div>
              </div>
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 h-7 w-7 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                onClick={handleRemove}
              >
                <X className="w-3.5 h-3.5" />
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
