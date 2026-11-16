import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Create a new collection
export const createCollection = mutation({
  args: {
    name: v.string(),
    slug: v.string(),
    description: v.optional(v.string()),
    summary: v.optional(v.string()),
    icon: v.optional(v.string()),
    cardLayout: v.optional(v.union(v.literal("grid"), v.literal("list"), v.literal("masonry"))),
    cardColumns: v.optional(v.number()),
    metaTitle: v.optional(v.string()),
    metaDescription: v.optional(v.string()),
    keywords: v.optional(v.array(v.string())),
    areasServed: v.optional(v.array(v.string())),
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
    internalLinks: v.optional(v.array(v.object({ title: v.string(), url: v.string() }))),
    externalLinks: v.optional(v.array(v.object({ title: v.string(), url: v.string() }))),
    published: v.boolean(),
  },
  handler: async (ctx, args) => {
    const collectionId = await ctx.db.insert("collections", {
      ...args,
      publishedAt: args.published ? Date.now() : undefined,
    });
    return collectionId;
  },
});

// Get all collections
export const listCollections = query({
  handler: async (ctx) => {
    const collections = await ctx.db.query("collections").collect();
    return collections;
  },
});

// Get published collections only
export const listPublishedCollections = query({
  handler: async (ctx) => {
    const collections = await ctx.db
      .query("collections")
      .filter((q) => q.eq(q.field("published"), true))
      .collect();
    return collections;
  },
});

// Get collection by slug
export const getCollectionBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const collection = await ctx.db
      .query("collections")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();
    return collection;
  },
});

// Update collection
export const updateCollection = mutation({
  args: {
    id: v.id("collections"),
    name: v.optional(v.string()),
    slug: v.optional(v.string()),
    description: v.optional(v.string()),
    summary: v.optional(v.string()),
    icon: v.optional(v.string()),
    cardLayout: v.optional(v.union(v.literal("grid"), v.literal("list"), v.literal("masonry"))),
    cardColumns: v.optional(v.number()),
    metaTitle: v.optional(v.string()),
    metaDescription: v.optional(v.string()),
    keywords: v.optional(v.array(v.string())),
    areasServed: v.optional(v.array(v.string())),
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
    internalLinks: v.optional(v.array(v.object({ title: v.string(), url: v.string() }))),
    externalLinks: v.optional(v.array(v.object({ title: v.string(), url: v.string() }))),
    published: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    const collection = await ctx.db.get(id);
    if (!collection) {
      throw new Error("Collection not found");
    }

    await ctx.db.patch(id, {
      ...updates,
      ...(updates.published !== undefined && updates.published !== collection.published
        ? { publishedAt: updates.published ? Date.now() : undefined }
        : {}),
    });
    return id;
  },
});

// Delete collection
export const deleteCollection = mutation({
  args: { id: v.id("collections") },
  handler: async (ctx, args) => {
    // First delete all items in the collection
    const items = await ctx.db
      .query("collectionItems")
      .withIndex("by_collection", (q) => q.eq("collectionId", args.id))
      .collect();
    
    for (const item of items) {
      await ctx.db.delete(item._id);
    }
    
    // Then delete the collection
    await ctx.db.delete(args.id);
  },
});

