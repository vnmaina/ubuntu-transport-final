import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

function formatQuotationNumber(existingQuotations: Array<{ quotationNumber?: string }>): string {
  let maxNum = 0;
  for (const q of existingQuotations) {
    if (q.quotationNumber) {
      const match = q.quotationNumber.match(/^(?:QTN|QT)-(\d+)-\d{2}-\d{2}-\d{2}$/i);
      if (match) {
        const num = parseInt(match[1], 10);
        if (!isNaN(num) && num > maxNum) {
          maxNum = num;
        }
      }
    }
  }
  const nextNum = maxNum + 1;
  const now = new Date();
  const day = String(now.getDate()).padStart(2, "0");
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const year = String(now.getFullYear()).slice(-2);
  return `QTN-${nextNum}-${day}-${month}-${year}`;
}

export const createQuotation = mutation({
  args: {
    quotationNumber: v.optional(v.string()),
    date: v.optional(v.string()),
    dueDate: v.optional(v.string()),
    fromName: v.optional(v.string()),
    fromEmail: v.optional(v.string()),
    toName: v.optional(v.string()),
    toEmail: v.optional(v.string()),
    items: v.array(v.object({
      id: v.string(),
      date: v.string(),
      pickupPaid: v.string(),
      dropoffReturnTrip: v.string(),
      amount: v.union(v.number(), v.string()),
      numberOfDays: v.union(v.number(), v.string()),
      status: v.string(),
    })),
    total: v.union(v.number(), v.string()),
    currency: v.optional(v.string()),
    subtotal: v.optional(v.union(v.number(), v.string())),
    taxRate: v.optional(v.union(v.number(), v.string())),
    taxAmount: v.optional(v.union(v.number(), v.string())),
    discountAmount: v.optional(v.string()),
    terms: v.optional(v.string()),
    clientId: v.optional(v.union(v.id("clients"), v.string())),
    quotationDate: v.optional(v.number()),
    validUntil: v.optional(v.number()),
    notes: v.optional(v.string()),
    status: v.union(
      v.literal("draft"),
      v.literal("sent"),
      v.literal("accepted"),
      v.literal("rejected"),
      v.literal("expired")
    ),
    numberOfDays: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let quotationNumber = args.quotationNumber;
    if (!quotationNumber || quotationNumber.trim() === "") {
      const quotations = await ctx.db.query("quotations").collect();
      quotationNumber = formatQuotationNumber(quotations);
    }

    const today = new Date().toISOString().split("T")[0];
    const quotationId = await ctx.db.insert("quotations", {
      fromName: args.fromName ?? "Ubuntu Logistics",
      fromEmail: args.fromEmail ?? "info@ubuntulogistics.co.ke",
      toName: args.toName ?? "",
      toEmail: args.toEmail ?? "",
      date: args.date ?? today,
      ...args,
      quotationNumber,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    return quotationId;
  },
});

export const updateQuotation = mutation({
  args: {
    id: v.id("quotations"),
    quotationNumber: v.optional(v.string()),
    date: v.optional(v.string()),
    dueDate: v.optional(v.string()),
    fromName: v.optional(v.string()),
    fromEmail: v.optional(v.string()),
    toName: v.optional(v.string()),
    toEmail: v.optional(v.string()),
    items: v.optional(v.array(v.object({
      id: v.string(),
      date: v.string(),
      pickupPaid: v.string(),
      dropoffReturnTrip: v.string(),
      amount: v.union(v.number(), v.string()),
      numberOfDays: v.union(v.number(), v.string()),
      status: v.string(),
    }))),
    total: v.optional(v.union(v.number(), v.string())),
    currency: v.optional(v.string()),
    subtotal: v.optional(v.union(v.number(), v.string())),
    taxRate: v.optional(v.union(v.number(), v.string())),
    taxAmount: v.optional(v.union(v.number(), v.string())),
    discountAmount: v.optional(v.string()),
    terms: v.optional(v.string()),
    clientId: v.optional(v.union(v.id("clients"), v.string())),
    quotationDate: v.optional(v.number()),
    validUntil: v.optional(v.number()),
    notes: v.optional(v.string()),
    status: v.optional(v.union(
      v.literal("draft"),
      v.literal("sent"),
      v.literal("accepted"),
      v.literal("rejected"),
      v.literal("expired")
    )),
    numberOfDays: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { id, ...updateData } = args;
    await ctx.db.patch(id, {
      ...updateData,
      updatedAt: Date.now(),
    });
  },
});

export const deleteQuotation = mutation({
  args: { id: v.id("quotations") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

export const getQuotations = query({
  handler: async (ctx) => {
    const quotations = await ctx.db.query("quotations").order("desc").collect();
    return quotations;
  },
});

export const listQuotations = getQuotations;

export const getQuotation = query({
  args: { id: v.id("quotations") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const getQuotationByNumber = query({
  args: { quotationNumber: v.string() },
  handler: async (ctx, args) => {
    const quotation = await ctx.db
      .query("quotations")
      .withIndex("by_number", (q) => q.eq("quotationNumber", args.quotationNumber))
      .first();
    return quotation;
  },
});

export const generateQuotationNumber = query({
  args: {},
  handler: async (ctx) => {
    const quotations = await ctx.db.query("quotations").collect();
    return formatQuotationNumber(quotations);
  },
});

// Migration: Add validUntil and terms to existing quotations
export const migrateQuotationsWithDefaults = mutation({
  args: {},
  handler: async (ctx) => {
    const quotations = await ctx.db.query("quotations").collect();
    const defaultTerms = "This quotation is valid for 14 days from the date of issue. Prices are subject to change without prior notice. Payment terms: 50% advance, 50% upon completion.";

    let updatedCount = 0;
    for (const quotation of quotations) {
      const updates: any = {};

      // Add validUntil if missing (14 days from quotationDate or date)
      if (!quotation.validUntil) {
        const quotationDate = quotation.quotationDate
          ? new Date(quotation.quotationDate)
          : quotation.date
          ? new Date(quotation.date)
          : new Date();
        const validUntilDate = new Date(quotationDate);
        validUntilDate.setDate(quotationDate.getDate() + 14);
        updates.validUntil = validUntilDate.getTime();
      }

      // Add terms if missing
      if (!quotation.terms) {
        updates.terms = defaultTerms;
      }

      // Apply updates if any
      if (Object.keys(updates).length > 0) {
        await ctx.db.patch(quotation._id, updates);
        updatedCount++;
      }
    }

    return { updatedCount, total: quotations.length };
  },
});
