import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Retrieve a page by slug path (Server-side & Live-site friendly)
export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("pages")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();
  },
});

// Retrieve a single page entity configuration for the CMS Workspace
export const getById = query({
  args: { id: v.id("pages") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// List all managed application routes
export const listAllPages = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("pages").collect();
  },
});

// Get only published pages for public site
export const getPublishedBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const page = await ctx.db
      .query("pages")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();
    
    if (!page || !page.published) {
      return null;
    }
    
    return page;
  },
});

// Get published pages for navigation
export const getPublishedPagesForNav = query({
  handler: async (ctx) => {
    const pages = await ctx.db
      .query("pages")
      .filter((q) => q.eq(q.field("published"), true))
      .collect();
    
    // Sort by title alphabetically for consistent navigation
    return pages.sort((a, b) => a.title.localeCompare(b.title));
  },
});

// Apply structural block layouts mutations (Handles drag-and-drop sort order or text changes)
export const updateBlocks = mutation({
  args: {
    id: v.id("pages"),
    blocks: v.array(
      v.object({
        id: v.string(),
        type: v.string(),
        props: v.any(),
      })
    ),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { blocks: args.blocks });
  },
});

// Create a new empty page canvas node
export const createPage = mutation({
  args: { title: v.string(), slug: v.string() },
  handler: async (ctx, args) => {
    // Prevent creating a page with empty slug (reserved for home page)
    if (args.slug === "") {
      throw new Error("Empty slug is reserved for the home page. Home page is created automatically during setup.");
    }
    
    const existing = await ctx.db
      .query("pages")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();
    if (existing) throw new Error("A page with this slug path already exists.");
    
    return await ctx.db.insert("pages", {
      title: args.title,
      slug: args.slug,
      blocks: [],
      published: false,
    });
  },
});

// Delete a page
export const deletePage = mutation({
  args: { id: v.id("pages") },
  handler: async (ctx, args) => {
    const page = await ctx.db.get(args.id);
    if (!page) throw new Error("Page not found");
    
    // Prevent deletion of home page (slug is empty string)
    if (page.slug === "") {
      throw new Error("Cannot delete the home page");
    }
    
    await ctx.db.delete(args.id);
  },
});

// Update page title and slug
export const updatePage = mutation({
  args: {
    id: v.id("pages"),
    title: v.optional(v.string()),
    slug: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, slug, title } = args;
    
    // If slug is being updated, check for conflicts
    if (slug !== undefined) {
      const existing = await ctx.db
        .query("pages")
        .withIndex("by_slug", (q) => q.eq("slug", slug))
        .unique();
      if (existing && existing._id !== id) {
        throw new Error("A page with this slug path already exists.");
      }
    }
    
    const updates: { title?: string; slug?: string } = {};
    if (title !== undefined) updates.title = title;
    if (slug !== undefined) updates.slug = slug;
    
    await ctx.db.patch(id, updates);
  },
});

// Update SEO fields
export const updateSEO = mutation({
  args: {
    id: v.id("pages"),
    metaTitle: v.optional(v.string()),
    metaDescription: v.optional(v.string()),
    ogImage: v.optional(v.string()),
    ogTitle: v.optional(v.string()),
    ogDescription: v.optional(v.string()),
    twitterCard: v.optional(v.string()),
    twitterTitle: v.optional(v.string()),
    twitterDescription: v.optional(v.string()),
    twitterImage: v.optional(v.string()),
    canonicalUrl: v.optional(v.string()),
    robots: v.optional(v.string()),
    keywords: v.optional(v.array(v.string())),
    manualStructuredData: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...seoFields } = args;
    await ctx.db.patch(id, seoFields);
  },
});

// Publish or unpublish a page
export const setPublishStatus = mutation({
  args: {
    id: v.id("pages"),
    published: v.boolean(),
  },
  handler: async (ctx, args) => {
    const updates: { published: boolean; publishedAt?: number } = {
      published: args.published,
    };
    
    if (args.published) {
      updates.publishedAt = Date.now();
    }
    
    await ctx.db.patch(args.id, updates);
  },
});

// Duplicate an existing page with fresh IDs
export const duplicatePage = mutation({
  args: { id: v.id("pages") },
  handler: async (ctx, args) => {
    const page = await ctx.db.get(args.id);
    if (!page) throw new Error("Page not found");

    const baseSlug = page.slug === "" ? "home-copy" : `${page.slug}-copy`;
    let newSlug = baseSlug;
    let counter = 1;
    while (
      await ctx.db
        .query("pages")
        .withIndex("by_slug", (q) => q.eq("slug", newSlug))
        .unique()
    ) {
      newSlug = `${baseSlug}-${counter}`;
      counter++;
    }

    const newBlocks = page.blocks.map((b) => ({
      ...b,
      id: crypto.randomUUID(),
    }));

    return await ctx.db.insert("pages", {
      title: `${page.title} (Copy)`,
      slug: newSlug,
      blocks: newBlocks,
      published: false,
      metaTitle: page.metaTitle,
      metaDescription: page.metaDescription,
      ogImage: page.ogImage,
      ogTitle: page.ogTitle,
      ogDescription: page.ogDescription,
      twitterCard: page.twitterCard,
      twitterTitle: page.twitterTitle,
      twitterDescription: page.twitterDescription,
      twitterImage: page.twitterImage,
      canonicalUrl: page.canonicalUrl,
      robots: page.robots,
      keywords: page.keywords,
      manualStructuredData: page.manualStructuredData,
    });
  },
});


