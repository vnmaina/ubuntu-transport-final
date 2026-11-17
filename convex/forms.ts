import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { auth } from "./auth";

// Submit a form (can be anonymous or authenticated)
export const submitForm = mutation({
    args: {
        formId: v.string(),
        formData: v.record(v.string(), v.any()),
    },
    handler: async (ctx, args) => {
        const userId = await auth.getUserId(ctx);
        
        const submissionId = await ctx.db.insert("formSubmissions", {
            formId: args.formId,
            userId: userId || undefined,
            formData: args.formData,
            status: "pending",
            submittedAt: Date.now(),
        });

        // Notify admins about new form submission
        const admins = await ctx.db
            .query("users")
            .filter((q) => 
                q.or(
                    q.eq(q.field("role"), "admin"),
                    q.eq(q.field("role"), "superadmin"),
                    q.eq(q.field("role"), "staff")
                )
            )
            .collect();

        for (const admin of admins) {
            await ctx.db.insert("notifications", {
                userId: admin._id,
                title: "New Form Submission",
                message: `New submission received for ${args.formId}`,
                type: "form_submission",
                isRead: false,
                link: "/admin/forms",
                timestamp: Date.now(),
            });
        }

        return submissionId;
    },
});

// Create a custom form definition (admin only)
export const createFormDefinition = mutation({
    args: {
        name: v.string(),
        slug: v.string(),
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
    },
    handler: async (ctx, args) => {
        const userId = await auth.getUserId(ctx);
        if (!userId) throw new Error("Not authenticated");

        const currentUser = await ctx.db.get(userId);
        if (!currentUser) throw new Error("User not found");

        const isAdmin = currentUser.role === "admin" || currentUser.role === "superadmin";
        if (!isAdmin) throw new Error("Not authorized");

        // Check if slug already exists
        const existingForm = await ctx.db
            .query("formDefinitions")
            .withIndex("by_slug", (q) => q.eq("slug", args.slug))
            .first();
        
        if (existingForm) {
            throw new Error("Form with this slug already exists");
        }

        const formId = await ctx.db.insert("formDefinitions", {
            name: args.name,
            slug: args.slug,
            description: args.description,
            blocks: args.blocks,
            settings: args.settings,
            published: false,
        });

        return formId;
    },
});

// Update a form definition (admin only)
export const updateFormDefinition = mutation({
    args: {
        id: v.id("formDefinitions"),
        name: v.optional(v.string()),
        slug: v.optional(v.string()),
        description: v.optional(v.string()),
        blocks: v.optional(v.array(
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
        )),
        settings: v.optional(v.object({
            submitButtonText: v.optional(v.string()),
            successMessage: v.optional(v.string()),
            redirectUrl: v.optional(v.string()),
            sendEmailNotification: v.optional(v.boolean()),
            emailTo: v.optional(v.string()),
            storeInDatabase: v.optional(v.boolean()),
        })),
        published: v.optional(v.boolean()),
    },
    handler: async (ctx, args) => {
        const userId = await auth.getUserId(ctx);
        if (!userId) throw new Error("Not authenticated");

        const currentUser = await ctx.db.get(userId);
        if (!currentUser) throw new Error("User not found");

        const isAdmin = currentUser.role === "admin" || currentUser.role === "superadmin";
        if (!isAdmin) throw new Error("Not authorized");

        // eslint-disable-next-line @typescript-eslint/no-explicit-any -- dynamic partial update payload
        const updateData: any = {};
        if (args.name !== undefined) updateData.name = args.name;
        if (args.slug !== undefined) updateData.slug = args.slug;
        if (args.description !== undefined) updateData.description = args.description;
        if (args.blocks !== undefined) updateData.blocks = args.blocks;
        if (args.settings !== undefined) updateData.settings = args.settings;
        if (args.published !== undefined) {
            updateData.published = args.published;
            if (args.published && !updateData.publishedAt) {
                updateData.publishedAt = Date.now();
            }
        }

        await ctx.db.patch(args.id, updateData);
        return args.id;
    },
});

