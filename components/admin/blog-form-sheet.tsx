"use client";

import React, { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  suggestBlogSeo,
  buildBlogJsonLd,
  getSiteUrl,
  stripHtml,
  serializeJsonLd,
  parseManualStructuredData,
} from "@/lib/seo";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RichTextEditor } from "@/components/rich-text-editor";
import { BlogPreview } from "@/components/blog-preview";
import { ImageUpload } from "@/components/ui/image-upload";
import {
  Plus,
  Image as ImageIcon,
  FileText,
  Video,
  Quote,
  Code,
  Sparkles,
  X,
  Monitor,
  ClipboardList,
  PenLine,
  LayoutGrid,
  Clapperboard,
  Search,
  Braces,
  Wand2,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";

export interface BlogFormData {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  category: string;
  tags: string[];
  author: {
    name: string;
    avatar: string;
    bio: string;
    email: string;
    linkedin: string;
    twitter: string;
    website: string;
    role: string;
  };
  videoUrl: string;
  videoType: "youtube" | "vimeo" | "custom";
  readTime: string;
  contentBlocks: Array<{
    id: string;
    type: "text" | "image" | "video" | "quote" | "code" | "callout" | "divider";
    content?: string;
    caption?: string;
    data?: Record<string, unknown>;
    order: number;
  }>;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  ogImage: string;
  ogTitle: string;
  ogDescription: string;
  twitterCard: string;
  twitterTitle: string;
  twitterDescription: string;
  twitterImage: string;
  canonicalUrl: string;
  robots: string;
  jsonLd: string;
  status: "draft" | "published" | "archived";
}

interface BlogFormSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: BlogFormData) => Promise<void>;
  initialData?: Partial<BlogFormData>;
  isSubmitting?: boolean;
  mode?: "create" | "edit";
}

const initialFormData: BlogFormData = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  featuredImage: "",
  category: "",
  tags: [],
  author: {
    name: "",
    avatar: "",
    bio: "",
    email: "",
    linkedin: "",
    twitter: "",
    website: "",
    role: "",
  },
  videoUrl: "",
  videoType: "youtube",
  readTime: "",
  contentBlocks: [],
  metaTitle: "",
  metaDescription: "",
  keywords: [],
  ogImage: "",
  ogTitle: "",
  ogDescription: "",
  twitterCard: "summary_large_image",
  twitterTitle: "",
  twitterDescription: "",
  twitterImage: "",
  canonicalUrl: "",
  robots: "index, follow",
  jsonLd: "",
  status: "draft",
};

