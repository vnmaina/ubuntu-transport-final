"use client";

import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, X, Link as LinkIcon, Loader2, Film } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

interface MediaUploadProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  required?: boolean;
  aspectRatio?: "square" | "video" | "portrait" | "auto";
  maxSizeMB?: number;
  accept?: string;
}

function isVideoUrl(url: string) {
  return /\.(mp4|webm|mov|m4v|ogg)(\?|#|$)/i.test(url);
}

export function MediaUpload({
  value,
  onChange,
  label = "Media",
  placeholder = "https://example.com/media.jpg",
  required = false,
  aspectRatio = "video",
  maxSizeMB = 50,
  accept = "image/*,video/*",
}: MediaUploadProps) {
  const [inputMode, setInputMode] = useState<"url" | "upload">("url");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (file: File) => {
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      toast.error(`File size exceeds ${maxSizeMB}MB limit`);
      return;
    }
    if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) {
      toast.error("Please upload an image or video file");
      return;
    }

    try {
      setIsUploading(true);
      setUploadProgress(0);

      const response = await fetch("/api/storage/upload-url", { method: "POST" });
      if (!response.ok) throw new Error("Failed to get upload URL");
      const { uploadUrl } = await response.json();
      if (!uploadUrl) throw new Error("No upload URL returned");

      const uploadResponse = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });
      if (!uploadResponse.ok) throw new Error("Failed to upload file");

      setUploadProgress(50);
      const { storageId } = await uploadResponse.json();
      if (!storageId) throw new Error("No storage ID returned");

      const storageUrl = await fetch("/api/storage/url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ storageId }),
      });
      if (!storageUrl.ok) throw new Error("Failed to get storage URL");

      const { url } = await storageUrl.json();
      setUploadProgress(100);
      onChange(url);
      toast.success(`${file.type.startsWith("video/") ? "Video" : "Image"} uploaded successfully`);
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to upload media");
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileUpload(file);
    e.target.value = "";
  };

  const getAspectRatioClass = () => {
    switch (aspectRatio) {
      case "square": return "aspect-square";
      case "portrait": return "aspect-[3/4]";
      case "auto": return "aspect-auto";
      default: return "aspect-video";
    }
  };

  const preview = value ? (
    <div className="relative group rounded-xl overflow-hidden border border-border bg-muted/30">
      <div className={"relative " + getAspectRatioClass()}>
        {isVideoUrl(value) ? (
          <video
            src={value}
            muted
            playsInline
            preload="metadata"
            className="w-full h-full object-cover"
          />
        ) : (
          <Image
            src={value}
            alt="Media preview"
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = "none";
              if (target.nextElementSibling) {
                (target.nextElementSibling as HTMLElement).style.display = "flex";
              }
            }}
          
              fill
              sizes="100vw"
            />
        )}
        <div className="hidden absolute inset-0 items-center justify-center text-xs text-destructive bg-muted/50">
          Failed to load media
        </div>
        {isVideoUrl(value) && (
          <div className="absolute bottom-2 left-2 flex items-center gap-1 rounded-full bg-black/70 px-2 py-0.5 text-[10px] font-semibold uppercase text-white">
            <Film className="h-3 w-3" /> Video
          </div>
        )}
      </div>
      <Button
        type="button"
        variant="destructive"
        size="icon"
        className="absolute top-2 right-2 h-7 w-7 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
        onClick={() => onChange("")}
      >
        <X className="w-3.5 h-3.5" />
      </Button>
    </div>
  ) : null;

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
            onChange={(e) => onChange(e.target.value)}
            className="h-10 font-mono text-sm"
          />
          {preview}
        </div>
      )}

      {inputMode === "upload" && (
        <div className="space-y-2">
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
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
                Choose Image or Video
              </>
            )}
          </Button>
          <p className="text-xs text-muted-foreground">
            Max file size: {maxSizeMB}MB. Images: JPG, PNG, GIF, WebP · Videos: MP4, WebM, MOV
          </p>
          {preview}
        </div>
      )}
    </div>
  );
}