// Create a collection item
export const createCollectionItem = mutation({
  args: {
    collectionId: v.id("collections"),
    title: v.string(),
    slug: v.string(),
    description: v.optional(v.string()),
    content: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    icon: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    gallery: v.optional(v.array(v.string())),
    galleryType: v.optional(v.union(v.literal("grid"), v.literal("carousel"), v.literal("masonry"), v.literal("slider"))),
    contentBlocks: v.optional(v.array(v.object({
      id: v.string(),
      type: v.union(v.literal("hero"), v.literal("timeline"), v.literal("specifications"), v.literal("testimonials"), v.literal("cta"), v.literal("image"), v.literal("text"), v.literal("divider")),
      title: v.optional(v.string()),
      content: v.optional(v.string()),
      data: v.optional(v.any()),
      order: v.number(),
    }))),
    metadata: v.optional(
      v.object({
        price: v.optional(v.string()),
        duration: v.optional(v.string()),
        features: v.optional(v.array(v.string())),
        client: v.optional(v.string()),
        projectDate: v.optional(v.string()),
        technologies: v.optional(v.array(v.string())),
        projectUrl: v.optional(v.string()),
        role: v.optional(v.string()),
        email: v.optional(v.string()),
        linkedin: v.optional(v.string()),
        twitter: v.optional(v.string()),
        github: v.optional(v.string()),
        instagram: v.optional(v.string()),
        facebook: v.optional(v.string()),
        youtube: v.optional(v.string()),
        tiktok: v.optional(v.string()),
        dribbble: v.optional(v.string()),
        behance: v.optional(v.string()),
        website: v.optional(v.string()),
        bio: v.optional(v.string()),
        department: v.optional(v.string()),
        hireDate: v.optional(v.string()),
        location: v.optional(v.string()),
        expertise: v.optional(v.array(v.string())),
        achievements: v.optional(v.array(v.string())),
        sku: v.optional(v.string()),
        stock: v.optional(v.number()),
      })
    ),
    faq: v.optional(v.array(v.object({
      question: v.string(),
      answer: v.string(),
    }))),
    reviews: v.optional(v.array(v.object({
      author: v.string(),
      rating: v.number(),
      comment: v.string(),
      date: v.string(),
    }))),
    metaTitle: v.optional(v.string()),
    metaDescription: v.optional(v.string()),
    ogImage: v.optional(v.string()),
    twitterCard: v.optional(v.string()),
    canonicalUrl: v.optional(v.string()),
    robots: v.optional(v.string()),
    published: v.boolean(),
    order: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const itemId = await ctx.db.insert("collectionItems", {
      ...args,
      publishedAt: args.published ? Date.now() : undefined,
    });
    return itemId;
  },
});

// Get items by collection
export const getItemsByCollection = query({
  args: { collectionId: v.id("collections") },
  handler: async (ctx, args) => {
    const items = await ctx.db
      .query("collectionItems")
      .withIndex("by_collection", (q) => q.eq("collectionId", args.collectionId))
      .collect();
    
    // Sort by order if available
    return items.sort((a, b) => {
      const aOrder = a.order ?? 0;
      const bOrder = b.order ?? 0;
      return aOrder - bOrder;
    });
  },
});

// Get published items by collection
export const getPublishedItemsByCollection = query({
  args: { collectionId: v.id("collections") },
  handler: async (ctx, args) => {
    const items = await ctx.db
      .query("collectionItems")
      .withIndex("by_collection", (q) => q.eq("collectionId", args.collectionId))
      .filter((q) => q.eq(q.field("published"), true))
      .collect();
    
    // Sort by order if available
    return items.sort((a, b) => {
      const aOrder = a.order ?? 0;
      const bOrder = b.order ?? 0;
      return aOrder - bOrder;
    });
  },
});

// Get collection item by slug
export const getCollectionItemBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const item = await ctx.db
      .query("collectionItems")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();
    return item;
  },
});

// Get item by slug within a specific collection
export const getItemBySlug = query({
  args: {
    collectionId: v.id("collections"),
    slug: v.string(),
  },
  handler: async (ctx, args) => {
    const item = await ctx.db
      .query("collectionItems")
      .withIndex("by_collection", (q) => q.eq("collectionId", args.collectionId))
      .filter((q) => q.eq(q.field("slug"), args.slug))
      .first();
    return item;
  },
});

