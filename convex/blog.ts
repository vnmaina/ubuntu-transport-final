import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Doc } from "./_generated/dataModel";

// Create a blog post
export const createBlogPost = mutation({
  args: {
    title: v.string(),
    slug: v.string(),
    excerpt: v.optional(v.string()),
    content: v.optional(v.string()),
    featuredImage: v.optional(v.string()),
    category: v.string(),
    tags: v.optional(v.array(v.string())),
    author: v.object({
      name: v.string(),
      avatar: v.optional(v.string()),
      bio: v.optional(v.string()),
      email: v.optional(v.string()),
      linkedin: v.optional(v.string()),
      twitter: v.optional(v.string()),
      website: v.optional(v.string()),
      role: v.optional(v.string()),
    }),
    videoUrl: v.optional(v.string()),
    videoType: v.optional(v.union(v.literal("youtube"), v.literal("vimeo"), v.literal("custom"))),
    readTime: v.optional(v.string()),
    metaTitle: v.optional(v.string()),
    metaDescription: v.optional(v.string()),
    keywords: v.optional(v.array(v.string())),
    ogImage: v.optional(v.string()),
    ogTitle: v.optional(v.string()),
    ogDescription: v.optional(v.string()),
    twitterCard: v.optional(v.string()),
    twitterTitle: v.optional(v.string()),
    twitterDescription: v.optional(v.string()),
    twitterImage: v.optional(v.string()),
    canonicalUrl: v.optional(v.string()),
    robots: v.optional(v.string()),
    jsonLd: v.optional(v.string()),
    contentBlocks: v.optional(v.array(v.object({
      id: v.string(),
      type: v.union(v.literal("text"), v.literal("image"), v.literal("video"), v.literal("quote"), v.literal("code"), v.literal("callout"), v.literal("divider")),
      content: v.optional(v.string()),
      caption: v.optional(v.string()),
      data: v.optional(v.any()),
      order: v.number(),
    }))),
    status: v.union(v.literal("draft"), v.literal("published"), v.literal("archived")),
  },
  handler: async (ctx, args) => {
    const postId = await ctx.db.insert("blogPosts", {
      ...args,
      publishedAt: args.status === "published" ? Date.now() : undefined,
    });
    return postId;
  },
});

// Get all blog posts
export const listBlogPosts = query({
  args: { status: v.optional(v.union(v.literal("draft"), v.literal("published"), v.literal("archived"))) },
  handler: async (ctx, args) => {
    let query = ctx.db.query("blogPosts");
    
    if (args.status) {
      query = query.filter((q) => q.eq(q.field("status"), args.status));
    }
    
    const posts = await query.collect();
    
    // Sort by published date descending
    return posts.sort((a, b) => {
      const aDate = a.publishedAt ?? 0;
      const bDate = b.publishedAt ?? 0;
      return bDate - aDate;
    });
  },
});

// Get published blog posts only
export const listPublishedBlogPosts = query({
  handler: async (ctx) => {
    const posts = await ctx.db
      .query("blogPosts")
      .filter((q) => q.eq(q.field("status"), "published"))
      .collect();
    
    return posts.sort((a, b) => {
      const aDate = a.publishedAt ?? 0;
      const bDate = b.publishedAt ?? 0;
      return bDate - aDate;
    });
  },
});

// Get blog post by slug
export const getBlogPostBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const post = await ctx.db
      .query("blogPosts")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();
    return post;
  },
});

// Get blog posts by category
export const getBlogPostsByCategory = query({
  args: { category: v.string() },
  handler: async (ctx, args) => {
    const posts = await ctx.db
      .query("blogPosts")
      .withIndex("by_category", (q) => q.eq("category", args.category))
      .filter((q) => q.eq(q.field("status"), "published"))
      .collect();
    
    return posts.sort((a, b) => {
      const aDate = a.publishedAt ?? 0;
      const bDate = b.publishedAt ?? 0;
      return bDate - aDate;
    });
  },
});

