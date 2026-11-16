"use client";

import { useState, useMemo } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id, Doc } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Trash2,
  Edit,
  Eye,
  Plus,
  Search,
  Calendar,
  Clock,
  Tag,
  FileText,
  X,
} from "lucide-react";
import { BlogFormSheet, BlogFormData } from "@/components/admin/blog-form-sheet";
import { BlogPreview } from "@/components/blog-preview";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from "next/link";

type BlogRow = {
  _id: Id<"blogPosts">;
  title: string;
  slug: string;
  excerpt?: string;
  category: string;
  status: "draft" | "published" | "archived";
  publishedAt?: number;
  author: {
    name: string;
    avatar?: string;
  };
  readTime?: string;
};

type PreviewVariant = "magazine" | "hero-focus" | "carousel" | "category-filter" | "compact-list" | "featured-sidebar" | "author-spotlight" | "podcast" | "video";

export default function AdminBlogPage() {
  const posts = useQuery(api.blog.listBlogPosts, { status: undefined });
  const categories = useQuery(api.blog.listBlogCategories);
  const createBlogPost = useMutation(api.blog.createBlogPost);
  const updateBlogPost = useMutation(api.blog.updateBlogPost);
  const deleteBlogPost = useMutation(api.blog.deleteBlogPost);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewPost, setPreviewPost] = useState<Doc<"blogPosts"> | null>(null);
  const [previewVariant, setPreviewVariant] = useState<PreviewVariant>("magazine");
  const [editingPostId, setEditingPostId] = useState<Id<"blogPosts"> | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  const categoryMap = useMemo(() => {
    const map = new Map<string, { name: string; icon?: string }>();
    categories?.forEach((c) => map.set(c.slug, { name: c.name, icon: c.icon }));
    return map;
  }, [categories]);

  const filteredPosts = useMemo(() => {
    let data = posts || [];
    const query = searchQuery.toLowerCase().trim();

    if (query) {
      data = data.filter(
        (post) =>
          post.title.toLowerCase().includes(query) ||
          post.slug.toLowerCase().includes(query) ||
          post.excerpt?.toLowerCase().includes(query) ||
          post.author?.name?.toLowerCase().includes(query) ||
          post.tags?.some((t) => t.toLowerCase().includes(query)) ||
          categoryMap.get(post.category)?.name.toLowerCase().includes(query)
      );
    }

    if (statusFilter !== "all") {
      data = data.filter((post) => post.status === statusFilter);
    }

    if (categoryFilter !== "all") {
      data = data.filter((post) => post.category === categoryFilter);
    }

    return data;
  }, [posts, searchQuery, statusFilter, categoryFilter, categoryMap]);

  const stats = useMemo(() => {
    const all = posts || [];
    return {
      total: all.length,
      published: all.filter((p) => p.status === "published").length,
      draft: all.filter((p) => p.status === "draft").length,
      archived: all.filter((p) => p.status === "archived").length,
    };
  }, [posts]);

  const handleCreatePost = async (formData: BlogFormData) => {
    try {
      setIsSubmitting(true);
      const cleanSlug = formData.slug.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
      await createBlogPost({
        title: formData.title.trim(),
        slug: cleanSlug,
        excerpt: formData.excerpt || undefined,
        content: formData.content || undefined,
        featuredImage: formData.featuredImage || undefined,
        category: formData.category,
        tags: formData.tags.length > 0 ? formData.tags : undefined,
        author: {
          name: formData.author.name,
          avatar: formData.author.avatar || undefined,
          bio: formData.author.bio || undefined,
          email: formData.author.email || undefined,
          linkedin: formData.author.linkedin || undefined,
          twitter: formData.author.twitter || undefined,
          website: formData.author.website || undefined,
          role: formData.author.role || undefined,
        },
        videoUrl: formData.videoUrl || undefined,
        videoType: formData.videoType || undefined,
        readTime: formData.readTime || undefined,
        contentBlocks: formData.contentBlocks.length > 0 ? formData.contentBlocks : undefined,
        metaTitle: formData.metaTitle || undefined,
        metaDescription: formData.metaDescription || undefined,
        keywords: formData.keywords.length > 0 ? formData.keywords : undefined,
        ogImage: formData.ogImage || undefined,
        ogTitle: formData.ogTitle || undefined,
        ogDescription: formData.ogDescription || undefined,
        twitterCard: formData.twitterCard || undefined,
        twitterTitle: formData.twitterTitle || undefined,
        twitterDescription: formData.twitterDescription || undefined,
        twitterImage: formData.twitterImage || undefined,
        canonicalUrl: formData.canonicalUrl || undefined,
        robots: formData.robots || undefined,
        jsonLd: formData.jsonLd || undefined,
        status: formData.status,
      });
      toast.success("Blog post created successfully");
      setIsCreateOpen(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to create blog post");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditPost = async (formData: BlogFormData) => {
    if (!editingPostId) return;
    try {
      setIsSubmitting(true);
      const cleanSlug = formData.slug.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
      await updateBlogPost({
        id: editingPostId,
        title: formData.title.trim(),
        slug: cleanSlug,
        excerpt: formData.excerpt || undefined,
        content: formData.content || undefined,
        featuredImage: formData.featuredImage || undefined,
        category: formData.category,
        tags: formData.tags.length > 0 ? formData.tags : undefined,
        author: {
          name: formData.author.name,
          avatar: formData.author.avatar || undefined,
          bio: formData.author.bio || undefined,
          email: formData.author.email || undefined,
          linkedin: formData.author.linkedin || undefined,
          twitter: formData.author.twitter || undefined,
          website: formData.author.website || undefined,
          role: formData.author.role || undefined,
        },
        videoUrl: formData.videoUrl || undefined,
        videoType: formData.videoType || undefined,
        readTime: formData.readTime || undefined,
        contentBlocks: formData.contentBlocks.length > 0 ? formData.contentBlocks : undefined,
        metaTitle: formData.metaTitle || undefined,
        metaDescription: formData.metaDescription || undefined,
        keywords: formData.keywords.length > 0 ? formData.keywords : undefined,
        ogImage: formData.ogImage || undefined,
        ogTitle: formData.ogTitle || undefined,
        ogDescription: formData.ogDescription || undefined,
        twitterCard: formData.twitterCard || undefined,
        twitterTitle: formData.twitterTitle || undefined,
        twitterDescription: formData.twitterDescription || undefined,
        twitterImage: formData.twitterImage || undefined,
        canonicalUrl: formData.canonicalUrl || undefined,
        robots: formData.robots || undefined,
        jsonLd: formData.jsonLd || undefined,
        status: formData.status,
      });
      toast.success("Blog post updated successfully");
      setIsEditOpen(false);
      setEditingPostId(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update blog post");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletePost = async (id: Id<"blogPosts">) => {
    if (!confirm("Are you sure you want to delete this blog post? This action cannot be undone.")) return;
    try {
      await deleteBlogPost({ id });
      toast.success("Blog post deleted successfully");
    } catch {
      toast.error("Failed to delete blog post");
    }
  };

  const openCreateSheet = () => {
    setIsCreateOpen(true);
  };

  const openEditSheet = (post: BlogRow) => {
    setEditingPostId(post._id);
    setIsEditOpen(true);
  };

  const openPreview = (post: Doc<"blogPosts">) => {
    setPreviewPost(post);
    setIsPreviewOpen(true);
  };

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Blog Posts</h1>
          <p className="text-muted-foreground">Manage your blog content</p>
        </div>
        <Button onClick={openCreateSheet} className="gap-2">
          <Plus className="w-4 h-4" /> New Post
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total Posts", value: stats.total, className: "text-foreground" },
          { label: "Published", value: stats.published, className: "text-emerald-600" },
          { label: "Drafts", value: stats.draft, className: "text-amber-600" },
          { label: "Archived", value: stats.archived, className: "text-muted-foreground" },
        ].map((stat) => (
          <div key={stat.label} className="border border-border/80 rounded-2xl bg-card p-4 shadow-sm">
            <p className="text-2xl font-bold text-foreground">{stat.value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by title, slug, excerpt, author, tag or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 rounded-xl"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <Select value={statusFilter} onValueChange={(value) => value && setStatusFilter(value)}>
          <SelectTrigger className="w-full lg:w-40 rounded-xl">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>
        <Select value={categoryFilter} onValueChange={(value) => value && setCategoryFilter(value)}>
          <SelectTrigger className="w-full lg:w-48 rounded-xl">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories?.map((cat) => (
              <SelectItem key={cat._id} value={cat.slug}>
                {cat.icon ? `${cat.icon} ` : ""}{cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={previewVariant} onValueChange={(value) => value && setPreviewVariant(value as PreviewVariant)}>
          <SelectTrigger className="w-full lg:w-48 rounded-xl">
            <SelectValue placeholder="Preview Variant" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="magazine">Magazine</SelectItem>
            <SelectItem value="hero-focus">Hero Focus</SelectItem>
            <SelectItem value="carousel">Carousel</SelectItem>
            <SelectItem value="category-filter">Category Filter</SelectItem>
            <SelectItem value="compact-list">Compact List</SelectItem>
            <SelectItem value="featured-sidebar">Featured Sidebar</SelectItem>
            <SelectItem value="author-spotlight">Author Spotlight</SelectItem>
            <SelectItem value="podcast">Podcast</SelectItem>
            <SelectItem value="video">Video</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Active filter chips */}
      {(searchQuery || statusFilter !== "all" || categoryFilter !== "all") && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-muted-foreground">Filters:</span>
          {searchQuery && (
            <Badge variant="secondary" className="gap-1 cursor-pointer" onClick={() => setSearchQuery("")}>
              &quot;{searchQuery}&quot; <X className="w-3 h-3" />
            </Badge>
          )}
          {statusFilter !== "all" && (
            <Badge variant="secondary" className="gap-1 cursor-pointer" onClick={() => setStatusFilter("all")}>
              {statusFilter} <X className="w-3 h-3" />
            </Badge>
          )}
          {categoryFilter !== "all" && (
            <Badge variant="secondary" className="gap-1 cursor-pointer" onClick={() => setCategoryFilter("all")}>
              {categoryMap.get(categoryFilter)?.name || categoryFilter} <X className="w-3 h-3" />
            </Badge>
          )}
          <span className="text-xs text-muted-foreground ml-auto">{filteredPosts.length} result{filteredPosts.length !== 1 ? "s" : ""}</span>
        </div>
      )}

      {/* Cards Grid */}
      {filteredPosts.length === 0 ? (
        <div className="border border-dashed border-border/80 rounded-2xl bg-card/50 py-20 text-center">
          <FileText className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-semibold text-foreground">No posts found</h3>
          <p className="text-sm text-muted-foreground mt-1">
            {searchQuery || statusFilter !== "all" || categoryFilter !== "all"
              ? "Try adjusting your search or filters."
              : "Create your first blog post to get started."}
          </p>
          {(searchQuery || statusFilter !== "all" || categoryFilter !== "all") && (
            <Button
              variant="outline"
              size="sm"
              className="mt-4 rounded-xl"
              onClick={() => { setSearchQuery(""); setStatusFilter("all"); setCategoryFilter("all"); }}
            >
              Clear filters
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredPosts.map((post) => {
            const category = categoryMap.get(post.category);
            return (
              <div
                key={post._id}
                className="group border border-border/80 rounded-2xl overflow-hidden bg-card shadow-sm hover:shadow-md hover:border-primary/40 transition-all flex flex-col"
              >
                {/* Image */}
                <div className="relative aspect-video bg-gradient-to-br from-primary/10 to-primary/5 overflow-hidden">
                  {post.featuredImage ? (
                    <img
                      src={post.featuredImage}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FileText className="w-10 h-10 text-muted-foreground/40" />
                    </div>
                  )}
                  {/* Status badge */}
                  <div className="absolute top-3 left-3">
                    <Badge
                      variant={post.status === "published" ? "default" : post.status === "draft" ? "secondary" : "outline"}
                      className="rounded-full text-[11px] font-semibold backdrop-blur-sm"
                    >
                      {post.status}
                    </Badge>
                  </div>
                  {/* Category badge */}
                  {category && (
                    <div className="absolute top-3 right-3">
                      <Badge variant="secondary" className="rounded-full text-[11px] font-medium bg-black/50 text-white border-0 backdrop-blur-sm">
                        {category.icon ? `${category.icon} ` : ""}{category.name}
                      </Badge>
                    </div>
                  )}
                </div>

                {/* Body */}
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="font-semibold text-foreground leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-xs text-muted-foreground font-mono mt-1">/blog/{post.slug}</p>
                  {post.excerpt && (
                    <p className="text-sm text-muted-foreground mt-2 line-clamp-2 flex-1">{post.excerpt}</p>
                  )}

                  {/* Meta */}
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground mt-3">
                    <span className="flex items-center gap-1">
                      {post.author?.avatar ? (
                        <img src={post.author.avatar} alt={post.author.name} className="w-5 h-5 rounded-full object-cover" />
                      ) : (
                        <span className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-bold">
                          {(post.author?.name || "?").charAt(0).toUpperCase()}
                        </span>
                      )}
                      {post.author?.name || "Unknown"}
                    </span>
                    {post.publishedAt && (
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(post.publishedAt).toLocaleDateString()}
                      </span>
                    )}
                    {post.readTime && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {post.readTime}
                      </span>
                    )}
                  </div>

                  {/* Tags */}
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {post.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="inline-flex items-center gap-1 text-[11px] text-muted-foreground bg-muted/60 rounded-full px-2 py-0.5">
                          <Tag className="w-2.5 h-2.5" />{tag}
                        </span>
                      ))}
                      {post.tags.length > 3 && (
                        <span className="text-[11px] text-muted-foreground">+{post.tags.length - 3}</span>
                      )}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-1 mt-4 pt-3 border-t border-border/60">
                    <Button
                      onClick={() => openPreview(post)}
                      variant="ghost"
                      size="sm"
                      className="h-8 px-3 rounded-lg text-xs font-medium gap-1.5 hover:bg-primary/10 hover:text-primary"
                    >
                      Preview
                    </Button>
                    <Button
                      onClick={() => openEditSheet(post)}
                      variant="ghost"
                      size="sm"
                      className="h-8 px-3 rounded-lg text-xs font-medium gap-1.5 hover:bg-primary/10 hover:text-primary"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      Edit
                    </Button>
                    <div className="flex-1" />
                    <Link href={`/blog/${post.slug}`} target="_blank">
                      <Button
                        variant="ghost"
                        size="icon"
                        title="View live"
                        className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </Button>
                    </Link>
                    <Button
                      onClick={() => handleDeletePost(post._id)}
                      variant="ghost"
                      size="icon"
                      title="Delete"
                      className="h-8 w-8 rounded-lg text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Sheet */}
      <BlogFormSheet
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        onSubmit={handleCreatePost}
        isSubmitting={isSubmitting}
        mode="create"
      />

      {/* Edit Sheet */}
      <BlogFormSheet
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        onSubmit={handleEditPost}
        isSubmitting={isSubmitting}
        mode="edit"
        initialData={editingPostId ? {
          ...posts?.find((p) => p._id === editingPostId),
          author: {
            name: posts?.find((p) => p._id === editingPostId)?.author.name || "",
            avatar: posts?.find((p) => p._id === editingPostId)?.author.avatar || "",
            bio: posts?.find((p) => p._id === editingPostId)?.author.bio || "",
            email: posts?.find((p) => p._id === editingPostId)?.author.email || "",
            linkedin: posts?.find((p) => p._id === editingPostId)?.author.linkedin || "",
            twitter: posts?.find((p) => p._id === editingPostId)?.author.twitter || "",
            website: posts?.find((p) => p._id === editingPostId)?.author.website || "",
            role: posts?.find((p) => p._id === editingPostId)?.author.role || "",
          }
        } : undefined}
      />

      {/* Preview Modal */}
      <BlogPreview
        open={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        post={previewPost}
        variant={previewVariant}
      />
    </div>
  );
}
