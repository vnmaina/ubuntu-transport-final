"use client";

import React, { useState, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RichTextEditor } from "@/components/rich-text-editor";
import { ImageUpload } from "@/components/ui/image-upload";
import { ImageArrayUpload } from "@/components/ui/image-array-upload";
import {
  Plus,
  Trash2,
  Image as ImageIcon,
  Check,
  Globe,
  Tag,
  DollarSign,
  Clock,
  Sparkles,
  Link as LinkIcon,
  Package,
  Calendar,
  Search,
  ExternalLink,
  Loader2,
  X,
  FileText,
  Share2,
  Sliders,
} from "lucide-react";
import Image from "next/image";

export interface ItemFormData {
  title: string;
  slug: string;
  description: string;
  content: string;
  imageUrl: string;
  icon: string;
  tags: string[];
  gallery: string[];
  galleryType: "grid" | "carousel" | "masonry" | "slider";
  contentBlocks: Array<{
    id: string;
    type: "hero" | "timeline" | "specifications" | "testimonials" | "cta" | "image" | "text" | "divider";
    title?: string;
    content?: string;
    data?: any;
    order: number;
  }>;
  metadata: {
    duration?: string;
    features: string[];
    client?: string;
    projectDate?: string;
    technologies: string[];
    projectUrl?: string;
    role?: string;
    email?: string;
    linkedin?: string;
    twitter?: string;
    github?: string;
    instagram?: string;
    facebook?: string;
    youtube?: string;
    tiktok?: string;
    dribbble?: string;
    behance?: string;
    website?: string;
    bio?: string;
    department?: string;
    hireDate?: string;
    location?: string;
    expertise: string[];
    achievements: string[];
    sku?: string;
    stock?: number;
    price?: string;
    pricingType?: "one-time" | "subscription" | "hourly" | "daily" | "monthly" | "yearly" | "project";
  };
  faq: Array<{ question: string; answer: string }>;
  reviews: Array<{ author: string; rating: number; comment: string; date: string }>;
  metaTitle: string;
  metaDescription: string;
  ogImage: string;
  twitterCard: string;
  canonicalUrl: string;
  robots: string;
  published: boolean;
  order: number;
}

interface ItemFormSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  collectionName: string;
  collectionSlug: string;
  collectionIcon?: string;
  formData: ItemFormData;
  setFormData: React.Dispatch<React.SetStateAction<ItemFormData>>;
  onSubmit: () => Promise<void>;
  isSubmitting?: boolean;
}

const QUICK_EMOJIS = ["⭐", "🚀", "💻", "🎯", "💡", "🛡️", "📈", "🎨", "👥", "📦", "⚡", "🔥", "🏆", "💎", "🛠️", "✨"];

const ICON_NAME_TO_EMOJI: Record<string, string> = {
  briefcase: "💼",
  folder: "📁",
  users: "👥",
  package: "📦",
  services: "💼",
  projects: "📁",
  team: "👥",
  products: "📦",
};

function getItemIconDisplay(icon?: string): string {
  if (!icon) return "📦";
  // If it's already an emoji (single character or emoji), return as is
  if (icon.length > 1 && !/^[a-zA-Z]+$/.test(icon)) return icon;
  // Otherwise, map text name to emoji
  return ICON_NAME_TO_EMOJI[icon] || "📦";
}

