import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

function formatInvoiceNumber(existingInvoices: Array<{ invoiceNumber?: string }>): string {
  let maxNum = 0;
  for (const inv of existingInvoices) {
    if (inv.invoiceNumber) {
      const match = inv.invoiceNumber.match(/^INV-(\d+)-\d{2}-\d{2}-\d{2}$/i);
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
  return `INV-${nextNum}-${day}-${month}-${year}`;
}

export const createInvoice = mutation({
  args: {
    invoiceNumber: v.optional(v.string()),
    date: v.optional(v.string()),
    dueDate: v.optional(v.string()),
    fromName: v.optional(v.string()),
    fromEmail: v.optional(v.string()),
    toName: v.optional(v.string()),
    toEmail: v.optional(v.string()),
    items: v.array(v.object({
      id: v.string(),
      description: v.string(),
      quantity: v.union(v.number(), v.string()),
      rate: v.union(v.number(), v.string()),
      amount: v.number(),
      numberOfDays: v.union(v.number(), v.string()),
    })),
    taxRate: v.optional(v.union(v.number(), v.string())),
    taxAmount: v.optional(v.number()),
    subtotal: v.optional(v.number()),
    total: v.union(v.number(), v.string()),
    currency: v.optional(v.string()),
    clientId: v.optional(v.union(v.id("clients"), v.string())),
    quotationId: v.optional(v.union(v.id("quotations"), v.string())),
    invoiceDate: v.optional(v.number()),
    discountAmount: v.optional(v.string()),
    templateId: v.optional(v.any()),
    paidAmount: v.optional(v.string()),
    balanceDue: v.optional(v.string()),
    paymentType: v.optional(v.union(v.literal("MPESA"), v.literal("BANK"), v.literal("CASH"), v.literal("OTHER"))),
    paymentReference: v.optional(v.string()),
    paymentDate: v.optional(v.string()),
    terms: v.optional(v.string()),
    notes: v.optional(v.string()),
    status: v.union(
      v.literal("draft"),
      v.literal("sent"),
      v.literal("paid"),
      v.literal("partially_paid"),
      v.literal("overdue"),
      v.literal("cancelled")
    ),
    numberOfDays: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let invoiceNumber = args.invoiceNumber;
    if (!invoiceNumber || invoiceNumber.trim() === "") {
      const invoices = await ctx.db.query("invoices").collect();
      invoiceNumber = formatInvoiceNumber(invoices);
    }

    const today = new Date().toISOString().split("T")[0];
    const invoiceId = await ctx.db.insert("invoices", {
      fromName: args.fromName ?? "Ubuntu Logistics",
      fromEmail: args.fromEmail ?? "info@ubuntulogistics.co.ke",
      toName: args.toName ?? "",
      toEmail: args.toEmail ?? "",
      date: args.date ?? today,
      subtotal: args.subtotal ?? 0,
      taxAmount: args.taxAmount ?? 0,
      taxRate: args.taxRate ?? 0,
      ...args,
      invoiceNumber,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    return invoiceId;
  },
});

export const updateInvoice = mutation({
  args: {
    id: v.id("invoices"),
    invoiceNumber: v.optional(v.string()),
    date: v.optional(v.string()),
    dueDate: v.optional(v.string()),
    fromName: v.optional(v.string()),
    fromEmail: v.optional(v.string()),
    toName: v.optional(v.string()),
    toEmail: v.optional(v.string()),
    items: v.optional(v.array(v.object({
      id: v.string(),
      description: v.string(),
      quantity: v.union(v.number(), v.string()),
      rate: v.union(v.number(), v.string()),
      amount: v.number(),
      numberOfDays: v.union(v.number(), v.string()),
    }))),
    taxRate: v.optional(v.union(v.number(), v.string())),
    taxAmount: v.optional(v.number()),
    subtotal: v.optional(v.number()),
    total: v.optional(v.union(v.number(), v.string())),
    currency: v.optional(v.string()),
    clientId: v.optional(v.union(v.id("clients"), v.string())),
    quotationId: v.optional(v.union(v.id("quotations"), v.string())),
    invoiceDate: v.optional(v.number()),
    discountAmount: v.optional(v.string()),
    templateId: v.optional(v.any()),
    terms: v.optional(v.string()),
    notes: v.optional(v.string()),
    status: v.optional(v.union(
      v.literal("draft"),
      v.literal("sent"),
      v.literal("paid"),
      v.literal("partially_paid"),
      v.literal("overdue"),
      v.literal("cancelled")
    )),
    numberOfDays: v.optional(v.number()),
    paidAmount: v.optional(v.string()),
    balanceDue: v.optional(v.string()),
    paymentType: v.optional(v.union(v.literal("MPESA"), v.literal("BANK"), v.literal("CASH"), v.literal("OTHER"))),
    paymentReference: v.optional(v.string()),
    paymentDate: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updateData } = args;
    await ctx.db.patch(id, {
      ...updateData,
      updatedAt: Date.now(),
    });
  },
});

export const deleteInvoice = mutation({
  args: { id: v.id("invoices") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

export const getInvoices = query({
  handler: async (ctx) => {
    const invoices = await ctx.db.query("invoices").order("desc").collect();
    return invoices;
  },
});

export const listInvoices = getInvoices;

export const getInvoice = query({
  args: { id: v.id("invoices") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const getInvoiceByNumber = query({
  args: { invoiceNumber: v.string() },
  handler: async (ctx, args) => {
    const invoice = await ctx.db
      .query("invoices")
      .withIndex("by_number", (q) => q.eq("invoiceNumber", args.invoiceNumber))
      .first();
    return invoice;
  },
});

export const generateInvoiceNumber = query({
  args: {},
  handler: async (ctx) => {
    const invoices = await ctx.db.query("invoices").collect();
    return formatInvoiceNumber(invoices);
  },
});