// Delete a form definition (admin only)
export const deleteFormDefinition = mutation({
    args: {
        id: v.id("formDefinitions"),
    },
    handler: async (ctx, args) => {
        const userId = await auth.getUserId(ctx);
        if (!userId) throw new Error("Not authenticated");

        const currentUser = await ctx.db.get(userId);
        if (!currentUser) throw new Error("User not found");

        const isAdmin = currentUser.role === "admin" || currentUser.role === "superadmin";
        if (!isAdmin) throw new Error("Not authorized");

        await ctx.db.delete(args.id);
        return args.id;
    },
});

// Get all form definitions (admin only)
export const getAllFormDefinitions = query({
    args: {},
    handler: async (ctx) => {
        const userId = await auth.getUserId(ctx);
        if (!userId) return [];

        const currentUser = await ctx.db.get(userId);
        if (!currentUser) return [];

        const isAdmin = currentUser.role === "admin" || currentUser.role === "superadmin";
        if (!isAdmin) return [];

        const forms = await ctx.db
            .query("formDefinitions")
            .order("desc")
            .collect();

        return forms;
    },
});

// List published form slugs (public — for sitemap/search indexing)
export const listPublishedFormDefinitions = query({
    args: {},
    handler: async (ctx) => {
        const forms = await ctx.db.query("formDefinitions").collect();
        return forms
            .filter((f) => f.published)
            .map((f) => ({ slug: f.slug, name: f.name, publishedAt: f.publishedAt }));
    },
});

// Get form definition by slug (public)
export const getFormBySlug = query({
    args: {
        slug: v.string(),
    },
    handler: async (ctx, args) => {
        const form = await ctx.db
            .query("formDefinitions")
            .withIndex("by_slug", (q) => q.eq("slug", args.slug))
            .first();

        if (!form) return null;

        // Only return published forms
        if (!form.published) return null;

        return form;
    },
});

// Get form definition by ID (admin only)
export const getFormById = query({
    args: {
        id: v.id("formDefinitions"),
    },
    handler: async (ctx, args) => {
        const userId = await auth.getUserId(ctx);
        if (!userId) return null;

        const currentUser = await ctx.db.get(userId);
        if (!currentUser) return null;

        const isAdmin = currentUser.role === "admin" || currentUser.role === "superadmin";
        if (!isAdmin) return null;

        return await ctx.db.get(args.id);
    },
});

// Get all form templates (public)
export const getAllFormTemplates = query({
    args: {},
    handler: async (ctx) => {
        const templates = await ctx.db
            .query("formTemplates")
            .collect();

        return templates;
    },
});

// Get form template by slug (public)
export const getFormTemplateBySlug = query({
    args: {
        slug: v.string(),
    },
    handler: async (ctx, args) => {
        const template = await ctx.db
            .query("formTemplates")
            .withIndex("by_slug", (q) => q.eq("slug", args.slug))
            .first();

        return template;
    },
});

// Get form templates by category (public)
export const getFormTemplatesByCategory = query({
    args: {
        category: v.union(
            v.literal("contact"),
            v.literal("booking"),
            v.literal("subscribe"),
            v.literal("feedback"),
            v.literal("survey"),
            v.literal("registration"),
            v.literal("custom")
        ),
    },
    handler: async (ctx, args) => {
        const templates = await ctx.db
            .query("formTemplates")
            .withIndex("by_category", (q) => q.eq("category", args.category))
            .collect();

        return templates;
    },
});