// Update collection item
export const updateCollectionItem = mutation({
  args: {
    id: v.id("collectionItems"),
    title: v.optional(v.string()),
    slug: v.optional(v.string()),
    description: v.optional(v.string()),
    content: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    icon: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    gallery: v.optional(v.array(v.string())),
    galleryType: v.optional(v.union(v.literal("grid"), v.literal("carousel"), v.literal("masonry"), v.literal("slider"))),
    contentBlocks: v.optional(v.array(v.object({
      id: v.string(),
      type: v.union(v.literal("hero"), v.literal("timeline"), v.literal("specifications"), v.literal("testimonials"), v.literal("cta"), v.literal("image"), v.literal("text"), v.literal("divider")),
      title: v.optional(v.string()),
      content: v.optional(v.string()),
      data: v.optional(v.any()),
      order: v.number(),
    }))),
    metadata: v.optional(
      v.object({
        price: v.optional(v.string()),
        duration: v.optional(v.string()),
        features: v.optional(v.array(v.string())),
        client: v.optional(v.string()),
        projectDate: v.optional(v.string()),
        technologies: v.optional(v.array(v.string())),
        projectUrl: v.optional(v.string()),
        role: v.optional(v.string()),
        email: v.optional(v.string()),
        linkedin: v.optional(v.string()),
        twitter: v.optional(v.string()),
        github: v.optional(v.string()),
        instagram: v.optional(v.string()),
        facebook: v.optional(v.string()),
        youtube: v.optional(v.string()),
        tiktok: v.optional(v.string()),
        dribbble: v.optional(v.string()),
        behance: v.optional(v.string()),
        website: v.optional(v.string()),
        bio: v.optional(v.string()),
        department: v.optional(v.string()),
        hireDate: v.optional(v.string()),
        location: v.optional(v.string()),
        expertise: v.optional(v.array(v.string())),
        achievements: v.optional(v.array(v.string())),
        sku: v.optional(v.string()),
        stock: v.optional(v.number()),
      })
    ),
    faq: v.optional(v.array(v.object({
      question: v.string(),
      answer: v.string(),
    }))),
    reviews: v.optional(v.array(v.object({
      author: v.string(),
      rating: v.number(),
      comment: v.string(),
      date: v.string(),
    }))),
    metaTitle: v.optional(v.string()),
    metaDescription: v.optional(v.string()),
    ogImage: v.optional(v.string()),
    twitterCard: v.optional(v.string()),
    canonicalUrl: v.optional(v.string()),
    robots: v.optional(v.string()),
    published: v.optional(v.boolean()),
    order: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    const item = await ctx.db.get(id);
    if (!item) {
      throw new Error("Collection item not found");
    }

    await ctx.db.patch(id, {
      ...updates,
      ...(updates.published !== undefined && updates.published !== item.published
        ? { publishedAt: updates.published ? Date.now() : undefined }
        : {}),
    });
    return id;
  },
});

// Delete collection item
export const deleteCollectionItem = mutation({
  args: { id: v.id("collectionItems") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

// Initialize default collections
export const initializeDefaultCollections = mutation({
  handler: async (ctx) => {
    // Check if collections already exist
    const existingCollections = await ctx.db.query("collections").collect();
    if (existingCollections.length > 0) {
      return;
    }

    // Create default collections
    const defaultCollections = [
      {
        name: "Services",
        slug: "services",
        description: "Our professional services",
        icon: "💼",
        cardLayout: "grid" as const,
        cardColumns: 3,
        published: true,
      },
      {
        name: "Projects",
        slug: "projects",
        description: "Our portfolio of work",
        icon: "📁",
        cardLayout: "grid" as const,
        cardColumns: 2,
        published: true,
      },
      {
        name: "Products",
        slug: "products",
        description: "Our products and offerings",
        icon: "📦",
        cardLayout: "grid" as const,
        cardColumns: 3,
        published: true,
      },
    ];

    for (const collection of defaultCollections) {
      await ctx.db.insert("collections", {
        ...collection,
        publishedAt: Date.now(),
      });
    }
  },
});