export function ItemFormSheet({
  open,
  onOpenChange,
  mode,
  collectionName,
  collectionSlug,
  collectionIcon = "📦",
  formData,
  setFormData,
  onSubmit,
  isSubmitting = false,
}: ItemFormSheetProps) {
  const displayCollectionIcon = getItemIconDisplay(collectionIcon);
  const [tagInput, setTagInput] = useState("");
  const [featureInput, setFeatureInput] = useState("");
  const [isManualSlug, setIsManualSlug] = useState(mode === "edit");
  const [imageError, setImageError] = useState(false);

  // Auto slug generation in create mode
  const handleTitleChange = (val: string) => {
    if (mode === "create" && !isManualSlug) {
      const generatedSlug = val
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");
      setFormData((prev) => ({ ...prev, title: val, slug: generatedSlug }));
    } else {
      setFormData((prev) => ({ ...prev, title: val }));
    }
  };

  const handleSlugChange = (val: string) => {
    setIsManualSlug(true);
    const cleaned = val
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
    setFormData((prev) => ({ ...prev, slug: cleaned }));
  };

  const addTag = () => {
    const trimmed = tagInput.trim();
    if (trimmed && !formData.tags.includes(trimmed)) {
      setFormData((prev) => ({ ...prev, tags: [...prev.tags, trimmed] }));
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    setFormData((prev) => ({ ...prev, tags: prev.tags.filter((t) => t !== tag) }));
  };

  const addFeature = () => {
    const trimmed = featureInput.trim();
    if (trimmed && !formData.metadata.features.includes(trimmed)) {
      setFormData((prev) => ({
        ...prev,
        metadata: { ...prev.metadata, features: [...prev.metadata.features, trimmed] },
      }));
      setFeatureInput("");
    }
  };

  const removeFeature = (feature: string) => {
    setFormData((prev) => ({
      ...prev,
      metadata: { ...prev.metadata, features: prev.metadata.features.filter((f) => f !== feature) },
    }));
  };

  // SEO Snippet Preview helpers
  const seoTitle = formData.metaTitle.trim() || formData.title || "Item Title";
  const seoDesc =
    formData.metaDescription.trim() ||
    (formData.description ? formData.description.replace(/<[^>]*>?/gm, "").slice(0, 150) : "No description provided yet.");
  const displayUrl = `https://yourdomain.com/collections/${collectionSlug}/${formData.slug || "item-slug"}`;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="p-0 flex flex-col h-full bg-background border-l border-border shadow-2xl focus:outline-none !w-full sm:!max-w-none md:!w-1/2 md:!max-w-[50%]"
      >
        {/* Top Header */}
        <SheetHeader className="px-8 py-4 border-b bg-card shrink-0 flex flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-xl shrink-0 border border-primary/20">
              {getItemIconDisplay(formData.icon || displayCollectionIcon)}
            </div>
            <div className="min-w-0">
              <SheetTitle className="text-xl font-bold truncate text-foreground">
                {mode === "create" ? "Add New Item" : "Edit Item"}
              </SheetTitle>
              <SheetDescription className="text-xs text-muted-foreground truncate">
                {collectionName} &bull; /collections/{collectionSlug}/
              </SheetDescription>
            </div>
          </div>
          <div className="flex items-center gap-2 mr-8">
            <Badge variant={formData.published ? "default" : "secondary"} className="text-xs px-2.5 py-0.5 font-medium">
              {formData.published ? "Published" : "Draft"}
            </Badge>
          </div>
        </SheetHeader>

        {/* Scrollable Form Body with Accordion */}
        <div className="flex-1 overflow-y-auto px-8 py-6">
          <Accordion className="space-y-4">
            {/* SECTION 1: BASIC INFO */}
            <AccordionItem value="basic" className="border border-border/80 rounded-2xl bg-card shadow-sm overflow-hidden">
              <AccordionTrigger className="px-6 py-4 hover:no-underline data-[state=open]:bg-muted/30">
                <div className="flex items-center gap-3">
                  <span className="text-xl">📋</span>
                  <span className="text-sm font-semibold">Basic Information</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6 pt-0">
                <div className="space-y-6 pt-4">
              {/* Title & Slug Group */}
              <div className="bg-card border border-border/80 rounded-2xl p-6 shadow-sm space-y-5">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="item-title" className="text-sm font-bold text-foreground">
                      Item Title <span className="text-destructive">*</span>
                    </Label>
                    <span className="text-xs text-muted-foreground">{formData.title.length} characters</span>
                  </div>
                  <Input
                    id="item-title"
                    placeholder="e.g., Enterprise Custom Cloud Infrastructure"
                    value={formData.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    className="h-11 text-base rounded-xl font-medium focus-visible:ring-primary"
                    autoFocus
                  />
                  <p className="text-xs text-muted-foreground">The primary name displayed on cards, headings, and search engines.</p>
                </div>

                <div className="space-y-2 pt-2">
                  <Label htmlFor="item-slug" className="text-sm font-bold text-foreground">
                    URL Slug <span className="text-destructive">*</span>
                  </Label>
                  <div className="flex items-stretch rounded-xl border border-input bg-muted/20 focus-within:ring-2 focus-within:ring-primary focus-within:border-primary overflow-hidden transition-all">
                    <div className="flex items-center px-3.5 bg-muted/50 border-r border-border text-xs font-mono text-muted-foreground select-none shrink-0">
                      /collections/{collectionSlug}/
                    </div>
                    <Input
                      id="item-slug"
                      placeholder="enterprise-custom-cloud"
                      value={formData.slug}
                      onChange={(e) => handleSlugChange(e.target.value)}
                      className="border-0 shadow-none focus-visible:ring-0 rounded-none bg-transparent font-mono text-sm h-11 px-3 flex-1"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Direct access URL: <code className="text-primary font-mono font-semibold">/collections/{collectionSlug}/{formData.slug || "slug"}</code>
                  </p>
                </div>
              </div>

              {/* Description / Summary */}
              <div className="bg-card border border-border/80 rounded-2xl p-6 shadow-sm space-y-4">
                <div className="space-y-1">
                  <Label htmlFor="item-description" className="text-sm font-bold text-foreground">
                    Summary / Card Excerpt
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    A brief, compelling overview used for card previews, search results, and listings.
                  </p>
                </div>
                <div className="border border-border rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-primary">
                  <RichTextEditor
                    content={formData.description}
                    onChange={(content) => setFormData((prev) => ({ ...prev, description: content }))}
                    placeholder="Brief description for previews, feature cards, and meta tags..."
                    minHeight="140px"
                  />
                </div>
              </div>

              {/* Visual Assets (Image & Icon) */}
              <div className="bg-card border border-border/80 rounded-2xl p-6 shadow-sm space-y-6">
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-primary" /> Visual Assets
                  </h4>
                  <p className="text-xs text-muted-foreground">Featured cover image and fallback icon badge.</p>
                </div>

                {/* Image URL & Preview */}
                <div className="space-y-2">
                  <ImageUpload
                    value={formData.imageUrl}
                    onChange={(value) => {
                      setImageError(false);
                      setFormData((prev) => ({ ...prev, imageUrl: value }));
                    }}
                    label="Cover Image"
                    placeholder="https://images.unsplash.com/photo-..."
                    aspectRatio="video"
                  />
                </div>

                {/* Icon Picker */}
                <div className="space-y-2">
                  <Label htmlFor="item-icon" className="text-xs font-semibold text-foreground">
                    Icon (Emoji or Symbol)
                  </Label>
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center text-xl shrink-0">
                      {getItemIconDisplay(formData.icon || displayCollectionIcon)}
                    </div>
                    <Input
                      id="item-icon"
                      placeholder="e.g., 🚀, 💻, 🎯"
                      value={formData.icon}
                      onChange={(e) => setFormData((prev) => ({ ...prev, icon: e.target.value }))}
                      className="h-10 text-base rounded-xl flex-1"
                    />
                  </div>
                  {/* Quick Emojis */}
                  <div className="pt-1">
                    <span className="text-[11px] text-muted-foreground block mb-1.5 font-medium">Quick Pick:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {QUICK_EMOJIS.map((emoji) => (
                        <button
                          key={emoji}
                          type="button"
                          onClick={() => setFormData((prev) => ({ ...prev, icon: emoji }))}
                          className={`w-7 h-7 rounded-lg text-sm flex items-center justify-center transition-all ${
                            formData.icon === emoji
                              ? "bg-primary text-primary-foreground scale-110 shadow-xs ring-2 ring-primary"
                              : "bg-muted/60 hover:bg-muted text-foreground hover:scale-105"
                          }`}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Tags & Taxonomy */}
              <div className="bg-card border border-border/80 rounded-2xl p-6 shadow-sm space-y-4">
                <div className="space-y-1">
                  <Label className="text-sm font-bold text-foreground flex items-center gap-2">
                    <Tag className="w-4 h-4 text-primary" /> Categorization Tags
                  </Label>
                  <p className="text-xs text-muted-foreground">Add tags to enable filtering, badge pills, and search indexing.</p>
                </div>

                <div className="flex gap-2">
                  <Input
                    placeholder="Type tag name and press Enter..."
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addTag();
                      }
                    }}
                    className="h-10 text-sm rounded-xl flex-1"
                  />
                  <Button type="button" onClick={addTag} variant="secondary" className="h-10 px-4 rounded-xl gap-1 font-medium">
                    <Plus className="w-4 h-4" /> Add
                  </Button>
                </div>

                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {formData.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="px-3 py-1 text-xs rounded-lg gap-1.5 bg-muted/80 hover:bg-muted font-medium text-foreground border border-border"
                      >
                        <span>{tag}</span>
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="hover:text-destructive text-muted-foreground transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
              </div>
              </AccordionContent>
            </AccordionItem>

            {/* SECTION 2: FULL CONTENT */}
            <AccordionItem value="content" className="border border-border/80 rounded-2xl bg-card shadow-sm overflow-hidden">
              <AccordionTrigger className="px-6 py-4 hover:no-underline data-[state=open]:bg-muted/30">
                <div className="flex items-center gap-3">
                  <span className="text-xl">📝</span>
                  <span className="text-sm font-semibold">Content & Details</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6 pt-0">
                <div className="space-y-6 pt-4">
              <div className="bg-card border border-border/80 rounded-2xl p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                      <FileText className="w-4 h-4 text-primary" /> Long-form Article &amp; Detail Page Content
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      Use the rich text editor to author complete detail pages with headings, lists, quotes, colors, and formatting.
                    </p>
                  </div>
                </div>

                <div className="border border-border rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-primary shadow-xs">
                  <RichTextEditor
                    content={formData.content}
                    onChange={(content) => setFormData((prev) => ({ ...prev, content }))}
                    placeholder="Write detailed documentation, case study, service specifications, pricing breakdown, or story..."
                    minHeight="450px"
                  />
                </div>
              </div>
              </div>
              </AccordionContent>
            </AccordionItem>

            {/* SECTION 3: METADATA & FIELDS */}
            <AccordionItem value="metadata" className="border border-border/80 rounded-2xl bg-card shadow-sm overflow-hidden">
              <AccordionTrigger className="px-6 py-4 hover:no-underline data-[state=open]:bg-muted/30">
                <div className="flex items-center gap-3">
                  <span className="text-xl">⚙️</span>
                  <span className="text-sm font-semibold">Metadata & Custom Fields</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6 pt-0">
                <div className="space-y-6 pt-4">
              <div className="p-4 rounded-xl border border-primary/30 bg-primary/5 text-xs text-primary flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 shrink-0 text-primary" />
                <span>
                  Configure specialized fields for your collection items. Fill in whichever fields fit your content model.
                </span>
              </div>

              {/* 1. Timeline */}
              <div className="bg-card border border-border/80 rounded-2xl p-6 shadow-sm space-y-5">
                <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Clock className="w-4 h-4 text-emerald-500" /> Timeline
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <Label htmlFor="meta-duration" className="text-xs font-semibold text-foreground">
                      Duration / Turnaround
                    </Label>
                    <Input
                      id="meta-duration"
                      placeholder="e.g., 2 weeks, 45 minutes, Ongoing"
                      value={formData.metadata.duration || ""}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          metadata: { ...prev.metadata, duration: e.target.value },
                        }))
                      }
                      className="h-10 text-sm rounded-xl"
                    />
                  </div>
                </div>
              </div>

              {/* 2. Key Highlights / Bullet Features */}
              <div className="bg-card border border-border/80 rounded-2xl p-6 shadow-sm space-y-4">
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                    <Check className="w-4 h-4 text-primary" /> Key Features &amp; Highlights
                  </h4>
                  <p className="text-xs text-muted-foreground">Add list bullets (e.g. for service plans, deliverables, key benefits).</p>
                </div>

                <div className="flex gap-2">
                  <Input
                    placeholder="e.g., 24/7 dedicated support & SLA..."
                    value={featureInput}
                    onChange={(e) => setFeatureInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addFeature();
                      }
                    }}
                    className="h-10 text-sm rounded-xl flex-1"
                  />
                  <Button type="button" onClick={addFeature} variant="secondary" className="h-10 px-4 rounded-xl gap-1">
                    <Plus className="w-4 h-4" /> Add
                  </Button>
                </div>

                {formData.metadata.features.length > 0 && (
                  <div className="space-y-2 pt-1">
                    {formData.metadata.features.map((feature, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-2.5 rounded-xl border border-border bg-muted/30 text-xs font-medium text-foreground"
                      >
                        <div className="flex items-center gap-2 truncate">
                          <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                          <span className="truncate">{feature}</span>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-muted-foreground hover:text-destructive"
                          onClick={() => removeFeature(feature)}
                        >
                          <X className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 3. Commerce & Inventory */}
              <div className="bg-card border border-border/80 rounded-2xl p-6 shadow-sm space-y-5">
                <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Package className="w-4 h-4 text-amber-500" /> Commerce &amp; Inventory
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <Label htmlFor="meta-price" className="text-xs font-semibold text-foreground">
                      Price
                    </Label>
                    <Input
                      id="meta-price"
                      placeholder="e.g., 120000 or $100"
                      value={formData.metadata.price || ""}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          metadata: { ...prev.metadata, price: e.target.value },
                        }))
                      }
                      className="h-10 text-sm rounded-xl font-mono"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="meta-pricingType" className="text-xs font-semibold text-foreground">
                      Pricing Type
                    </Label>
                    <Select
                      value={formData.metadata.pricingType || ""}
                      onValueChange={(val) =>
                        setFormData((prev) => ({
                          ...prev,
                          metadata: { ...prev.metadata, pricingType: val as any },
                        }))
                      }
                    >
                      <SelectTrigger id="meta-pricingType" className="h-10 rounded-xl">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="one-time">One-time</SelectItem>
                        <SelectItem value="subscription">Subscription</SelectItem>
                        <SelectItem value="hourly">Hourly</SelectItem>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="yearly">Yearly</SelectItem>
                        <SelectItem value="project">Project</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="meta-sku" className="text-xs font-semibold text-foreground">
                      SKU Code
                    </Label>
                    <Input
                      id="meta-sku"
                      placeholder="SKU-8921"
                      value={formData.metadata.sku || ""}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          metadata: { ...prev.metadata, sku: e.target.value },
                        }))
                      }
                      className="h-10 text-sm rounded-xl font-mono"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="meta-stock" className="text-xs font-semibold text-foreground">
                      Available Stock Units
                    </Label>
                    <Input
                      id="meta-stock"
                      type="number"
                      placeholder="0"
                      value={formData.metadata.stock ?? ""}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          metadata: { ...prev.metadata, stock: parseInt(e.target.value) || 0 },
                        }))
                      }
                      className="h-10 text-sm rounded-xl"
                    />
                  </div>
                </div>
              </div>
              </div>
              </AccordionContent>
            </AccordionItem>

            {/* SECTION 4: GALLERY */}
            <AccordionItem value="gallery" className="border border-border/80 rounded-2xl bg-card shadow-sm overflow-hidden">
              <AccordionTrigger className="px-6 py-4 hover:no-underline data-[state=open]:bg-muted/30">
                <div className="flex items-center gap-3">
                  <span className="text-xl">🖼️</span>
                  <span className="text-sm font-semibold">Gallery</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6 pt-0">
                <div className="space-y-6 pt-4">
              <div className="p-4 rounded-xl border border-primary/30 bg-primary/5 text-xs text-primary flex items-center gap-2.5">
                <ImageIcon className="w-4 h-4 shrink-0 text-primary" />
                <span>Add multiple images and choose display style for your gallery.</span>
              </div>

              <div className="bg-card border border-border/80 rounded-2xl p-6 shadow-sm space-y-5">
                <div className="space-y-2">
                  <Label className="text-sm font-bold text-foreground flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-primary" /> Gallery Type
                  </Label>
                  <p className="text-xs text-muted-foreground">Choose how images are displayed on the item page.</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {["grid", "carousel", "masonry", "slider"].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, galleryType: type as any }))}
                      className={`p-4 rounded-xl border text-sm font-medium transition-all ${
                        formData.galleryType === type
                          ? "bg-primary text-primary-foreground border-primary shadow-sm"
                          : "bg-card border-border/80 hover:border-primary/50 text-foreground"
                      }`}
                    >
                      <div className="text-2xl mb-2">
                        {type === "grid" && "⊞"}
                        {type === "carousel" && "◀▶"}
                        {type === "masonry" && "▦"}
                        {type === "slider" && "▮"}
                      </div>
                      <span className="capitalize">{type}</span>
                    </button>
                  ))}
                </div>

                <div className="space-y-2 pt-4">
                  <ImageArrayUpload
                    value={formData.gallery}
                    onChange={(value) => setFormData((prev) => ({ ...prev, gallery: value }))}
                    label="Gallery Images"
                    placeholder="https://images.unsplash.com/photo-..."
                    aspectRatio="video"
                  />
                </div>
              </div>
              </div>
              </AccordionContent>
            </AccordionItem>

            {/* SECTION 5: CONTENT BLOCKS */}
            <AccordionItem value="blocks" className="border border-border/80 rounded-2xl bg-card shadow-sm overflow-hidden">
              <AccordionTrigger className="px-6 py-4 hover:no-underline data-[state=open]:bg-muted/30">
                <div className="flex items-center gap-3">
                  <span className="text-xl">🧱</span>
                  <span className="text-sm font-semibold">Content Blocks</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6 pt-0">
                <div className="space-y-6 pt-4">
              <div className="p-4 rounded-xl border border-primary/30 bg-primary/5 text-xs text-primary flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 shrink-0 text-primary" />
                <span>Add dynamic content blocks like timelines, testimonials, CTAs, and more to your item page.</span>
              </div>

              <div className="bg-card border border-border/80 rounded-2xl p-6 shadow-sm space-y-5">
                <div className="space-y-2">
                  <Label className="text-sm font-bold text-foreground flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-primary" /> Content Blocks
                  </Label>
                  <p className="text-xs text-muted-foreground">Add dynamic sections to enhance your item page.</p>
                </div>

                <div className="space-y-4">
                  {formData.contentBlocks.map((block, index) => (
                    <div key={block.id} className="border border-border/80 rounded-xl p-4 space-y-3">
                      <div className="flex justify-between items-start">
                        <span className="text-xs font-medium text-muted-foreground">Block {index + 1}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            const newBlocks = formData.contentBlocks.filter((_, i) => i !== index);
                            setFormData((prev) => ({ ...prev, contentBlocks: newBlocks }));
                          }}
                          className="h-7 w-7 rounded-lg text-muted-foreground hover:text-destructive"
                        >
                          <X className="w-3.5 h-3.5" />
                        </Button>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <Label className="text-xs font-semibold">Block Type</Label>
                          <Select
                            value={block.type}
                            onValueChange={(value) => {
                              const newBlocks = [...formData.contentBlocks];
                              newBlocks[index] = { ...newBlocks[index], type: value as any };
                              setFormData((prev) => ({ ...prev, contentBlocks: newBlocks }));
                            }}
                          >
                            <SelectTrigger className="h-10 rounded-xl">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="hero">Hero Section</SelectItem>
                              <SelectItem value="timeline">Timeline</SelectItem>
                              <SelectItem value="specifications">Specifications</SelectItem>
                              <SelectItem value="testimonials">Testimonials</SelectItem>
                              <SelectItem value="cta">Call to Action</SelectItem>
                              <SelectItem value="image">Image</SelectItem>
                              <SelectItem value="text">Text</SelectItem>
                              <SelectItem value="divider">Divider</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs font-semibold">Order</Label>
                          <Input
                            type="number"
                            value={block.order}
                            onChange={(e) => {
                              const newBlocks = [...formData.contentBlocks];
                              newBlocks[index] = { ...newBlocks[index], order: parseInt(e.target.value) || 0 };
                              setFormData((prev) => ({ ...prev, contentBlocks: newBlocks }));
                            }}
                            className="h-10 rounded-xl"
                          />
                        </div>
                      </div>

                      <Input
                        placeholder="Block Title (optional)"
                        value={block.title || ""}
                        onChange={(e) => {
                          const newBlocks = [...formData.contentBlocks];
                          newBlocks[index] = { ...newBlocks[index], title: e.target.value };
                          setFormData((prev) => ({ ...prev, contentBlocks: newBlocks }));
                        }}
                        className="h-10 text-sm rounded-xl"
                      />

                      {block.type === "image" && (
                        <div className="space-y-2">
                          <Label className="text-xs font-semibold">Image URL</Label>
                          <Input
                            placeholder="https://example.com/image.jpg"
                            value={block.content || ""}
                            onChange={(e) => {
                              const newBlocks = [...formData.contentBlocks];
                              newBlocks[index] = { ...newBlocks[index], content: e.target.value };
                              setFormData((prev) => ({ ...prev, contentBlocks: newBlocks }));
                            }}
                            className="h-10 text-sm rounded-xl font-mono"
                          />
                          {block.content && (
                            <div className="aspect-video rounded-lg overflow-hidden border border-border mt-2 relative">
                              <Image 
                                src={block.content} 
                                alt="Block preview" 
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                }}
                                onLoad={(e) => {
                                  e.currentTarget.style.display = 'block';
                                }}
                              
              fill
              sizes="100vw"
            />
                            </div>
                          )}
                        </div>
                      )}

                      {block.type !== "image" && (
                        <Textarea
                          placeholder="Block Content"
                          value={block.content || ""}
                          onChange={(e) => {
                            const newBlocks = [...formData.contentBlocks];
                            newBlocks[index] = { ...newBlocks[index], content: e.target.value };
                            setFormData((prev) => ({ ...prev, contentBlocks: newBlocks }));
                          }}
                          rows={2}
                          className="text-sm rounded-xl resize-none"
                        />
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setFormData((prev) => ({ 
                      ...prev, 
                      contentBlocks: [...prev.contentBlocks, { 
                        id: `block-${Date.now()}`, 
                        type: "text", 
                        order: prev.contentBlocks.length 
                      }] 
                    }))}
                    className="w-full rounded-xl gap-2"
                  >
                    <Plus className="w-4 h-4" /> Add Content Block
                  </Button>
                </div>
              </div>
              </div>
              </AccordionContent>
            </AccordionItem>

            {/* SECTION 6: FAQ */}
            <AccordionItem value="faq" className="border border-border/80 rounded-2xl bg-card shadow-sm overflow-hidden">
              <AccordionTrigger className="px-6 py-4 hover:no-underline data-[state=open]:bg-muted/30">
                <div className="flex items-center gap-3">
                  <span className="text-xl">❓</span>
                  <span className="text-sm font-semibold">FAQ</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6 pt-0">
                <div className="space-y-6 pt-4">
              <div className="p-4 rounded-xl border border-primary/30 bg-primary/5 text-xs text-primary flex items-center gap-2.5">
                <FileText className="w-4 h-4 shrink-0 text-primary" />
                <span>Add frequently asked questions to help users understand your item better.</span>
              </div>

              <div className="bg-card border border-border/80 rounded-2xl p-6 shadow-sm space-y-5">
                <div className="space-y-2">
                  <Label className="text-sm font-bold text-foreground flex items-center gap-2">
                    <FileText className="w-4 h-4 text-primary" /> FAQ Section
                  </Label>
                  <p className="text-xs text-muted-foreground">Add questions and answers about this item.</p>
                </div>

                <div className="space-y-4">
                  {formData.faq.map((item, index) => (
                    <div key={index} className="border border-border/80 rounded-xl p-4 space-y-3">
                      <div className="flex justify-between items-start">
                        <span className="text-xs font-medium text-muted-foreground">Q{index + 1}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            const newFaq = formData.faq.filter((_, i) => i !== index);
                            setFormData((prev) => ({ ...prev, faq: newFaq }));
                          }}
                          className="h-7 w-7 rounded-lg text-muted-foreground hover:text-destructive"
                        >
                          <X className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                      <Input
                        placeholder="Question"
                        value={item.question}
                        onChange={(e) => {
                          const newFaq = [...formData.faq];
                          newFaq[index] = { ...newFaq[index], question: e.target.value };
                          setFormData((prev) => ({ ...prev, faq: newFaq }));
                        }}
                        className="h-10 text-sm rounded-xl"
                      />
                      <Textarea
                        placeholder="Answer"
                        value={item.answer}
                        onChange={(e) => {
                          const newFaq = [...formData.faq];
                          newFaq[index] = { ...newFaq[index], answer: e.target.value };
                          setFormData((prev) => ({ ...prev, faq: newFaq }));
                        }}
                        rows={2}
                        className="text-sm rounded-xl resize-none"
                      />
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setFormData((prev) => ({ ...prev, faq: [...prev.faq, { question: "", answer: "" }] }))}
                    className="w-full rounded-xl gap-2"
                  >
                    <Plus className="w-4 h-4" /> Add FAQ
                  </Button>
                </div>
              </div>
              </div>
              </AccordionContent>
            </AccordionItem>

            {/* SECTION 7: REVIEWS */}
            <AccordionItem value="reviews" className="border border-border/80 rounded-2xl bg-card shadow-sm overflow-hidden">
              <AccordionTrigger className="px-6 py-4 hover:no-underline data-[state=open]:bg-muted/30">
                <div className="flex items-center gap-3">
                  <span className="text-xl">⭐</span>
                  <span className="text-sm font-semibold">Reviews & Testimonials</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6 pt-0">
                <div className="space-y-6 pt-4">
              <div className="p-4 rounded-xl border border-primary/30 bg-primary/5 text-xs text-primary flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 shrink-0 text-primary" />
                <span>Add customer reviews and testimonials to build trust and credibility.</span>
              </div>

              <div className="bg-card border border-border/80 rounded-2xl p-6 shadow-sm space-y-5">
                <div className="space-y-2">
                  <Label className="text-sm font-bold text-foreground flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-primary" /> Reviews & Testimonials
                  </Label>
                  <p className="text-xs text-muted-foreground">Add customer reviews with ratings and comments.</p>
                </div>

                <div className="space-y-4">
                  {formData.reviews.map((review, index) => (
                    <div key={index} className="border border-border/80 rounded-xl p-4 space-y-3">
                      <div className="flex justify-between items-start">
                        <span className="text-xs font-medium text-muted-foreground">Review {index + 1}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            const newReviews = formData.reviews.filter((_, i) => i !== index);
                            setFormData((prev) => ({ ...prev, reviews: newReviews }));
                          }}
                          className="h-7 w-7 rounded-lg text-muted-foreground hover:text-destructive"
                        >
                          <X className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <Input
                          placeholder="Author name"
                          value={review.author}
                          onChange={(e) => {
                            const newReviews = [...formData.reviews];
                            newReviews[index] = { ...newReviews[index], author: e.target.value };
                            setFormData((prev) => ({ ...prev, reviews: newReviews }));
                          }}
                          className="h-10 text-sm rounded-xl"
                        />
                        <Input
                          type="number"
                          min="1"
                          max="5"
                          placeholder="Rating (1-5)"
                          value={review.rating}
                          onChange={(e) => {
                            const newReviews = [...formData.reviews];
                            newReviews[index] = { ...newReviews[index], rating: parseInt(e.target.value) || 5 };
                            setFormData((prev) => ({ ...prev, reviews: newReviews }));
                          }}
                          className="h-10 text-sm rounded-xl"
                        />
                      </div>
                      <Input
                        placeholder="Date"
                        value={review.date}
                        onChange={(e) => {
                          const newReviews = [...formData.reviews];
                          newReviews[index] = { ...newReviews[index], date: e.target.value };
                          setFormData((prev) => ({ ...prev, reviews: newReviews }));
                        }}
                        className="h-10 text-sm rounded-xl"
                      />
                      <Textarea
                        placeholder="Review comment"
                        value={review.comment}
                        onChange={(e) => {
                          const newReviews = [...formData.reviews];
                          newReviews[index] = { ...newReviews[index], comment: e.target.value };
                          setFormData((prev) => ({ ...prev, reviews: newReviews }));
                        }}
                        rows={2}
                        className="text-sm rounded-xl resize-none"
                      />
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setFormData((prev) => ({ ...prev, reviews: [...prev.reviews, { author: "", rating: 5, comment: "", date: new Date().toISOString().split('T')[0] }] }))}
                    className="w-full rounded-xl gap-2"
                  >
                    <Plus className="w-4 h-4" /> Add Review
                  </Button>
                </div>
              </div>
              </div>
              </AccordionContent>
            </AccordionItem>

            {/* SECTION 8: SEO & ADVANCED */}
            <AccordionItem value="seo" className="border border-border/80 rounded-2xl bg-card shadow-sm overflow-hidden">
              <AccordionTrigger className="px-6 py-4 hover:no-underline data-[state=open]:bg-muted/30">
                <div className="flex items-center gap-3">
                  <span className="text-xl">🔍</span>
                  <span className="text-sm font-semibold">SEO & Advanced</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6 pt-0">
                <div className="space-y-6 pt-4">
              {/* Google Search Live Preview Card */}
              <div className="bg-card border border-border/80 rounded-2xl p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                    <Search className="w-3.5 h-3.5 text-primary" /> Google SERP Preview
                  </span>
                  <span className="text-[11px] text-muted-foreground">Live Simulation</span>
                </div>
                <div className="p-4 rounded-xl border border-border/80 bg-background/80 space-y-1.5 font-sans">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground truncate font-mono">
                    <Globe className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="truncate">{displayUrl}</span>
                  </div>
                  <h5 className="text-base font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer truncate">
                    {seoTitle}
                  </h5>
                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                    {seoDesc}
                  </p>
                </div>
              </div>

              {/* Meta Title & Ordering */}
              <div className="bg-card border border-border rounded-2xl p-5 shadow-xs space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  <div className="sm:col-span-2 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="meta-title" className="text-xs font-semibold text-foreground">
                        SEO Meta Title
                      </Label>
                      <span
                        className={`text-[11px] font-mono ${
                          formData.metaTitle.length > 60 ? "text-destructive font-bold" : "text-muted-foreground"
                        }`}
                      >
                        {formData.metaTitle.length}/60 chars
                      </span>
                    </div>
                    <Input
                      id="meta-title"
                      placeholder="Defaults to Item Title if blank..."
                      value={formData.metaTitle}
                      onChange={(e) => setFormData((prev) => ({ ...prev, metaTitle: e.target.value }))}
                      className="h-10 text-sm rounded-xl font-medium"
                    />
                    <p className="text-[11px] text-muted-foreground">Recommended: 50–60 characters</p>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="meta-order" className="text-xs font-semibold text-foreground">
                      Display Order
                    </Label>
                    <Input
                      id="meta-order"
                      type="number"
                      placeholder="0"
                      value={formData.order}
                      onChange={(e) => setFormData((prev) => ({ ...prev, order: parseInt(e.target.value) || 0 }))}
                      className="h-10 text-sm rounded-xl"
                    />
                    <p className="text-[11px] text-muted-foreground">Lower = higher in listing</p>
                  </div>
                </div>

                {/* Meta Description */}
                <div className="space-y-1.5 pt-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="meta-description" className="text-xs font-semibold text-foreground">
                      SEO Meta Description
                    </Label>
                    <span
                      className={`text-[11px] font-mono ${
                        formData.metaDescription.length > 160 ? "text-destructive font-bold" : "text-muted-foreground"
                      }`}
                    >
                      {formData.metaDescription.length}/160 chars
                    </span>
                  </div>
                  <Textarea
                    id="meta-description"
                    placeholder="High-converting search engine snippet..."
                    value={formData.metaDescription}
                    onChange={(e) => setFormData((prev) => ({ ...prev, metaDescription: e.target.value }))}
                    rows={3}
                    className="text-sm rounded-xl resize-none"
                  />
                  <p className="text-[11px] text-muted-foreground">Recommended: 120–160 characters</p>
                </div>
              </div>

              {/* Social Sharing & Open Graph */}
              <div className="bg-card border border-border rounded-2xl p-5 shadow-xs space-y-4">
                <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Share2 className="w-4 h-4 text-primary" /> Social Media Sharing
                </h4>

                <div className="space-y-1.5">
                  <ImageUpload
                    value={formData.ogImage}
                    onChange={(value) => setFormData((prev) => ({ ...prev, ogImage: value }))}
                    label="Open Graph Share Image"
                    placeholder="https://example.com/og-banner.jpg (1200x630px recommended)"
                    aspectRatio="video"
                  />
                  <p className="text-[11px] text-muted-foreground">Appears when shared on LinkedIn, Twitter, Facebook, Slack, iMessage.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <Label htmlFor="meta-twitterCard" className="text-xs font-semibold text-foreground">
                      X (Twitter) Card Type
                    </Label>
                    <Select
                      value={formData.twitterCard || "summary_large_image"}
                      onValueChange={(val) => setFormData((prev) => ({ ...prev, twitterCard: val ?? "summary_large_image" }))}
                    >
                      <SelectTrigger id="meta-twitterCard" className="h-10 rounded-xl">
                        <SelectValue placeholder="Select card format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="summary">Summary Card (Square)</SelectItem>
                        <SelectItem value="summary_large_image">Summary with Large Image (Recommended)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="meta-robots" className="text-xs font-semibold text-foreground">
                      Robots Crawler Directive
                    </Label>
                    <Input
                      id="meta-robots"
                      placeholder="index, follow"
                      value={formData.robots}
                      onChange={(e) => setFormData((prev) => ({ ...prev, robots: e.target.value }))}
                      className="h-10 text-sm rounded-xl font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-1.5 pt-2">
                  <Label htmlFor="meta-canonical" className="text-xs font-semibold text-foreground">
                    Canonical URL Override
                  </Label>
                  <Input
                    id="meta-canonical"
                    placeholder="https://domain.com/canonical-item"
                    value={formData.canonicalUrl}
                    onChange={(e) => setFormData((prev) => ({ ...prev, canonicalUrl: e.target.value }))}
                    className="h-10 text-sm rounded-xl font-mono"
                  />
                  <p className="text-[11px] text-muted-foreground">Specify only if this item content is syndicated or duplicate.</p>
                </div>
              </div>
              </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {/* Sticky Drawer Footer */}
        <SheetFooter className="px-8 py-4 border-t bg-card/95 backdrop-blur shrink-0 flex flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Switch
              id="sheet-published-switch"
              checked={formData.published}
              onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, published: checked }))}
            />
            <Label htmlFor="sheet-published-switch" className="text-xs font-semibold cursor-pointer select-none">
              {formData.published ? (
                <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Published
                </span>
              ) : (
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-muted-foreground/50" /> Draft Mode
                </span>
              )}
            </Label>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
              className="h-10 px-4 rounded-xl font-medium"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={onSubmit}
              disabled={isSubmitting || !formData.title.trim() || !formData.slug.trim()}
              className="h-10 px-6 rounded-xl font-semibold gap-2 shadow-xs"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Saving...
                </>
              ) : mode === "create" ? (
                <>
                  <Plus className="w-4 h-4" /> Create Item
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" /> Save Changes
                </>
              )}
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