// Initialize default form templates (admin only)
export const initializeDefaultFormTemplates = mutation({
    args: {},
    handler: async (ctx) => {
        const userId = await auth.getUserId(ctx);
        if (!userId) throw new Error("Not authenticated");

        const currentUser = await ctx.db.get(userId);
        if (!currentUser) throw new Error("User not found");

        const isAdmin = currentUser.role === "admin" || currentUser.role === "superadmin";
        if (!isAdmin) throw new Error("Not authorized");

        const templates = [
            {
                name: "Contact Form",
                slug: "contact",
                category: "contact" as const,
                description: "Standard contact form with name, email, and message",
                blocks: [
                    {
                        id: "name",
                        type: "text" as const,
                        label: "Name",
                        placeholder: "Your name",
                        required: true,
                    },
                    {
                        id: "email",
                        type: "email" as const,
                        label: "Email",
                        placeholder: "your@email.com",
                        required: true,
                    },
                    {
                        id: "subject",
                        type: "text" as const,
                        label: "Subject",
                        placeholder: "What is this about?",
                        required: true,
                    },
                    {
                        id: "message",
                        type: "textarea" as const,
                        label: "Message",
                        placeholder: "Your message...",
                        required: true,
                    },
                ],
                settings: {
                    submitButtonText: "Send Message",
                    successMessage: "Thank you for your message! We'll get back to you soon.",
                    sendEmailNotification: true,
                    storeInDatabase: true,
                },
            },
            {
                name: "Newsletter Subscription",
                slug: "subscribe",
                category: "subscribe" as const,
                description: "Simple email subscription form",
                blocks: [
                    {
                        id: "email",
                        type: "email" as const,
                        label: "Email Address",
                        placeholder: "your@email.com",
                        required: true,
                    },
                    {
                        id: "name",
                        type: "text" as const,
                        label: "Name (optional)",
                        placeholder: "Your name",
                        required: false,
                    },
                ],
                settings: {
                    submitButtonText: "Subscribe",
                    successMessage: "Thanks for subscribing! Check your email to confirm.",
                    sendEmailNotification: true,
                    storeInDatabase: true,
                },
            },
            {
                name: "Booking Form",
                slug: "booking",
                category: "booking" as const,
                description: "Service booking form with date and time selection",
                blocks: [
                    {
                        id: "name",
                        type: "text" as const,
                        label: "Full Name",
                        placeholder: "Your full name",
                        required: true,
                    },
                    {
                        id: "email",
                        type: "email" as const,
                        label: "Email",
                        placeholder: "your@email.com",
                        required: true,
                    },
                    {
                        id: "phone",
                        type: "tel" as const,
                        label: "Phone Number",
                        placeholder: "+1 (555) 123-4567",
                        required: true,
                    },
                    {
                        id: "date",
                        type: "date" as const,
                        label: "Preferred Date",
                        required: true,
                    },
                    {
                        id: "time",
                        type: "text" as const,
                        label: "Preferred Time",
                        placeholder: "e.g., 2:00 PM",
                        required: true,
                    },
                    {
                        id: "service",
                        type: "select" as const,
                        label: "Service Type",
                        required: true,
                        options: ["Consultation", "Service", "Support", "Other"],
                    },
                    {
                        id: "notes",
                        type: "textarea" as const,
                        label: "Additional Notes",
                        placeholder: "Any specific requirements...",
                        required: false,
                    },
                ],
                settings: {
                    submitButtonText: "Request Booking",
                    successMessage: "Your booking request has been received. We'll confirm shortly.",
                    sendEmailNotification: true,
                    storeInDatabase: true,
                },
            },
            {
                name: "Feedback Form",
                slug: "feedback",
                category: "feedback" as const,
                description: "Customer feedback form with rating and comments",
                blocks: [
                    {
                        id: "name",
                        type: "text" as const,
                        label: "Your Name",
                        placeholder: "Your name",
                        required: true,
                    },
                    {
                        id: "email",
                        type: "email" as const,
                        label: "Email",
                        placeholder: "your@email.com",
                        required: true,
                    },
                    {
                        id: "rating",
                        type: "select" as const,
                        label: "Rating",
                        required: true,
                        options: ["5 - Excellent", "4 - Good", "3 - Average", "2 - Poor", "1 - Terrible"],
                    },
                    {
                        id: "feedback",
                        type: "textarea" as const,
                        label: "Your Feedback",
                        placeholder: "Please share your experience...",
                        required: true,
                    },
                ],
                settings: {
                    submitButtonText: "Submit Feedback",
                    successMessage: "Thank you for your feedback! We appreciate it.",
                    sendEmailNotification: true,
                    storeInDatabase: true,
                },
            },
        ];

        for (const template of templates) {
            const existing = await ctx.db
                .query("formTemplates")
                .withIndex("by_slug", (q) => q.eq("slug", template.slug))
                .first();

            if (!existing) {
                await ctx.db.insert("formTemplates", template);
            }
        }

        return { success: true, count: templates.length };
    },
});

