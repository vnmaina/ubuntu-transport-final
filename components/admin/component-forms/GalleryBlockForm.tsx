"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Image as ImageIcon, Video, ExternalLink, Images } from "lucide-react";
import { ComponentFormProps } from "./form-registry";
import { GalleryImage } from "@/components/blocks/GalleryBlock";
import { MediaUpload } from "@/components/ui/media-upload";

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = React.useState<T>(value);
  React.useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

export function GalleryBlockForm({ props, onChange, mode = "edit" }: ComponentFormProps) {
  const [localProps, setLocalProps] = React.useState(props);
  const [prevProps, setPrevProps] = React.useState(props);
  if (props !== prevProps) {
    setPrevProps(props);
    setLocalProps(props);
  }
  const debounced = useDebounce(localProps, 400);
  React.useEffect(() => {
    Object.keys(debounced).forEach((key) => {
      if (debounced[key] !== props[key]) onChange(key, debounced[key]);
    });
  }, [debounced, props, onChange]);

  const updateProp = (key: string, value: unknown) =>
    setLocalProps((prev: Record<string, unknown>) => ({ ...prev, [key]: value }));

  const images: GalleryImage[] = Array.isArray(localProps.images)
    ? localProps.images.map((img: GalleryImage | string) =>
        typeof img === "string" ? { url: img } : img
      )
    : [];

  const updateImage = (index: number, field: keyof GalleryImage, value: string) => {
    const next = images.map((img, i) =>
      i === index ? { ...img, [field]: value || undefined } : img
    );
    updateProp("images", next);
  };

  const addImage = () =>
    updateProp("images", [...images, { url: "", type: "image" }]);

  const removeImage = (index: number) =>
    updateProp("images", images.filter((_, i) => i !== index));

  if (mode === "form") {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2 rounded-lg bg-primary/5 p-3 text-xs text-muted-foreground">
          <Images className="h-4 w-4 text-primary" />
          Configure gallery images and metadata in the <strong>Edit</strong> tab.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Section copy */}
      <div className="space-y-3 rounded-xl border border-border p-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Section Copy
        </p>
        <div className="space-y-2">
          <Label className="text-sm font-medium">Title</Label>
          <Input
            value={localProps.title || ""}
            onChange={(e) => updateProp("title", e.target.value)}
            placeholder="Our Fleet & Destinations"
            className="h-10"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-medium">Subtitle</Label>
          <Input
            value={localProps.subtitle || ""}
            onChange={(e) => updateProp("subtitle", e.target.value)}
            placeholder="Kenya & beyond"
            className="h-10"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-medium">Text</Label>
          <Textarea
            value={localProps.text || ""}
            onChange={(e) => updateProp("text", e.target.value)}
            placeholder="A short description shown under the heading..."
            rows={3}
            className="resize-none"
          />
        </div>
      </div>

      {/* Media items */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Media Items ({images.length})
          </p>
          <Button type="button" size="sm" variant="secondary" onClick={addImage} className="h-8 gap-1.5 text-xs">
            <Plus className="h-3.5 w-3.5" /> Add Media
          </Button>
        </div>

        {images.length === 0 && (
          <div className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
            No media yet — click <strong>Add Media</strong> to start.
          </div>
        )}

        <div className="space-y-4">
          {images.map((img, i) => (
            <div key={i} className="space-y-3 rounded-xl border border-border bg-card p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {img.url ? (
                    img.type === "video" ? (
                      <Video className="h-4 w-4 text-primary" />
                    ) : (
                      <ImageIcon className="h-4 w-4 text-primary" />
                    )
                  ) : null}
                  <Badge variant="secondary" className="text-xs">Item {i + 1}</Badge>
                  <button
                    type="button"
                    onClick={() => updateImage(i, "type", img.type === "video" ? "image" : "video")}
                    className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide transition-colors ${
                      img.type === "video"
                        ? "bg-primary/10 text-primary"
                        : "bg-muted text-muted-foreground hover:text-foreground"
                    }`}
                    title="Toggle media type"
                  >
                    {img.type === "video" ? "Video" : "Image"}
                  </button>
                </div>
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7 text-muted-foreground hover:text-destructive"
                  onClick={() => removeImage(i)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              <MediaUpload
                value={img.url || ""}
                onChange={(url) => {
                  const ext = url.split("?")[0].split(".").pop()?.toLowerCase() || "";
                  const detected = ["mp4", "webm", "mov", "m4v", "ogg"].includes(ext) ? "video" : "image";
                  const next = images.map((item, j) =>
                    j === i ? { ...item, url: url || undefined, type: detected } : item
                  );
                  updateProp("images", next);
                }}
                label={img.type === "video" ? "Video" : "Image"}
                placeholder="Upload or paste a media URL"
                aspectRatio="video"
                maxSizeMB={50}
              />
              {img.url && (
                <div className="flex gap-3 text-xs">
                  <a
                    href={img.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground"
                  >
                    Open media <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              )}

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-muted-foreground">Title (caption)</Label>
                  <Input
                    value={img.title || ""}
                    onChange={(e) => updateImage(i, "title", e.target.value)}
                    placeholder="e.g. Maasai Mara sunrise"
                    className="h-9 text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-muted-foreground">Alt Text (SEO)</Label>
                  <Input
                    value={img.alt || ""}
                    onChange={(e) => updateImage(i, "alt", e.target.value)}
                    placeholder="Descriptive text for screen readers & Google"
                    className="h-9 text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-muted-foreground">Credit Text</Label>
                  <Input
                    value={img.credit || ""}
                    onChange={(e) => updateImage(i, "credit", e.target.value)}
                    placeholder="e.g. Photo: Jane Doe / KWS"
                    className="h-9 text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-muted-foreground">Link URL</Label>
                  <Input
                    value={img.link || ""}
                    onChange={(e) => updateImage(i, "link", e.target.value)}
                    placeholder="https://… (optional)"
                    className="h-9 text-xs"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <p className="text-xs leading-relaxed text-muted-foreground">
        <strong>SEO tip:</strong> Alt text is used as the image <code>alt</code> attribute and in the
        auto-generated <code>ImageGallery</code>/<code>ImageObject</code> JSON-LD. Credits appear in a
        caption line under the gallery. All fields are optional except the media URL.
      </p>
    </div>
  );
}