// Create pre-built blog page
export const createBlogPage = mutation({
  args: {},
  handler: async (ctx) => {
    const slug = "blog";
    const existing = await ctx.db
      .query("pages")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .unique();
    if (existing) return existing._id; // Return existing ID instead of throwing error
    
    const pageId = await ctx.db.insert("pages", {
      title: "Blog",
      slug,
      blocks: [
        {
          id: crypto.randomUUID(),
          type: "HeroBlock",
          props: {
            variant: "split-content",
            title: "Our Blog",
            subtitle: "Insights, tutorials, and news from our team",
            ctaText: "Subscribe",
            ctaLink: "#subscribe",
            imageUrl: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80",
            badge: "Latest Updates",
            features: ["Weekly updates", "Expert insights", "Free resources"]
          }
        },
        {
          id: crypto.randomUUID(),
          type: "BlogBlock",
          props: {
            variant: "magazine",
            title: "Latest Articles",
            subtitle: "Stay updated with our latest insights and news"
          }
        }
      ],
      published: false,
      metaTitle: "Blog - Latest Insights and News",
      metaDescription: "Stay updated with our latest articles, tutorials, and insights from our team of experts.",
    });
    
    return pageId;
  },
});

// Get or create blog page (helper function)
export const getOrCreateBlogPage = mutation({
  args: {},
  handler: async (ctx) => {
    const slug = "blog";
    const existing = await ctx.db
      .query("pages")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .unique();
    
    if (existing) {
      return { pageId: existing._id, created: false };
    }
    
    const pageId = await ctx.db.insert("pages", {
      title: "Blog",
      slug,
      blocks: [
        {
          id: crypto.randomUUID(),
          type: "HeroBlock",
          props: {
            variant: "split-content",
            title: "Our Blog",
            subtitle: "Insights, tutorials, and news from our team",
            ctaText: "Subscribe",
            ctaLink: "#subscribe",
            imageUrl: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80",
            badge: "Latest Updates",
            features: ["Weekly updates", "Expert insights", "Free resources"]
          }
        },
        {
          id: crypto.randomUUID(),
          type: "BlogBlock",
          props: {
            variant: "magazine",
            title: "Latest Articles",
            subtitle: "Stay updated with our latest insights and news"
          }
        }
      ],
      published: false,
      metaTitle: "Blog - Latest Insights and News",
      metaDescription: "Stay updated with our latest articles, tutorials, and insights from our team of experts.",
    });
    
    return { pageId, created: true };
  },
});

// Create pre-built career page
export const createCareerPage = mutation({
  args: {},
  handler: async (ctx) => {
    const slug = "careers";
    const existing = await ctx.db
      .query("pages")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .unique();
    if (existing) throw new Error("Career page already exists.");

    const pageId = await ctx.db.insert("pages", {
      title: "Careers",
      slug,
      blocks: [
        {
          id: crypto.randomUUID(),
          type: "HeroBlock",
          props: {
            variant: "gradient-mesh",
            title: "Join Our Team",
            subtitle: "Build your career with a company that values innovation, growth, and work-life balance",
            ctaText: "View Open Positions",
            ctaLink: "#positions",
            badge: "We're Hiring",
            features: ["Remote-first culture", "Competitive benefits", "Growth opportunities"]
          }
        },
        {
          id: crypto.randomUUID(),
          type: "CareerBlock",
          props: {
            variant: "job-listings",
            title: "Open Positions",
            subtitle: "Find your perfect role and join our mission"
          }
        }
      ],
      published: false,
      metaTitle: "Careers - Join Our Team",
      metaDescription: "Explore open positions and build your career with us. We offer competitive benefits, remote work, and growth opportunities.",
    });

    return pageId;
  },
});

// Ensure home page exists (called on initialization)
export const ensureHomePageExists = mutation({
  args: {},
  handler: async (ctx) => {
    const slug = "";
    const existing = await ctx.db
      .query("pages")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .unique();
    
    if (!existing) {
      const pageId = await ctx.db.insert("pages", {
        title: "Home",
        slug,
        blocks: [
          {
            id: crypto.randomUUID(),
            type: "HeroBlock",
            props: {
              variant: "gradient-mesh",
              title: "Welcome to Our Platform",
              subtitle: "Explore our services, projects, team, and products. Everything you need in one place.",
              ctaText: "Get Started",
              ctaLink: "/collections",
              badge: "Welcome",
              features: ["Easy to use", "Fast and reliable", "Secure"]
            }
          }
        ],
        published: false,
        metaTitle: "Home - Welcome to Our Platform",
        metaDescription: "Welcome to our platform. Explore our services, projects, team, and products.",
      });
      return { created: true, pageId };
    }
    
    return { created: false, pageId: existing._id };
  },
});

// Migration: Add published field to existing pages that don't have it
export const migrateAddPublishedField = mutation({
  args: {},
  handler: async (ctx) => {
    const pages = await ctx.db.query("pages").collect();
    
    for (const page of pages) {
      if (page.published === undefined) {
        await ctx.db.patch(page._id, { published: false });
      }
    }
    
    return { migrated: pages.length };
  },
});