// Get all form submissions (admin only)
export const getAllSubmissions = query({
    args: {},
    handler: async (ctx) => {
        const userId = await auth.getUserId(ctx);
        if (!userId) return [];

        const currentUser = await ctx.db.get(userId);
        if (!currentUser) return [];

        const isAdmin = currentUser.role === "admin" || currentUser.role === "superadmin" || currentUser.role === "staff";
        if (!isAdmin) throw new Error("Not authorized");

        const submissions = await ctx.db
            .query("formSubmissions")
            .withIndex("by_timestamp")
            .order("desc")
            .collect();

        // Enrich with user information
        const enrichedSubmissions = await Promise.all(
            submissions.map(async (submission) => {
                let userInfo = null;
                if (submission.userId) {
                    const user = await ctx.db.get(submission.userId);
                    userInfo = user ? {
                        name: user.name,
                        email: user.email,
                    } : null;
                }
                return {
                    ...submission,
                    userInfo,
                };
            })
        );

        return enrichedSubmissions;
    },
});

// Get submissions by form ID (admin only)
export const getSubmissionsByForm = query({
    args: {
        formId: v.string(),
    },
    handler: async (ctx, args) => {
        const userId = await auth.getUserId(ctx);
        if (!userId) return [];

        const currentUser = await ctx.db.get(userId);
        if (!currentUser) return [];

        const isAdmin = currentUser.role === "admin" || currentUser.role === "superadmin" || currentUser.role === "staff";
        if (!isAdmin) throw new Error("Not authorized");

        const submissions = await ctx.db
            .query("formSubmissions")
            .withIndex("by_form", (q) => q.eq("formId", args.formId))
            .order("desc")
            .collect();

        // Enrich with user information
        const enrichedSubmissions = await Promise.all(
            submissions.map(async (submission) => {
                let userInfo = null;
                if (submission.userId) {
                    const user = await ctx.db.get(submission.userId);
                    userInfo = user ? {
                        name: user.name,
                        email: user.email,
                    } : null;
                }
                return {
                    ...submission,
                    userInfo,
                };
            })
        );

        return enrichedSubmissions;
    },
});

// Get submissions by status (admin only)
export const getSubmissionsByStatus = query({
    args: {
        status: v.union(
            v.literal("pending"),
            v.literal("reviewed"),
            v.literal("approved"),
            v.literal("rejected")
        ),
    },
    handler: async (ctx, args) => {
        const userId = await auth.getUserId(ctx);
        if (!userId) return [];

        const currentUser = await ctx.db.get(userId);
        if (!currentUser) return [];

        const isAdmin = currentUser.role === "admin" || currentUser.role === "superadmin" || currentUser.role === "staff";
        if (!isAdmin) throw new Error("Not authorized");

        const submissions = await ctx.db
            .query("formSubmissions")
            .withIndex("by_status", (q) => q.eq("status", args.status))
            .order("desc")
            .collect();

        // Enrich with user information
        const enrichedSubmissions = await Promise.all(
            submissions.map(async (submission) => {
                let userInfo = null;
                if (submission.userId) {
                    const user = await ctx.db.get(submission.userId);
                    userInfo = user ? {
                        name: user.name,
                        email: user.email,
                    } : null;
                }
                return {
                    ...submission,
                    userInfo,
                };
            })
        );

        return enrichedSubmissions;
    },
});

