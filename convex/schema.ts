import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

const schema = defineSchema({
    ...authTables,
    // Override the users table to add a role field
    users: defineTable({
        name: v.optional(v.string()),
        image: v.optional(v.string()),
        email: v.optional(v.string()),
        emailVerificationTime: v.optional(v.number()),
        phone: v.optional(v.string()),
        phoneVerificationTime: v.optional(v.number()),
        isAnonymous: v.optional(v.boolean()),
        // Add role field
        role: v.optional(
            v.union(
                v.literal("admin"),
                v.literal("user"),
                v.literal("staff"),
                v.literal("customer"),
                v.literal("superadmin"),
            )
        ),
    }).index("email", ["email"]),
    // Organization settings table
    organization: defineTable({
        name: v.string(),
        logo: v.optional(v.string()),
        // Main brand colors with opacity
        primaryColor: v.optional(v.string()),
        primaryOpacity: v.optional(v.number()),
        secondaryColor: v.optional(v.string()),
        secondaryOpacity: v.optional(v.number()),
        accentColor: v.optional(v.string()),
        accentOpacity: v.optional(v.number()),
        // Card colors with opacity
        cardBackground: v.optional(v.string()),
        cardBackgroundOpacity: v.optional(v.number()),
        cardForeground: v.optional(v.string()),
        cardForegroundOpacity: v.optional(v.number()),
        cardBorder: v.optional(v.string()),
        cardBorderOpacity: v.optional(v.number()),
        // Button colors with opacity
        buttonBackground: v.optional(v.string()),
        buttonBackgroundOpacity: v.optional(v.number()),
        buttonForeground: v.optional(v.string()),
        buttonForegroundOpacity: v.optional(v.number()),
        buttonHover: v.optional(v.string()),
        buttonHoverOpacity: v.optional(v.number()),
        // Badge colors with opacity
        badgeBackground: v.optional(v.string()),
        badgeBackgroundOpacity: v.optional(v.number()),
        badgeForeground: v.optional(v.string()),
        badgeForegroundOpacity: v.optional(v.number()),
        // Border colors with opacity
        borderColor: v.optional(v.string()),
        borderColorOpacity: v.optional(v.number()),
        // Background colors with opacity
        background: v.optional(v.string()),
        backgroundOpacity: v.optional(v.number()),
        foreground: v.optional(v.string()),
        foregroundOpacity: v.optional(v.number()),
        // Dark mode overrides with opacity
        darkCardBackground: v.optional(v.string()),
        darkCardBackgroundOpacity: v.optional(v.number()),
        darkCardForeground: v.optional(v.string()),
        darkCardForegroundOpacity: v.optional(v.number()),
        darkCardBorder: v.optional(v.string()),
        darkCardBorderOpacity: v.optional(v.number()),
        darkButtonBackground: v.optional(v.string()),
        darkButtonBackgroundOpacity: v.optional(v.number()),
        darkButtonForeground: v.optional(v.string()),
        darkButtonForegroundOpacity: v.optional(v.number()),
        darkButtonHover: v.optional(v.string()),
        darkButtonHoverOpacity: v.optional(v.number()),
        darkBadgeBackground: v.optional(v.string()),
        darkBadgeBackgroundOpacity: v.optional(v.number()),
        darkBadgeForeground: v.optional(v.string()),
        darkBadgeForegroundOpacity: v.optional(v.number()),
        darkBorderColor: v.optional(v.string()),
        darkBorderColorOpacity: v.optional(v.number()),
        darkBackground: v.optional(v.string()),
        darkBackgroundOpacity: v.optional(v.number()),
        darkForeground: v.optional(v.string()),
        darkForegroundOpacity: v.optional(v.number()),
        // Dark mode gradient settings
        darkCardGradientEnabled: v.optional(v.boolean()),
        darkCardGradientStart: v.optional(v.string()),
        darkCardGradientEnd: v.optional(v.string()),
        darkCardGradientDirection: v.optional(v.string()),
        darkButtonGradientEnabled: v.optional(v.boolean()),
        darkButtonGradientStart: v.optional(v.string()),
        darkButtonGradientEnd: v.optional(v.string()),
        darkButtonGradientDirection: v.optional(v.string()),
        darkBadgeGradientEnabled: v.optional(v.boolean()),
        darkBadgeGradientStart: v.optional(v.string()),
        darkBadgeGradientEnd: v.optional(v.string()),
        darkBadgeGradientDirection: v.optional(v.string()),
        // Dark mode border styles
        darkCardBorderStyle: v.optional(v.string()),
        darkCardBorderWidth: v.optional(v.string()),
        darkCardBoxShadow: v.optional(v.string()),
        darkCardPadding: v.optional(v.string()),
        darkCardMargin: v.optional(v.string()),
        darkButtonBorderStyle: v.optional(v.string()),
        darkButtonBorderWidth: v.optional(v.string()),
        darkButtonBoxShadow: v.optional(v.string()),
        darkButtonPadding: v.optional(v.string()),
        darkButtonMargin: v.optional(v.string()),
        darkBadgeBorderStyle: v.optional(v.string()),
        darkBadgeBorderWidth: v.optional(v.string()),
        darkBadgeBoxShadow: v.optional(v.string()),
        darkBadgePadding: v.optional(v.string()),
        darkBadgeMargin: v.optional(v.string()),
        // Dark mode hover effects
        darkCardHoverScale: v.optional(v.number()),
        darkCardHoverShadow: v.optional(v.string()),
        darkCardTransitionDuration: v.optional(v.string()),
        darkCardEnableHover: v.optional(v.boolean()),
        darkButtonHoverScale: v.optional(v.number()),
        darkButtonHoverShadow: v.optional(v.string()),
        darkButtonTransitionDuration: v.optional(v.string()),
        darkButtonEnableHover: v.optional(v.boolean()),
        // Gradient settings
        gradientEnabled: v.optional(v.boolean()),
        gradientType: v.optional(v.string()),
        gradientDirection: v.optional(v.string()),
        gradientStart: v.optional(v.string()),
        gradientEnd: v.optional(v.string()),
        // Border radius
        borderRadius: v.optional(v.string()),
        cardRadius: v.optional(v.string()),
        buttonRadius: v.optional(v.string()),
        // Component opacity (global)
        cardOpacity: v.optional(v.number()),
        buttonOpacity: v.optional(v.number()),
        badgeOpacity: v.optional(v.number()),
        // Interactivity settings
        cardHoverScale: v.optional(v.number()),
        cardHoverShadow: v.optional(v.string()),
        cardTransitionDuration: v.optional(v.string()),
        buttonHoverScale: v.optional(v.number()),
        buttonHoverShadow: v.optional(v.string()),
        buttonTransitionDuration: v.optional(v.string()),
        cardEnableHover: v.optional(v.boolean()),
        buttonEnableHover: v.optional(v.boolean()),
        // Card comprehensive settings
        cardBorderStyle: v.optional(v.string()),
        cardBorderWidth: v.optional(v.string()),
        cardBoxShadow: v.optional(v.string()),
        cardPadding: v.optional(v.string()),
        cardMargin: v.optional(v.string()),
        cardGradientEnabled: v.optional(v.boolean()),
        cardGradientStart: v.optional(v.string()),
        cardGradientEnd: v.optional(v.string()),
        cardGradientDirection: v.optional(v.string()),
        // Button comprehensive settings
        buttonBorderStyle: v.optional(v.string()),
        buttonBorderWidth: v.optional(v.string()),
        buttonBoxShadow: v.optional(v.string()),
        buttonPadding: v.optional(v.string()),
        buttonMargin: v.optional(v.string()),
        buttonGradientEnabled: v.optional(v.boolean()),
        buttonGradientStart: v.optional(v.string()),
        buttonGradientEnd: v.optional(v.string()),
        buttonGradientDirection: v.optional(v.string()),
        // Badge comprehensive settings
        badgeBorderStyle: v.optional(v.string()),
        badgeBorderWidth: v.optional(v.string()),
        badgeBoxShadow: v.optional(v.string()),
        badgePadding: v.optional(v.string()),
        badgeMargin: v.optional(v.string()),
        badgeGradientEnabled: v.optional(v.boolean()),
        badgeGradientStart: v.optional(v.string()),
        badgeGradientEnd: v.optional(v.string()),
        badgeGradientDirection: v.optional(v.string()),
        badgeRadius: v.optional(v.string()),
        // Focus ring shadow
        focusRingShadow: v.optional(v.string()),
        // Additional color settings
        popoverBackground: v.optional(v.string()),
        popoverForeground: v.optional(v.string()),
        destructive: v.optional(v.string()),
        ring: v.optional(v.string()),
        input: v.optional(v.string()),
        chart1: v.optional(v.string()),
        chart2: v.optional(v.string()),
        chart3: v.optional(v.string()),
        chart4: v.optional(v.string()),
        chart5: v.optional(v.string()),
        sidebarBackground: v.optional(v.string()),
        sidebarForeground: v.optional(v.string()),
        sidebarPrimary: v.optional(v.string()),
        sidebarPrimaryForeground: v.optional(v.string()),
        sidebarAccent: v.optional(v.string()),
        sidebarAccentForeground: v.optional(v.string()),
        sidebarBorder: v.optional(v.string()),
        sidebarRing: v.optional(v.string()),
        // Global collection ID that contains all content
        globalCollectionId: v.optional(v.id("collections")),
        // Social links with enable/disable toggles
        twitter: v.optional(v.string()),
        twitterEnabled: v.optional(v.boolean()),
        linkedin: v.optional(v.string()),
        linkedinEnabled: v.optional(v.boolean()),
        github: v.optional(v.string()),
        githubEnabled: v.optional(v.boolean()),
        instagram: v.optional(v.string()),
        instagramEnabled: v.optional(v.boolean()),
        facebook: v.optional(v.string()),
        facebookEnabled: v.optional(v.boolean()),
        youtube: v.optional(v.string()),
        youtubeEnabled: v.optional(v.boolean()),
        tiktok: v.optional(v.string()),
        tiktokEnabled: v.optional(v.boolean()),
        pinterest: v.optional(v.string()),
        pinterestEnabled: v.optional(v.boolean()),
        snapchat: v.optional(v.string()),
        snapchatEnabled: v.optional(v.boolean()),
        whatsapp: v.optional(v.string()),
        whatsappEnabled: v.optional(v.boolean()),
        discord: v.optional(v.string()),
        discordEnabled: v.optional(v.boolean()),
        reddit: v.optional(v.string()),
        redditEnabled: v.optional(v.boolean()),
        medium: v.optional(v.string()),
        mediumEnabled: v.optional(v.boolean()),
        dribbble: v.optional(v.string()),
        dribbbleEnabled: v.optional(v.boolean()),
        behance: v.optional(v.string()),
        behanceEnabled: v.optional(v.boolean()),
        vimeo: v.optional(v.string()),
        vimeoEnabled: v.optional(v.boolean()),
        twitch: v.optional(v.string()),
        twitchEnabled: v.optional(v.boolean()),
        telegram: v.optional(v.string()),
        telegramEnabled: v.optional(v.boolean()),
        linkedcompany: v.optional(v.string()),
        linkedcompanyEnabled: v.optional(v.boolean()),
        // Contact info
        email: v.optional(v.string()),
        emailEnabled: v.optional(v.boolean()),
        phone: v.optional(v.string()),
        phoneEnabled: v.optional(v.boolean()),
        address: v.optional(v.string()),
        addressEnabled: v.optional(v.boolean()),
        website: v.optional(v.string()),
        websiteEnabled: v.optional(v.boolean()),
        // Additional organization details
        description: v.optional(v.string()),
        industry: v.optional(v.string()),
        companySize: v.optional(v.string()),
        foundedYear: v.optional(v.string()),
        // Invoice/billing details
        taxId: v.optional(v.string()),
        bankName: v.optional(v.string()),
        accountNumber: v.optional(v.string()),
        accountName: v.optional(v.string()),
        branch: v.optional(v.string()),
        swiftCode: v.optional(v.string()),
        iban: v.optional(v.string()),
        routingNumber: v.optional(v.string()),
        bankAddress: v.optional(v.string()),
        // M-Pesa details
        mpesaPhoneNumber: v.optional(v.string()),
        mpesaBusinessNumber: v.optional(v.string()),
        mpesaAccountName: v.optional(v.string()),
        mpesaTillNumber: v.optional(v.string()),
        // Font settings for documents
        fontFamily: v.optional(v.string()),
        // Document Stamp & Signature defaults
        stampUrl: v.optional(v.string()),
        signatureUrl: v.optional(v.string()),
        signatoryName: v.optional(v.string()),
        signatoryTitle: v.optional(v.string()),
        // SEO defaults
        defaultMetaTitle: v.optional(v.string()),
        defaultMetaDescription: v.optional(v.string()),
        defaultOgImage: v.optional(v.string()),
        defaultTwitterCard: v.optional(v.string()),
        defaultCanonicalUrl: v.optional(v.string()),
        defaultRobots: v.optional(v.string()),
    }),
    // Routes table for navigation structure
    routes: defineTable({
        title: v.string(),
        url: v.string(),
        order: v.number(),
        icon: v.optional(v.string()),
        parentId: v.optional(v.id("routes")),
        isActive: v.boolean(),
        openInNewTab: v.optional(v.boolean()),
        // SEO fields for route pages
        metaTitle: v.optional(v.string()),
        metaDescription: v.optional(v.string()),
    }).index("by_parent", ["parentId"])
    .index("by_order", ["order"]),
    // CMS Pages table for the page builder
    pages: defineTable({
        title: v.string(),
        slug: v.string(),
        blocks: v.array(
            v.object({
                id: v.string(),
                type: v.string(),
                props: v.any(),
            })
        ),
        // SEO fields
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
        // Publish status
        published: v.boolean(),
        publishedAt: v.optional(v.number()),
    }).index("by_slug", ["slug"]),
    // Collections table for managing different content types
    collections: defineTable({
        name: v.string(),
        slug: v.string(),
        description: v.optional(v.string()),
        icon: v.optional(v.string()),
        // Card display settings
        cardLayout: v.optional(v.union(v.literal("grid"), v.literal("list"), v.literal("masonry"))),
        cardColumns: v.optional(v.number()),
        // SEO fields
        metaTitle: v.optional(v.string()),
        metaDescription: v.optional(v.string()),
        ogImage: v.optional(v.string()),
        twitterCard: v.optional(v.string()),
        canonicalUrl: v.optional(v.string()),
        robots: v.optional(v.string()),
        jsonLd: v.optional(v.string()),
        // Publish status
        published: v.boolean(),
        publishedAt: v.optional(v.number()),
    }).index("by_slug", ["slug"]),
    // Collection items (services, projects, team, products, etc.)
    collectionItems: defineTable({
        collectionId: v.id("collections"),
        title: v.string(),
        slug: v.string(),
        description: v.optional(v.string()),
        content: v.optional(v.string()),
        // Card preview data
        imageUrl: v.optional(v.string()),
        icon: v.optional(v.string()),
        tags: v.optional(v.array(v.string())),
        // Gallery settings
        gallery: v.optional(v.array(v.string())),
        galleryType: v.optional(v.union(v.literal("grid"), v.literal("carousel"), v.literal("masonry"), v.literal("slider"))),
        // Content blocks
        contentBlocks: v.optional(v.array(v.object({
            id: v.string(),
            type: v.union(
                v.literal("hero"),
                v.literal("timeline"),
                v.literal("specifications"),
                v.literal("testimonials"),
                v.literal("cta"),
                v.literal("image"),
                v.literal("text"),
                v.literal("divider")
            ),
            title: v.optional(v.string()),
            content: v.optional(v.string()),
            data: v.optional(v.any()),
            order: v.number(),
        }))),
        // Custom fields (flexible schema for different collection types)
        metadata: v.optional(v.object({
            // For services: duration, features
            duration: v.optional(v.string()),
            features: v.optional(v.array(v.string())),
            // For projects: client, date, technologies
            client: v.optional(v.string()),
            projectDate: v.optional(v.string()),
            technologies: v.optional(v.array(v.string())),
            projectUrl: v.optional(v.string()),
            // For team: role, email, social links, bio, department
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
            // For products: sku, stock, price
            sku: v.optional(v.string()),
            stock: v.optional(v.number()),
            price: v.optional(v.string()),
        })),
        // FAQ and Reviews
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
        // SEO fields
        metaTitle: v.optional(v.string()),
        metaDescription: v.optional(v.string()),
        ogImage: v.optional(v.string()),
        twitterCard: v.optional(v.string()),
        canonicalUrl: v.optional(v.string()),
        robots: v.optional(v.string()),
        // Publish status
        published: v.boolean(),
        publishedAt: v.optional(v.number()),
        // Order for display
        order: v.optional(v.number()),
    }).index("by_collection", ["collectionId"])
    .index("by_slug", ["slug"]),
    // Conversations table - represents a chat between two users
    conversations: defineTable({
        participant1Id: v.id("users"),
        participant2Id: v.id("users"),
        lastMessageAt: v.optional(v.number()),
        isArchived: v.optional(v.boolean()),
    }).index("by_participant1", ["participant1Id"])
    .index("by_participant2", ["participant2Id"])
    .index("by_participant1_and_participant2", ["participant1Id", "participant2Id"])
    .index("by_participant2_and_participant1", ["participant2Id", "participant1Id"])
    .index("by_last_message", ["lastMessageAt"]),
    // Messages table - messages belong to a specific conversation
    messages: defineTable({
        conversationId: v.id("conversations"),
        senderId: v.id("users"),
        content: v.string(),
        isRead: v.boolean(),
    }).index("by_conversation", ["conversationId"])
    .index("by_sender", ["senderId"]),
    // Notifications table
    notifications: defineTable({
        userId: v.id("users"),
        title: v.string(),
        message: v.string(),
        type: v.union(
            v.literal("chat"),
            v.literal("form_submission"),
            v.literal("system"),
            v.literal("alert")
        ),
        isRead: v.boolean(),
        link: v.optional(v.string()),
        timestamp: v.number(),
    }).index("by_user", ["userId"])
    .index("by_timestamp", ["timestamp"]),
    // Form submissions table
    formSubmissions: defineTable({
        formId: v.string(), // identifier for the form type
        userId: v.optional(v.id("users")), // undefined if anonymous
        formData: v.record(v.string(), v.any()), // flexible form data
        status: v.union(
            v.literal("pending"),
            v.literal("reviewed"),
            v.literal("approved"),
            v.literal("rejected")
        ),
        submittedAt: v.number(),
        reviewedAt: v.optional(v.number()),
        reviewedBy: v.optional(v.id("users")),
        notes: v.optional(v.string()),
    }).index("by_form", ["formId"])
    .index("by_status", ["status"])
    .index("by_timestamp", ["submittedAt"]),
    // Form definitions table for custom forms
    formDefinitions: defineTable({
        name: v.string(),
        slug: v.string(),
        description: v.optional(v.string()),
        // Form blocks structure
        blocks: v.array(
            v.object({
                id: v.string(),
                type: v.union(
                    v.literal("text"),
                    v.literal("email"),
                    v.literal("number"),
                    v.literal("textarea"),
                    v.literal("select"),
                    v.literal("checkbox"),
                    v.literal("radio"),
                    v.literal("date"),
                    v.literal("file"),
                    v.literal("tel"),
                    v.literal("url"),
                    v.literal("hidden"),
                    v.literal("section"),
                    v.literal("html")
                ),
                label: v.string(),
                placeholder: v.optional(v.string()),
                required: v.optional(v.boolean()),
                defaultValue: v.optional(v.any()),
                options: v.optional(v.array(v.string())), // for select, radio, checkbox
                validation: v.optional(v.object({
                    min: v.optional(v.number()),
                    max: v.optional(v.number()),
                    pattern: v.optional(v.string()),
                    custom: v.optional(v.string()),
                })),
                props: v.optional(v.any()), // additional properties
            })
        ),
        // Form settings
        settings: v.optional(v.object({
            submitButtonText: v.optional(v.string()),
            successMessage: v.optional(v.string()),
            redirectUrl: v.optional(v.string()),
            sendEmailNotification: v.optional(v.boolean()),
            emailTo: v.optional(v.string()),
            storeInDatabase: v.optional(v.boolean()),
        })),
        // Publish status
        published: v.boolean(),
        publishedAt: v.optional(v.number()),
    }).index("by_slug", ["slug"]),
    // Form templates (pre-built forms)
    formTemplates: defineTable({
        name: v.string(),
        slug: v.string(),
        category: v.union(
            v.literal("contact"),
            v.literal("booking"),
            v.literal("subscribe"),
            v.literal("feedback"),
            v.literal("survey"),
            v.literal("registration"),
            v.literal("custom")
        ),
        description: v.optional(v.string()),
        blocks: v.array(
            v.object({
                id: v.string(),
                type: v.union(
                    v.literal("text"),
                    v.literal("email"),
                    v.literal("number"),
                    v.literal("textarea"),
                    v.literal("select"),
                    v.literal("checkbox"),
                    v.literal("radio"),
                    v.literal("date"),
                    v.literal("file"),
                    v.literal("tel"),
                    v.literal("url"),
                    v.literal("hidden"),
                    v.literal("section"),
                    v.literal("html")
                ),
                label: v.string(),
                placeholder: v.optional(v.string()),
                required: v.optional(v.boolean()),
                defaultValue: v.optional(v.any()),
                options: v.optional(v.array(v.string())),
                validation: v.optional(v.object({
                    min: v.optional(v.number()),
                    max: v.optional(v.number()),
                    pattern: v.optional(v.string()),
                    custom: v.optional(v.string()),
                })),
                props: v.optional(v.any()),
            })
        ),
        settings: v.optional(v.object({
            submitButtonText: v.optional(v.string()),
            successMessage: v.optional(v.string()),
            redirectUrl: v.optional(v.string()),
            sendEmailNotification: v.optional(v.boolean()),
            emailTo: v.optional(v.string()),
            storeInDatabase: v.optional(v.boolean()),
        })),
    }).index("by_slug", ["slug"])
    .index("by_category", ["category"]),
    // Blog posts table
    blogPosts: defineTable({
        title: v.string(),
        slug: v.string(),
        excerpt: v.optional(v.string()),
        content: v.optional(v.string()),
        // Featured image
        featuredImage: v.optional(v.string()),
        // Blog-specific fields
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
        // Video support
        videoUrl: v.optional(v.string()),
        videoType: v.optional(v.union(v.literal("youtube"), v.literal("vimeo"), v.literal("custom"))),
        // Reading time
        readTime: v.optional(v.string()),
        // Published date
        publishedAt: v.optional(v.number()),
        // SEO fields
        metaTitle: v.optional(v.string()),
        metaDescription: v.optional(v.string()),
        ogImage: v.optional(v.string()),
        canonicalUrl: v.optional(v.string()),
        // Content blocks for blog
        contentBlocks: v.optional(v.array(v.object({
            id: v.string(),
            type: v.union(
                v.literal("text"),
                v.literal("image"),
                v.literal("video"),
                v.literal("quote"),
                v.literal("code"),
                v.literal("callout"),
                v.literal("divider")
            ),
            content: v.optional(v.string()),
            caption: v.optional(v.string()),
            data: v.optional(v.any()),
            order: v.number(),
        }))),
        // Status
        status: v.union(v.literal("draft"), v.literal("published"), v.literal("archived")),
    }).index("by_slug", ["slug"])
    .index("by_status", ["status"])
    .index("by_category", ["category"])
    .index("by_published_date", ["publishedAt"]),
    // Blog categories
    blogCategories: defineTable({
        name: v.string(),
        slug: v.string(),
        description: v.optional(v.string()),
        icon: v.optional(v.string()),
        color: v.optional(v.string()),
    }).index("by_slug", ["slug"]),
    // Services catalogue
    services: defineTable({
        name: v.string(),
        description: v.optional(v.string()),
        // Service category
        category: v.optional(v.string()),
        // Optional duration
        duration: v.optional(v.string()),
        // Features included
        features: v.optional(v.array(v.string())),
        // Image/icon
        imageUrl: v.optional(v.string()),
        icon: v.optional(v.string()),
        // Active status
        active: v.boolean(),
        // Order for display
        order: v.optional(v.number()),
        // Pricing
        price: v.optional(v.string()),
        pricingType: v.optional(v.union(
            v.literal("one-time"),
            v.literal("subscription"),
            v.literal("hourly"),
            v.literal("daily"),
            v.literal("monthly"),
            v.literal("yearly"),
            v.literal("project")
        )),
    }).index("by_category", ["category"])
    .index("by_active", ["active"]),
    // Clients (can be users or standalone)
    clients: defineTable({
        name: v.string(),
        // Optional link to a user
        userId: v.optional(v.id("users")),
        // Contact information
        email: v.optional(v.string()),
        phone: v.optional(v.string()),
        address: v.optional(v.string()),
        city: v.optional(v.string()),
        state: v.optional(v.string()),
        country: v.optional(v.string()),
        postalCode: v.optional(v.string()),
        // Company information
        companyName: v.optional(v.string()),
        taxId: v.optional(v.string()),
        // Notes
        notes: v.optional(v.string()),
        // Active status
        active: v.boolean(),
    }).index("by_user", ["userId"])
    .index("by_active", ["active"]),
    // Quotations (matching both new and legacy structures)
    quotations: defineTable({
        // Unique quotation number
        quotationNumber: v.string(),
        // Date
        date: v.optional(v.string()), // YYYY-MM-DD
        quotationDate: v.optional(v.number()),
        // Valid until / Due date
        dueDate: v.optional(v.union(v.string(), v.number())),
        validUntil: v.optional(v.number()),
        // From details
        fromName: v.optional(v.string()),
        fromEmail: v.optional(v.string()),
        // To details
        toName: v.optional(v.string()),
        toEmail: v.optional(v.string()),
        clientId: v.optional(v.union(v.id("clients"), v.string())),
        // Line items
        items: v.array(v.any()),
        // Total & financials
        taxRate: v.optional(v.union(v.number(), v.string())),
        taxAmount: v.optional(v.union(v.number(), v.string())),
        discountAmount: v.optional(v.string()),
        subtotal: v.optional(v.union(v.number(), v.string())),
        total: v.union(v.number(), v.string()),
        currency: v.optional(v.string()),
        // Notes
        notes: v.optional(v.string()),
        terms: v.optional(v.string()),
        convertedToInvoiceId: v.optional(v.any()),
        stampUrl: v.optional(v.string()),
        signatureUrl: v.optional(v.string()),
        signatoryName: v.optional(v.string()),
        signatoryTitle: v.optional(v.string()),
        // Status
        status: v.union(
            v.literal("draft"),
            v.literal("sent"),
            v.literal("accepted"),
            v.literal("rejected"),
            v.literal("expired")
        ),
        // Number of days (for reference)
        numberOfDays: v.optional(v.number()),
        // Created/Updated timestamps
        createdAt: v.optional(v.number()),
        updatedAt: v.optional(v.number()),
    }).index("by_number", ["quotationNumber"])
    .index("by_status", ["status"]),

    // Invoices (matching both new and legacy structures)
    invoices: defineTable({
        // Unique invoice number
        invoiceNumber: v.string(),
        // Date
        date: v.optional(v.string()), // YYYY-MM-DD
        invoiceDate: v.optional(v.number()),
        // Due date
        dueDate: v.optional(v.union(v.string(), v.number())),
        // From details
        fromName: v.optional(v.string()),
        fromEmail: v.optional(v.string()),
        // To details
        toName: v.optional(v.string()),
        toEmail: v.optional(v.string()),
        clientId: v.optional(v.union(v.id("clients"), v.string())),
        quotationId: v.optional(v.union(v.id("quotations"), v.string())),
        // Line items
        items: v.array(v.any()),
        // Tax
        taxRate: v.optional(v.union(v.number(), v.string())),
        taxAmount: v.optional(v.union(v.number(), v.string())),
        discountAmount: v.optional(v.string()),
        // Subtotal and total
        subtotal: v.optional(v.union(v.number(), v.string())),
        total: v.union(v.number(), v.string()),
        currency: v.optional(v.string()),
        // Payment tracking
        paidAmount: v.optional(v.string()),
        balanceDue: v.optional(v.string()),
        paymentType: v.optional(v.union(v.literal("MPESA"), v.literal("BANK"), v.literal("CASH"), v.literal("OTHER"))),
        paymentReference: v.optional(v.string()),
        paymentDate: v.optional(v.string()),
        // Notes
        notes: v.optional(v.string()),
        terms: v.optional(v.string()),
        templateId: v.optional(v.any()),
        stampUrl: v.optional(v.string()),
        signatureUrl: v.optional(v.string()),
        signatoryName: v.optional(v.string()),
        signatoryTitle: v.optional(v.string()),
        // Status
        status: v.union(
            v.literal("draft"),
            v.literal("sent"),
            v.literal("paid"),
            v.literal("partially_paid"),
            v.literal("overdue"),
            v.literal("cancelled")
        ),
        // Number of days (for reference)
        numberOfDays: v.optional(v.number()),
        // Created/Updated timestamps
        createdAt: v.optional(v.number()),
        updatedAt: v.optional(v.number()),
    }).index("by_number", ["invoiceNumber"])
    .index("by_status", ["status"]),
    // Receipts
    receipts: defineTable({
        // Unique receipt number
        receiptNumber: v.string(),
        // Related invoice
        invoiceId: v.id("invoices"),
        // Client reference
        clientId: v.id("clients"),
        // Date
        receiptDate: v.number(),
        // Amount received
        amount: v.string(),
        currency: v.optional(v.string()),
        // Payment method
        paymentMethod: v.union(
            v.literal("cash"),
            v.literal("bank_transfer"),
            v.literal("credit_card"),
            v.literal("debit_card"),
            v.literal("check"),
            v.literal("MPESA"),
            v.literal("other")
        ),
        // Payment reference
        paymentReference: v.optional(v.string()),
        // Notes
        notes: v.optional(v.string()),
        // Stamp & Signature
        stampUrl: v.optional(v.string()),
        signatureUrl: v.optional(v.string()),
        signatoryName: v.optional(v.string()),
        signatoryTitle: v.optional(v.string()),
    }).index("by_invoice", ["invoiceId"])
    .index("by_client", ["clientId"])
    .index("by_date", ["receiptDate"])
    .index("by_number", ["receiptNumber"]),
    // Invoice templates
    invoiceTemplates: defineTable({
        name: v.string(),
        description: v.optional(v.string()),
        // Template style
        style: v.union(
            v.literal("modern"),
            v.literal("classic"),
            v.literal("minimal")
        ),
        // Color scheme
        primaryColor: v.optional(v.string()),
        secondaryColor: v.optional(v.string()),
        // Logo position
        logoPosition: v.union(
            v.literal("left"),
            v.literal("center"),
            v.literal("right")
        ),
        // Include/exclude sections
        showLogo: v.boolean(),
        showStamps: v.boolean(),
        showSignatures: v.optional(v.boolean()),
        showCompanyDetails: v.boolean(),
        showPaymentDetails: v.boolean(),
        showTerms: v.boolean(),
        // Custom terms
        defaultTerms: v.optional(v.string()),
        // Active status
        active: v.boolean(),
    }).index("by_style", ["style"])
    .index("by_active", ["active"]),
});

export default schema;