// Update blog post
export const updateBlogPost = mutation({
  args: {
    id: v.id("blogPosts"),
    title: v.optional(v.string()),
    slug: v.optional(v.string()),
    excerpt: v.optional(v.string()),
    content: v.optional(v.string()),
    featuredImage: v.optional(v.string()),
    category: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    author: v.optional(v.object({
      name: v.string(),
      avatar: v.optional(v.string()),
      bio: v.optional(v.string()),
      email: v.optional(v.string()),
      linkedin: v.optional(v.string()),
      twitter: v.optional(v.string()),
      website: v.optional(v.string()),
      role: v.optional(v.string()),
    })),
    videoUrl: v.optional(v.string()),
    videoType: v.optional(v.union(v.literal("youtube"), v.literal("vimeo"), v.literal("custom"))),
    readTime: v.optional(v.string()),
    metaTitle: v.optional(v.string()),
    metaDescription: v.optional(v.string()),
    keywords: v.optional(v.array(v.string())),
    ogImage: v.optional(v.string()),
    ogTitle: v.optional(v.string()),
    ogDescription: v.optional(v.string()),
    twitterCard: v.optional(v.string()),
    twitterTitle: v.optional(v.string()),
    twitterDescription: v.optional(v.string()),
    twitterImage: v.optional(v.string()),
    canonicalUrl: v.optional(v.string()),
    robots: v.optional(v.string()),
    jsonLd: v.optional(v.string()),
    contentBlocks: v.optional(v.array(v.object({
      id: v.string(),
      type: v.union(v.literal("text"), v.literal("image"), v.literal("video"), v.literal("quote"), v.literal("code"), v.literal("callout"), v.literal("divider")),
      content: v.optional(v.string()),
      caption: v.optional(v.string()),
      data: v.optional(v.any()),
      order: v.number(),
    }))),
    status: v.optional(v.union(v.literal("draft"), v.literal("published"), v.literal("archived"))),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    const post = await ctx.db.get(id);
    if (!post) {
      throw new Error("Blog post not found");
    }

    const updatedData: Partial<Doc<"blogPosts">> = { ...updates };
    if (updates.status !== undefined && updates.status !== post.status) {
      updatedData.publishedAt = updates.status === "published" ? Date.now() : undefined;
    }

    await ctx.db.patch(id, updatedData);
    return id;
  },
});

// Delete blog post
export const deleteBlogPost = mutation({
  args: { id: v.id("blogPosts") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

// Blog categories
export const createBlogCategory = mutation({
  args: {
    name: v.string(),
    slug: v.string(),
    description: v.optional(v.string()),
    icon: v.optional(v.string()),
    color: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const categoryId = await ctx.db.insert("blogCategories", args);
    return categoryId;
  },
});

export const listBlogCategories = query({
  handler: async (ctx) => {
    const categories = await ctx.db.query("blogCategories").collect();
    return categories;
  },
});

export const getBlogCategoryBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const category = await ctx.db
      .query("blogCategories")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();
    return category;
  },
});

// Initialize default blog categories
export const initializeDefaultBlogCategories = mutation({
  handler: async (ctx) => {
    const existingCategories = await ctx.db.query("blogCategories").collect();
    if (existingCategories.length > 0) {
      return;
    }

    const defaultCategories = [
      { name: "Technology", slug: "technology", icon: "💻", color: "#3b82f6" },
      { name: "Design", slug: "design", icon: "🎨", color: "#ec4899" },
      { name: "Business", slug: "business", icon: "💼", color: "#10b981" },
      { name: "Marketing", slug: "marketing", icon: "📈", color: "#f59e0b" },
      { name: "Tutorial", slug: "tutorial", icon: "📚", color: "#8b5cf6" },
    ];

    for (const category of defaultCategories) {
      await ctx.db.insert("blogCategories", category);
    }
  },
});