// Update submission status (admin only)
export const updateSubmissionStatus = mutation({
    args: {
        submissionId: v.id("formSubmissions"),
        status: v.union(
            v.literal("pending"),
            v.literal("reviewed"),
            v.literal("approved"),
            v.literal("rejected")
        ),
        notes: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const userId = await auth.getUserId(ctx);
        if (!userId) throw new Error("Not authenticated");

        const currentUser = await ctx.db.get(userId);
        if (!currentUser) throw new Error("User not found");

        const isAdmin = currentUser.role === "admin" || currentUser.role === "superadmin" || currentUser.role === "staff";
        if (!isAdmin) throw new Error("Not authorized");

        const submission = await ctx.db.get(args.submissionId);
        if (!submission) throw new Error("Submission not found");

        await ctx.db.patch(args.submissionId, {
            status: args.status,
            reviewedAt: Date.now(),
            reviewedBy: userId,
            notes: args.notes,
        });

        // Notify the user who submitted the form
        if (submission.userId) {
            await ctx.db.insert("notifications", {
                userId: submission.userId,
                title: "Form Submission Updated",
                message: `Your form submission has been ${args.status}`,
                type: "form_submission",
                isRead: false,
                link: "/forms",
                timestamp: Date.now(),
            });
        }
    },
});

// Get user's own form submissions
export const getMySubmissions = query({
    args: {},
    handler: async (ctx) => {
        const userId = await auth.getUserId(ctx);
        if (!userId) return [];

        const submissions = await ctx.db
            .query("formSubmissions")
            .filter((q) => q.eq(q.field("userId"), userId))
            .order("desc")
            .collect();

        return submissions;
    },
});

// Delete a submission (admin only)
export const deleteSubmission = mutation({
    args: {
        submissionId: v.id("formSubmissions"),
    },
    handler: async (ctx, args) => {
        const userId = await auth.getUserId(ctx);
        if (!userId) throw new Error("Not authenticated");

        const currentUser = await ctx.db.get(userId);
        if (!currentUser) throw new Error("User not found");

        const isAdmin = currentUser.role === "admin" || currentUser.role === "superadmin" || currentUser.role === "staff";
        if (!isAdmin) throw new Error("Not authorized");

        await ctx.db.delete(args.submissionId);
        return { success: true };
    },
});

// Get submission statistics for admin dashboard
export const getSubmissionStats = query({
    args: {},
    handler: async (ctx) => {
        const userId = await auth.getUserId(ctx);
        if (!userId) return null;

        const currentUser = await ctx.db.get(userId);
        if (!currentUser) return null;

        const isAdmin = currentUser.role === "admin" || currentUser.role === "superadmin" || currentUser.role === "staff";
        if (!isAdmin) throw new Error("Not authorized");

        const allSubmissions = await ctx.db.query("formSubmissions").collect();

        const stats = {
            total: allSubmissions.length,
            pending: 0,
            reviewed: 0,
            approved: 0,
            rejected: 0,
            byType: {
                contact: 0,
                booking: 0,
                subscribe: 0,
                feedback: 0,
                custom: 0,
            } as Record<string, number>,
        };

        for (const sub of allSubmissions) {
            if (sub.status === "pending") stats.pending++;
            else if (sub.status === "reviewed") stats.reviewed++;
            else if (sub.status === "approved") stats.approved++;
            else if (sub.status === "rejected") stats.rejected++;

            const id = (sub.formId || "").toLowerCase();
            if (id.includes("contact")) stats.byType.contact++;
            else if (id.includes("book")) stats.byType.booking++;
            else if (id.includes("sub") || id.includes("newsletter")) stats.byType.subscribe++;
            else if (id.includes("feed") || id.includes("review") || id.includes("survey")) stats.byType.feedback++;
            else stats.byType.custom++;
        }

        return stats;
    },
});