export function BlogFormSheet({
  open,
  onOpenChange,
  onSubmit,
  initialData,
  isSubmitting = false,
  mode = "create",
}: BlogFormSheetProps) {
  const [formData, setFormData] = useState<BlogFormData>(initialFormData);
  const [activeTab, setActiveTab] = useState("basic");
  const [tagInput, setTagInput] = useState("");
  const [keywordsInput, setKeywordsInput] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);

  const organization = useQuery(api.organization.getOrganization);

  const [prevInit, setPrevInit] = useState<{ data?: Partial<BlogFormData>; open: boolean } | null>(null);
  if (open !== prevInit?.open || initialData !== prevInit?.data) {
    setPrevInit({ data: initialData, open });
    if (initialData) {
      setFormData({
        ...initialFormData,
        ...initialData,
        keywords: initialData.keywords || [],
        contentBlocks: initialData.contentBlocks || []
      });
      setKeywordsInput((initialData.keywords || []).join(", "));
    } else {
      setFormData(initialFormData);
      setKeywordsInput("");
    }
  }

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleTitleChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      title: value,
      slug: generateSlug(value),
    }));
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const addContentBlock = (type: BlogFormData["contentBlocks"][0]["type"]) => {
    const newBlock = {
      id: `block-${Date.now()}`,
      type,
      order: formData.contentBlocks.length,
    };
    setFormData((prev) => ({
      ...prev,
      contentBlocks: [...prev.contentBlocks, newBlock],
    }));
  };

  const removeContentBlock = (blockId: string) => {
    setFormData((prev) => ({
      ...prev,
      contentBlocks: prev.contentBlocks.filter((b) => b.id !== blockId),
    }));
  };

  const updateContentBlock = (blockId: string, updates: Partial<BlogFormData["contentBlocks"][0]>) => {
    setFormData((prev) => ({
      ...prev,
      contentBlocks: prev.contentBlocks.map((b) =>
        b.id === blockId ? { ...b, ...updates } : b
      ),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.slug.trim()) {
      toast.error("Please fill in required fields (Title & Slug)");
      return;
    }
    await onSubmit(formData);
  };

  // ── SEO helpers ──────────────────────────────────────────────
  const handleKeywordsChange = (value: string) => {
    setKeywordsInput(value);
    setFormData((prev) => ({
      ...prev,
      keywords: value.split(",").map((k) => k.trim()).filter(Boolean),
    }));
  };

  const previewTitle = formData.metaTitle || formData.title || "Post title";
  const previewDescription =
    formData.metaDescription ||
    (formData.excerpt || "").trim() ||
    stripHtml(formData.content).slice(0, 160) ||
    "Post description will appear here…";
  const siteUrl = getSiteUrl(organization ?? undefined);

  const handleAutoGenerateSeo = () => {
    const suggestion = suggestBlogSeo({
      title: formData.title,
      excerpt: formData.excerpt,
      content: formData.content,
      keywords: formData.keywords,
      tags: formData.tags,
      category: formData.category,
      orgName: organization?.name,
    });
    setFormData((prev) => ({
      ...prev,
      metaTitle: suggestion.metaTitle,
      metaDescription: suggestion.metaDescription,
      keywords: suggestion.keywords
        .split(",")
        .map((k) => k.trim())
        .filter(Boolean),
      ogTitle: suggestion.metaTitle,
      ogDescription: suggestion.metaDescription,
      twitterTitle: suggestion.metaTitle,
      twitterDescription: suggestion.metaDescription,
    }));
    setKeywordsInput(suggestion.keywords);
    toast.success("SEO fields auto-generated from basic info");
  };

  const buildPreviewJsonLd = () =>
    buildBlogJsonLd(
      {
        ...formData,
        slug: formData.slug || "post-slug",
        publishedAt: undefined,
      },
      organization ?? undefined,
      siteUrl || "https://example.com"
    );

  const jsonLdPreview = serializeJsonLd(buildPreviewJsonLd());
  const manualJsonLdValid =
    !formData.jsonLd.trim() || parseManualStructuredData(formData.jsonLd) !== null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-none lg:w-3/4 flex flex-col">
        <SheetHeader className="pb-4 border-b">
          <SheetTitle className="text-2xl font-bold">
            {mode === "create" ? "Create Blog Post" : "Edit Blog Post"}
          </SheetTitle>
          <SheetDescription>
            {mode === "create"
              ? "Create a new blog post with rich content"
              : "Edit your blog post content and settings"}
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="border-b bg-muted/30 px-6 py-2 shrink-0">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3 sm:grid-cols-6 h-10 bg-muted/80 p-1 rounded-xl border border-border/50">
                <TabsTrigger value="basic" className="text-xs sm:text-sm font-medium gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm cursor-pointer">
                  <ClipboardList className="w-4 h-4" /> Basic
                </TabsTrigger>
                <TabsTrigger value="content" className="text-xs sm:text-sm font-medium gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm cursor-pointer">
                  <PenLine className="w-4 h-4" /> Content
                </TabsTrigger>
                <TabsTrigger value="blocks" className="text-xs sm:text-sm font-medium gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm cursor-pointer">
                  <LayoutGrid className="w-4 h-4" /> Blocks
                </TabsTrigger>
                <TabsTrigger value="media" className="text-xs sm:text-sm font-medium gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm cursor-pointer">
                  <Clapperboard className="w-4 h-4" /> Media
                </TabsTrigger>
                <TabsTrigger value="seo" className="text-xs sm:text-sm font-medium gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm cursor-pointer">
                  <Search className="w-4 h-4" /> SEO
                </TabsTrigger>
                <TabsTrigger value="jsonld" className="text-xs sm:text-sm font-medium gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm cursor-pointer">
                  <Braces className="w-4 h-4" /> JSON-LD
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="px-6 py-6 space-y-6">
            {/* TAB 1: BASIC */}
            {activeTab === "basic" && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-sm font-bold text-foreground">Title *</Label>
                  <Input
                    placeholder="Enter blog post title"
                    value={formData.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    className="h-10 rounded-xl"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-bold text-foreground">Slug *</Label>
                  <Input
                    placeholder="blog-post-slug"
                    value={formData.slug}
                    onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                    className="h-10 rounded-xl font-mono"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-bold text-foreground">Excerpt / Summary</Label>
                  <Textarea
                    placeholder="Short summary used for cards and meta description"
                    value={formData.excerpt}
                    onChange={(e) => setFormData((prev) => ({ ...prev, excerpt: e.target.value }))}
                    rows={3}
                    className="rounded-xl resize-none"
                  />
                  <p className="text-xs text-muted-foreground">
                    {formData.excerpt.length}/160 recommended — used on blog cards and as the meta description fallback.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-bold text-foreground">Category</Label>
                  <Input
                    placeholder="Technology, Design, Business..."
                    value={formData.category}
                    onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
                    className="h-10 rounded-xl"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-bold text-foreground">Tags</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add tag and press Enter"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addTag();
                        }
                      }}
                      className="h-10 rounded-xl flex-1"
                    />
                    <Button type="button" onClick={addTag} variant="outline" className="rounded-xl">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  {formData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="gap-1 cursor-pointer">
                          {tag}
                          <X className="w-3 h-3" onClick={() => removeTag(tag)} />
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-bold text-foreground">Keywords</Label>
                  <Input
                    placeholder="safari, kenya, transport, 4x4..."
                    value={keywordsInput}
                    onChange={(e) => handleKeywordsChange(e.target.value)}
                    className="h-10 rounded-xl"
                  />
                  <p className="text-xs text-muted-foreground">
                    Comma-separated. The first keyword is treated as the primary keyword for SEO title generation.
                  </p>
                  {formData.keywords.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.keywords.map((kw) => (
                        <Badge key={kw} variant="outline" className="text-xs">
                          {kw}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-bold text-foreground">Read Time</Label>
                  <Input
                    placeholder="5 min read"
                    value={formData.readTime}
                    onChange={(e) => setFormData((prev) => ({ ...prev, readTime: e.target.value }))}
                    className="h-10 rounded-xl"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-bold text-foreground">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => value && setFormData((prev) => ({ ...prev, status: value as BlogFormData["status"] }))}
                  >
                    <SelectTrigger className="h-10 rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {/* TAB 2: CONTENT */}
            {activeTab === "content" && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-sm font-bold text-foreground">Main Content</Label>
                  <RichTextEditor
                    content={formData.content}
                    onChange={(value) => setFormData((prev) => ({ ...prev, content: value }))}
                    placeholder="Write your blog post content here..."
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-bold text-foreground">Author Name</Label>
                  <Input
                    placeholder="Author name"
                    value={formData.author.name}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        author: { ...prev.author, name: e.target.value },
                      }))
                    }
                    className="h-10 rounded-xl"
                  />
                </div>

                <div className="space-y-2">
                  <ImageUpload
                    value={formData.author.avatar}
                    onChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        author: { ...prev.author, avatar: value },
                      }))
                    }
                    label="Author Avatar"
                    placeholder="https://example.com/avatar.jpg"
                    aspectRatio="square"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-bold text-foreground">Author Bio</Label>
                  <RichTextEditor
                    content={formData.author.bio}
                    onChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        author: { ...prev.author, bio: value },
                      }))
                    }
                    placeholder="Short author bio"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-bold text-foreground">Author Role</Label>
                  <Input
                    placeholder="e.g., Senior Developer, Content Manager"
                    value={formData.author.role}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        author: { ...prev.author, role: e.target.value },
                      }))
                    }
                    className="h-10 rounded-xl"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-bold text-foreground">Author Email</Label>
                  <Input
                    placeholder="author@example.com"
                    value={formData.author.email}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        author: { ...prev.author, email: e.target.value },
                      }))
                    }
                    className="h-10 rounded-xl"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-bold text-foreground">LinkedIn URL</Label>
                  <Input
                    placeholder="https://linkedin.com/in/..."
                    value={formData.author.linkedin}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        author: { ...prev.author, linkedin: e.target.value },
                      }))
                    }
                    className="h-10 rounded-xl font-mono"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-bold text-foreground">Twitter URL</Label>
                  <Input
                    placeholder="https://twitter.com/..."
                    value={formData.author.twitter}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        author: { ...prev.author, twitter: e.target.value },
                      }))
                    }
                    className="h-10 rounded-xl font-mono"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-bold text-foreground">Website URL</Label>
                  <Input
                    placeholder="https://example.com"
                    value={formData.author.website}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        author: { ...prev.author, website: e.target.value },
                      }))
                    }
                    className="h-10 rounded-xl font-mono"
                  />
                </div>
              </div>
            )}

            {/* TAB 3: CONTENT BLOCKS */}
            {activeTab === "blocks" && (
              <div className="space-y-6">
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => addContentBlock("text")}
                    className="rounded-xl gap-2"
                  >
                    <FileText className="w-4 h-4" /> Text
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => addContentBlock("image")}
                    className="rounded-xl gap-2"
                  >
                    <ImageIcon className="w-4 h-4" /> Image
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => addContentBlock("video")}
                    className="rounded-xl gap-2"
                  >
                    <Video className="w-4 h-4" /> Video
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => addContentBlock("quote")}
                    className="rounded-xl gap-2"
                  >
                    <Quote className="w-4 h-4" /> Quote
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => addContentBlock("code")}
                    className="rounded-xl gap-2"
                  >
                    <Code className="w-4 h-4" /> Code
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => addContentBlock("callout")}
                    className="rounded-xl gap-2"
                  >
                    <Sparkles className="w-4 h-4" /> Callout
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => addContentBlock("divider")}
                    className="rounded-xl gap-2"
                  >
                    Divider
                  </Button>
                </div>

                <div className="space-y-4">
                  {formData.contentBlocks.length === 0 && (
                    <div className="text-center text-muted-foreground text-sm py-8">
                      No content blocks yet. Add some blocks above to get started.
                    </div>
                  )}
                  {formData.contentBlocks.map((block) => (
                    <div key={block.id} className="border border-border/80 rounded-xl p-4 space-y-3">
                      <div className="flex justify-between items-start">
                        <span className="text-xs font-medium text-muted-foreground uppercase">
                          {block.type}
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeContentBlock(block.id)}
                          className="h-7 w-7 rounded-lg text-muted-foreground hover:text-destructive"
                        >
                          <X className="w-3.5 h-3.5" />
                        </Button>
                      </div>

                      {block.type === "image" && (
                        <>
                          <div className="space-y-2">
                            <ImageUpload
                              value={block.content || ""}
                              onChange={(value) => updateContentBlock(block.id, { content: value })}
                              label="Image"
                              placeholder="https://example.com/image.jpg"
                              aspectRatio="video"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-xs font-semibold">Caption (optional)</Label>
                            <Input
                              placeholder="Image caption"
                              value={block.caption || ""}
                              onChange={(e) => updateContentBlock(block.id, { caption: e.target.value })}
                              className="h-10 rounded-xl"
                            />
                          </div>
                        </>
                      )}

                      {block.type === "video" && (
                        <>
                          <div className="space-y-2">
                            <Label className="text-xs font-semibold">Video URL</Label>
                            <Input
                              placeholder="https://youtube.com/watch?v=..."
                              value={block.content || ""}
                              onChange={(e) => updateContentBlock(block.id, { content: e.target.value })}
                              className="h-10 rounded-xl font-mono"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-xs font-semibold">Video Type</Label>
                            <Select
                              value={(block.data?.videoType as string) || "youtube"}
                              onValueChange={(value) => updateContentBlock(block.id, { 
                                data: { ...block.data, videoType: value }
                              })}
                            >
                              <SelectTrigger className="h-10 rounded-xl">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="youtube">YouTube</SelectItem>
                                <SelectItem value="vimeo">Vimeo</SelectItem>
                                <SelectItem value="custom">Custom</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <Input
                            placeholder="Caption (optional)"
                            value={block.caption || ""}
                            onChange={(e) => updateContentBlock(block.id, { caption: e.target.value })}
                            className="h-10 rounded-xl"
                          />
                        </>
                      )}

                      {block.type !== "image" && block.type !== "video" && (
                        <>
                          <Input
                            placeholder="Content"
                            value={block.content || ""}
                            onChange={(e) => updateContentBlock(block.id, { content: e.target.value })}
                            className="h-10 rounded-xl"
                          />
                          <Input
                            placeholder="Caption (optional)"
                            value={block.caption || ""}
                            onChange={(e) => updateContentBlock(block.id, { caption: e.target.value })}
                            className="h-10 rounded-xl"
                          />
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 4: MEDIA */}
            {activeTab === "media" && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <ImageUpload
                    value={formData.featuredImage}
                    onChange={(value) => setFormData((prev) => ({ ...prev, featuredImage: value }))}
                    label="Featured Image"
                    placeholder="https://example.com/featured-image.jpg"
                    aspectRatio="video"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-bold text-foreground">Video URL</Label>
                  <Input
                    placeholder="https://youtube.com/watch?v=..."
                    value={formData.videoUrl}
                    onChange={(e) => setFormData((prev) => ({ ...prev, videoUrl: e.target.value }))}
                    className="h-10 rounded-xl font-mono"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-bold text-foreground">Video Type</Label>
                  <Select
                    value={formData.videoType}
                    onValueChange={(value) => value && setFormData((prev) => ({ ...prev, videoType: value as BlogFormData["videoType"] }))}
                  >
                    <SelectTrigger className="h-10 rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="youtube">YouTube</SelectItem>
                      <SelectItem value="vimeo">Vimeo</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {/* TAB 5: SEO & SOCIAL */}
            {activeTab === "seo" && (
              <div className="space-y-6">
                {/* SERP preview */}
                <div className="border border-border/80 rounded-xl p-4 bg-muted/30 space-y-1">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Search Preview</p>
                  <p className="text-lg text-[#1a0dab] dark:text-[#8ab4f8] font-medium leading-snug line-clamp-1">
                    {previewTitle}
                  </p>
                  <p className="text-xs text-emerald-700 dark:text-emerald-500 truncate">
                    {siteUrl ? `${siteUrl}/blog/${formData.slug || "post-slug"}` : "/blog/post-slug"}
                  </p>
                  <p className="text-sm text-muted-foreground line-clamp-2">{previewDescription}</p>
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    Leave fields empty to auto-generate from basic info, or fill manually.
                  </p>
                  <Button type="button" variant="outline" size="sm" onClick={handleAutoGenerateSeo} className="rounded-xl gap-2 shrink-0">
                    <Wand2 className="w-4 h-4" /> Auto-Generate
                  </Button>
                </div>

                {/* Meta */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-bold text-foreground">Meta Title</Label>
                    <span className={`text-xs ${formData.metaTitle.length > 60 ? "text-destructive font-semibold" : "text-muted-foreground"}`}>
                      {formData.metaTitle.length}/60
                    </span>
                  </div>
                  <Input
                    placeholder={formData.title || "SEO title"}
                    value={formData.metaTitle}
                    onChange={(e) => setFormData((prev) => ({ ...prev, metaTitle: e.target.value }))}
                    className="h-10 rounded-xl"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-bold text-foreground">Meta Description</Label>
                    <span className={`text-xs ${formData.metaDescription.length > 160 ? "text-destructive font-semibold" : "text-muted-foreground"}`}>
                      {formData.metaDescription.length}/160
                    </span>
                  </div>
                  <Textarea
                    placeholder="SEO description"
                    value={formData.metaDescription}
                    onChange={(e) => setFormData((prev) => ({ ...prev, metaDescription: e.target.value }))}
                    rows={3}
                    className="rounded-xl resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-bold text-foreground">Keywords</Label>
                  <div className="flex flex-wrap gap-1.5 p-3 border border-border/80 rounded-xl bg-muted/30 min-h-[42px]">
                    {formData.keywords.length === 0 && (
                      <span className="text-xs text-muted-foreground">No keywords — add them in Basic Info or use Auto-Generate</span>
                    )}
                    {formData.keywords.map((kw) => (
                      <Badge key={kw} variant="secondary" className="text-xs">{kw}</Badge>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">Edit keywords in the Basic Info tab.</p>
                </div>

                {/* Open Graph */}
                <div className="border-t border-border/60 pt-5 space-y-4">
                  <p className="text-sm font-bold text-foreground">Open Graph</p>
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold text-muted-foreground">OG Image</Label>
                    <ImageUpload
                      value={formData.ogImage}
                      onChange={(value) => setFormData((prev) => ({ ...prev, ogImage: value }))}
                      label=""
                      placeholder="https://example.com/og-image.jpg"
                      aspectRatio="video"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold text-muted-foreground">OG Title</Label>
                    <Input
                      placeholder={previewTitle}
                      value={formData.ogTitle}
                      onChange={(e) => setFormData((prev) => ({ ...prev, ogTitle: e.target.value }))}
                      className="h-10 rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold text-muted-foreground">OG Description</Label>
                    <Textarea
                      placeholder={previewDescription}
                      value={formData.ogDescription}
                      onChange={(e) => setFormData((prev) => ({ ...prev, ogDescription: e.target.value }))}
                      rows={2}
                      className="rounded-xl resize-none"
                    />
                  </div>
                </div>

                {/* Twitter / X */}
                <div className="border-t border-border/60 pt-5 space-y-4">
                  <p className="text-sm font-bold text-foreground">Twitter / X</p>
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold text-muted-foreground">Card Type</Label>
                    <Select
                      value={formData.twitterCard}
                      onValueChange={(value) => value && setFormData((prev) => ({ ...prev, twitterCard: value }))}
                    >
                      <SelectTrigger className="h-10 rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="summary">Summary</SelectItem>
                        <SelectItem value="summary_large_image">Summary Large Image</SelectItem>
                        <SelectItem value="player">Player</SelectItem>
                        <SelectItem value="app">App</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold text-muted-foreground">Twitter Title</Label>
                    <Input
                      placeholder={previewTitle}
                      value={formData.twitterTitle}
                      onChange={(e) => setFormData((prev) => ({ ...prev, twitterTitle: e.target.value }))}
                      className="h-10 rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold text-muted-foreground">Twitter Description</Label>
                    <Textarea
                      placeholder={previewDescription}
                      value={formData.twitterDescription}
                      onChange={(e) => setFormData((prev) => ({ ...prev, twitterDescription: e.target.value }))}
                      rows={2}
                      className="rounded-xl resize-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold text-muted-foreground">Twitter Image</Label>
                    <Input
                      placeholder="Defaults to OG image / featured image"
                      value={formData.twitterImage}
                      onChange={(e) => setFormData((prev) => ({ ...prev, twitterImage: e.target.value }))}
                      className="h-10 rounded-xl font-mono"
                    />
                  </div>
                </div>

                {/* Technical */}
                <div className="border-t border-border/60 pt-5 space-y-4">
                  <p className="text-sm font-bold text-foreground">Technical</p>
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold text-muted-foreground">Canonical URL</Label>
                    <Input
                      placeholder={`${siteUrl || "https://example.com"}/blog/${formData.slug || "post-slug"}`}
                      value={formData.canonicalUrl}
                      onChange={(e) => setFormData((prev) => ({ ...prev, canonicalUrl: e.target.value }))}
                      className="h-10 rounded-xl font-mono"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold text-muted-foreground">Robots</Label>
                    <Select
                      value={formData.robots}
                      onValueChange={(value) => value && setFormData((prev) => ({ ...prev, robots: value }))}
                    >
                      <SelectTrigger className="h-10 rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="index, follow">Index, Follow</SelectItem>
                        <SelectItem value="noindex, follow">Noindex, Follow</SelectItem>
                        <SelectItem value="index, nofollow">Index, Nofollow</SelectItem>
                        <SelectItem value="noindex, nofollow">Noindex, Nofollow</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 6: JSON-LD / STRUCTURED DATA */}
            {activeTab === "jsonld" && (
              <div className="space-y-6">
                <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
                  <p className="text-sm font-semibold text-foreground mb-1">Automatic Structured Data</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Every published post automatically renders <code className="text-[11px] bg-muted px-1 rounded">Article</code>,{" "}
                    <code className="text-[11px] bg-muted px-1 rounded">WebPage</code>, and{" "}
                    <code className="text-[11px] bg-muted px-1 rounded">BreadcrumbList</code> JSON-LD — plus a{" "}
                    <code className="text-[11px] bg-muted px-1 rounded">VideoObject</code> when a video URL is set in the Media tab.
                    Keywords, author, dates, image, and category are pulled from your basic info.
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    Preview of the auto-generated schema based on current form values.
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setFormData((prev) => ({ ...prev, jsonLd: jsonLdPreview }));
                      toast.success("JSON-LD generated — review and edit below, then save");
                    }}
                    className="rounded-xl gap-2 shrink-0"
                  >
                    <Wand2 className="w-4 h-4" /> Generate from Basic Info
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-bold text-foreground">Auto-Generated JSON-LD Preview</Label>
                  <pre className="text-[11px] leading-relaxed bg-muted/60 border border-border/60 rounded-xl p-4 overflow-auto max-h-72 font-mono text-muted-foreground whitespace-pre-wrap">
                    {jsonLdPreview}
                  </pre>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-bold text-foreground">Manual JSON-LD</Label>
                    {!manualJsonLdValid && (
                      <span className="text-xs text-destructive font-semibold flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" /> Invalid JSON — will be ignored
                      </span>
                    )}
                    {manualJsonLdValid && formData.jsonLd.trim() && (
                      <span className="text-xs text-emerald-600 font-semibold">
                        Valid — {parseManualStructuredData(formData.jsonLd)?.length} block(s)
                      </span>
                    )}
                  </div>
                  <Textarea
                    placeholder='{"@context":"https://schema.org","@type":"FAQPage",...}'
                    value={formData.jsonLd}
                    onChange={(e) => setFormData((prev) => ({ ...prev, jsonLd: e.target.value }))}
                    rows={10}
                    className="rounded-xl font-mono text-xs resize-y"
                  />
                  <p className="text-xs text-muted-foreground">
                    Optional. Paste a JSON object or array of schema.org objects — rendered in addition to the automatic schema. Use &quot;Generate from Basic Info&quot; to start from the auto-generated output.
                  </p>
                </div>
              </div>
            )}
          </div>
        </form>

        <SheetFooter className="px-6 py-4 border-t bg-muted/30">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="rounded-xl">
            Cancel
          </Button>
          <Button 
            variant="outline" 
            onClick={() => setPreviewOpen(true)} 
            className="rounded-xl gap-2"
          >
            <Monitor className="w-4 h-4" /> Preview
          </Button>
          <Button type="submit" onClick={handleSubmit} disabled={isSubmitting} className="rounded-xl">
            {isSubmitting ? "Saving..." : mode === "create" ? "Create Post" : "Update Post"}
          </Button>
        </SheetFooter>
      </SheetContent>

      {/* Blog Preview Modal */}
      <BlogPreview
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        post={formData}
      />
    </Sheet>
  );
}
