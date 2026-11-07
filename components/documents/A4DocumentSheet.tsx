"use client";

import React from "react";
import {
  NormalizedDocument,
  OrganizationData,
  DocumentCustomization,
} from "./document-types";
import { DocumentStamp } from "./DocumentStamp";
import { DocumentSignature } from "./DocumentSignature";
import { DocumentQrCode } from "./DocumentQrCode";
import { formatCurrency as formatCurrencyUtil } from "@/utils/currency";
import {
  Building2,
  Mail,
  Phone,
  MapPin,
  Globe,
  CreditCard,
  FileCheck2,
  Calendar,
  Clock,
  Landmark,
  BadgeAlert,
  Hash,
} from "lucide-react";

interface A4DocumentSheetProps {
  document: NormalizedDocument;
  organization?: OrganizationData | null;
  customization: DocumentCustomization;
  forwardedRef?: React.Ref<HTMLDivElement>;
}

export const A4DocumentSheet = React.forwardRef<HTMLDivElement, A4DocumentSheetProps>(
  function A4DocumentSheet({ document, organization, customization }, ref) {
    const {
      style = "corporate",
      showLogo = true,
      logoUrl,
      logoSource = "organization",
      showStamp = true,
      stampType = "seal",
      customStampUrl,
      stampSource = "url",
      showSignature = true,
      signatureType = "cursive",
      customSignatureUrl,
      signatureSource = "url",
      signatoryName,
      signatoryTitle,
      showClientSignature = false,
      showPaymentDetails = true,
      showTerms = true,
      showNotes = true,
      showQrCode = false,
      primaryColor = "#262559",
      secondaryColor = "#D72533",
      accentColor = "#D72533",
      fontFamily = "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    } = customization;

    const orgLogo = logoSource === "organization" ? organization?.logo : logoUrl || "/ubuntu-logo.webp";
    const orgName = organization?.name || "Corporate Enterprise Ltd.";
    const orgEmail = organization?.email || "Ben@ubuntulogistics.co.ke";
    const client = document.client;

    const formattedDate = document.date
      ? new Date(document.date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
      : "—";

    const formattedDueDate = document.dueDate
      ? new Date(document.dueDate).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
      : document.validUntil
        ? new Date(document.validUntil).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
        : undefined;

    const dueDateLabel = document.type === "quotation" ? "Valid Until" : "Due Date";

    // Format currency amount safely
    const formatCurrency = (val: string | number | undefined) => {
      return formatCurrencyUtil(val, document.currency);
    };

    // Document Title
    const documentTitle =
      document.type === "invoice"
        ? "INVOICE"
        : document.type === "quotation"
          ? "FORMAL QUOTATION"
          : "PAYMENT RECEIPT";

    // Status styling with AAA contrast
    const getStatusBadge = () => {
      const s = (document.status || "draft").toLowerCase();
      if (s === "paid" || s === "accepted") {
        return {
          bg: "bg-emerald-100 text-emerald-950 border-emerald-400",
          text: s === "paid" ? "PAID IN FULL" : "ACCEPTED",
        };
      }
      if (s === "sent") {
        return {
          bg: "bg-blue-100 text-blue-950 border-blue-400",
          text: "ISSUED / SENT",
        };
      }
      if (s === "overdue" || s === "rejected") {
        return {
          bg: "bg-rose-100 text-rose-950 border-rose-400",
          text: s === "overdue" ? "OVERDUE" : "REJECTED",
        };
      }
      return {
        bg: `${primaryColor}10`,
        text: s.toUpperCase(),
        color: primaryColor,
      };
    };

    const statusBadge = getStatusBadge();

    // ==========================================
    // TEMPLATE 1: CORPORATE EXECUTIVE (Default)
    // ==========================================
    const renderCorporateTemplate = () => (
      <div className="flex flex-col justify-between h-full min-h-[267mm] relative">
        {/* Background Watermark Logo */}
        {showLogo && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5 z-0">
            <img
              src="/ubuntu-logo.webp"
              alt="Watermark"
              className="w-48 h-48 object-contain"
              crossOrigin="anonymous"
            />
          </div>
        )}
        <div className="relative z-10">
          {/* Top Decorative Brand Stripe */}
          <div className="flex items-center justify-between pb-4 mb-4 border-b-2" style={{ borderColor: primaryColor }}>
            {/* Logo and Company Details */}
            <div className="flex items-start gap-4">
              {showLogo && (
                <img
                  src={orgLogo || "/ubuntu-logo.webp"}
                  alt={orgName}
                  className="h-18 max-w-[95px] object-contain shrink-0"
                  crossOrigin="anonymous"
                />
              )}
              <div>
                <h2 className="text-xl font-black tracking-tight leading-tight" style={{ color: primaryColor }}>
                  {orgName}
                </h2>
                {organization?.address && (
                  <p className="text-xs text-slate-600 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
                    <span>{organization.address}</span>
                  </p>
                )}
                <div className="flex items-center gap-4 text-xs text-slate-600 mt-1">
                  {organization?.phone && (
                    <span className="flex items-center gap-1">
                      <Phone className="w-3 h-3 text-slate-500 shrink-0" />
                      {organization.phone}
                    </span>
                  )}
                  {organization?.email && (
                    <span className="flex items-center gap-1">
                      <Mail className="w-3 h-3 text-slate-500 shrink-0" />
                      {orgEmail}
                    </span>
                  )}
                  {organization?.taxId && (
                    <span className="font-semibold text-slate-800">
                      Tax/VAT: {organization.taxId}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Document Header Coordinates */}
            <div className="text-right">
              <h1 className="text-2xl font-black text-primary tracking-tight mt-0.5" >
                {documentTitle}
              </h1>
              <div className="flex items-center justify-end gap-2 mt-2">
                <span className="font-mono text-sm font-black text-secondary px-2 py-0.5 rounded border" style={{ color: primaryColor, backgroundColor: `${primaryColor}10`, borderColor: primaryColor }}>
                  #{document.documentNumber}
                </span>
                <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded border" style={{ backgroundColor: statusBadge.bg, color: statusBadge.color || statusBadge.text }}>
                  {statusBadge.text}
                </span>
              </div>
            </div>
          </div>

          {/* Meta Grid: Client vs Dates */}
          <div className="grid grid-cols-12 gap-6 mb-4">
            {/* Bill To / Recipient */}
            <div className="col-span-7 p-4 rounded-xl border-2" style={{ backgroundColor: `${primaryColor}05`, borderColor: primaryColor }}>
              <span className="text-[10px] font-black uppercase tracking-wider block mb-1" style={{ color: secondaryColor }}>
                {document.type === "receipt" ? "Payment Received From:" : "Recipient / Billed To:"}
              </span>
              <h3 className="text-base font-bold" style={{ color: primaryColor }}>
                {client?.name || "Client Name"}
              </h3>
              {client?.companyName && (
                <p className="text-xs font-semibold text-slate-800 mt-0.5">
                  {client.companyName}
                </p>
              )}
              {client?.address && (
                <p className="text-xs text-slate-600 mt-1 leading-snug">
                  {client.address}
                  {(client.city || client.state) && `, ${[client.city, client.state, client.postalCode].filter(Boolean).join(" ")}`}
                  {client.country && `, ${client.country}`}
                </p>
              )}
              <div className="flex items-center gap-4 text-xs text-slate-600 mt-2 pt-2 border-t border-slate-200/60">
                {client?.email && <span>{client.email}</span>}
                {client?.phone && <span>{client.phone}</span>}
                {client?.taxId && <span className="font-medium text-slate-800">Tax ID: {client.taxId}</span>}
              </div>
            </div>

            {/* Document Dates & Reference */}
            <div className="col-span-5 bg-slate-50/80 p-4 rounded-xl border border-slate-200 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block mb-1">
                  Document Details:
                </span>
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-600 font-medium">Issue Date:</span>
                    <span className="font-bold text-slate-900">{formattedDate}</span>
                  </div>
                  {formattedDueDate && (
                    <div className="flex justify-between">
                      <span className="text-slate-600 font-medium">{dueDateLabel}:</span>
                      <span className="font-bold text-slate-900">{formattedDueDate}</span>
                    </div>
                  )}
                  {document.invoiceNumber && (
                    <div className="flex justify-between">
                      <span className="text-slate-600 font-medium">Linked Invoice:</span>
                      <span className="font-mono font-bold text-slate-900">#{document.invoiceNumber}</span>
                    </div>
                  )}
                  {document.paymentMethod && (
                    <div className="flex justify-between">
                      <span className="text-slate-600 font-medium">Payment Mode:</span>
                      <span className="font-bold text-slate-900 capitalize">
                        {document.paymentMethod.replace(/_/g, " ")}
                      </span>
                    </div>
                  )}
                  {document.paymentReference && (
                    <div className="flex justify-between">
                      <span className="text-slate-600 font-medium">Payment Ref:</span>
                      <span className="font-mono font-medium text-slate-800">{document.paymentReference}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Precision Itemized Table */}
          <div className="mb-4">
            <table className="w-full border-collapse">
              <thead>
                <tr className="text-white text-[10px] uppercase tracking-wider font-bold" style={{ backgroundColor: primaryColor }}>
                  <th className="py-2 px-2.5 text-left w-10 rounded-tl-lg">#</th>
                  <th className="py-2 px-3 text-left">Description / Specification</th>
                  <th className="py-2 px-2.5 text-center w-20">Qty</th>
                  <th className="py-2 px-3 text-right w-28">Rate</th>
                  <th className="py-2 px-3 text-right w-32 rounded-tr-lg">Amount</th>
                </tr>
              </thead>
              <tbody className="text-[10px] divide-y divide-slate-200 border-x border-b border-slate-200">
                {document.items && document.items.length > 0 ? (
                  document.items.map((item, index) => (
                    <tr
                      key={index}
                      className={index % 2 === 0 ? "bg-white" : "bg-slate-50/70"}
                    >
                      <td className="py-2 px-2.5 text-slate-500 font-mono text-[10px]">
                        {index + 1}
                      </td>
                      <td className="py-2 px-3 font-semibold text-slate-900">
                        {item.description}
                      </td>
                      <td className="py-2 px-2.5 text-center text-slate-700 font-mono">
                        {item.quantity}
                      </td>
                      <td className="py-2 px-3 text-right text-slate-700 font-mono">
                        {formatCurrency(item.unitPrice)}
                      </td>
                      <td className="py-2 px-3 text-right font-bold text-slate-950 font-mono">
                        {formatCurrency(item.total)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-4 text-center text-slate-500 italic">
                      No line items specified.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Notes Section */}
          {showNotes && document.notes && (
            <div className="mb-6 p-3 rounded-lg bg-amber-50/70 border border-amber-200/80 text-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900 block mb-0.5">
                Important Notes:
              </span>
              <p className="text-amber-950 leading-relaxed">{document.notes}</p>
            </div>
          )}

          {/* Financial Breakdown & Totals Grid */}
          <div className="grid grid-cols-12 gap-4 mb-4">
            {/* Calculations Card */}
            <div className="col-span-12">
              <div className="bg-slate-50 rounded-lg p-2.5 border border-slate-200 space-y-1 text-[10px]">
                <div className="flex justify-end gap-8">
                  <div className="flex gap-8">
                    <div className="text-right">
                      <span className="font-medium text-slate-700">Subtotal</span>
                    </div>
                    <div className="font-mono font-semibold text-slate-900">
                      {formatCurrency(document.subtotal)}
                    </div>
                  </div>

                  {document.taxAmount && parseFloat(String(document.taxAmount)) > 0 && (
                    <div className="flex gap-8">
                      <div className="text-right">
                        <span className="font-medium text-slate-700">
                          Tax {document.taxRate ? `(${document.taxRate}%)` : ""}
                        </span>
                      </div>
                      <div className="font-mono font-semibold text-slate-900">
                        {formatCurrency(document.taxAmount)}
                      </div>
                    </div>
                  )}

                  {document.discountAmount && parseFloat(String(document.discountAmount)) > 0 && (
                    <div className="flex gap-8">
                      <div className="text-right">
                        <span className="font-medium text-emerald-700">Discount</span>
                      </div>
                      <div className="font-mono font-bold text-emerald-700">
                        -{formatCurrency(document.discountAmount)}
                      </div>
                    </div>
                  )}
                </div>

                {/* Grand Total Bar */}
                <div className="pt-1 mt-1 border-t-2 flex justify-end items-baseline gap-8" style={{ borderColor: primaryColor }}>
                  <div className="text-right">
                    <span className="text-xs font-black uppercase tracking-wider" style={{ color: primaryColor }}>
                      {document.type === "receipt" ? "Amount Received" : "Total Due"}
                    </span>
                  </div>
                  <div className="text-base font-black font-mono" style={{ color: secondaryColor }}>
                    {formatCurrency(document.total)}
                  </div>
                </div>

                {/* Paid & Balance due (for invoices) */}
                {document.type === "invoice" && document.paidAmount !== undefined && (
                  <div className="pt-1 border-t border-slate-200/80 space-y-0.5 flex justify-end gap-8">
                    <div className="flex gap-8">
                      <div className="text-right">
                        <span className="text-slate-600">Paid to Date:</span>
                      </div>
                      <div className="font-mono font-semibold text-emerald-700">
                        {formatCurrency(document.paidAmount)}
                      </div>
                    </div>
                    {document.balanceDue !== undefined && (
                      <div className="flex gap-8">
                        <div className="text-right">
                          <span className="font-bold text-slate-900">Balance Due:</span>
                        </div>
                        <div className="font-mono text-rose-700 font-black">
                          {formatCurrency(document.balanceDue)}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Authorization & Signature Section */}
        <div className="border-t-2 relative" style={{ borderColor: primaryColor }}>
          <div className="flex items-end justify-between">
            {/* Official Stamp Placement - left side */}
            <div className="w-[6rem] relative min-h-[40px] flex items-center justify-start">
              {showStamp && (
                <DocumentStamp
                  type={stampType}
                  customStampUrl={customStampUrl}
                  stampSource={stampSource}
                  organizationStampUrl={organization?.stampUrl}
                  companyName={orgName}
                  date={document.date}
                  referenceNumber={document.documentNumber}
                  color="#dc2626"
                  useLogoAsWatermark={true}
                  logoUrl="/ubuntu-logo.webp"
                />
              )}
            </div>

            {/* Signature Block with Watermark - right side */}
            <div className="flex-1 max-w-md relative">
              
              {showSignature && (
                <DocumentSignature
                  signatoryName={signatoryName || organization?.signatoryName || "Authorized Representative"}
                  signatoryTitle={signatoryTitle || organization?.signatoryTitle || "Executive Director"}
                  signatureType="custom"
                  customSignatureUrl="/signature.webp"
                  signatureSource="url"
                  organizationSignatureUrl={organization?.signatureUrl}
                  date={document.date}
                  showClientSignature={showClientSignature}
                  clientName={client?.name}
                  clientCompanyName={client?.companyName}
                />
              )}
            </div>
          </div>

          {/* Terms & Conditions */}
          {showTerms && (
            <div className="mb-3 p-2 rounded border" style={{ borderColor: primaryColor, backgroundColor: `${primaryColor}05` }}>
              <span className="text-[9px] font-bold uppercase tracking-wider block mb-1" style={{ color: primaryColor }}>
                Terms & Conditions:
              </span>
              {document.terms ? (
                <p className="text-[9px] whitespace-pre-line" style={{ color: secondaryColor }}>
                  {document.terms}
                </p>
              ) : (
                <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 text-[9px]" style={{ color: secondaryColor }}>
                  <ul className="list-disc list-inside space-y-0.5">
                    <li>This quotation is valid for 14 days from the date of issue.</li>
                    <li>Prices are subject to change without prior notice.</li>
                    <li>Payment terms: 50% advance, 50% upon completion.</li>
                  </ul>
                  <ul className="list-disc list-inside space-y-0.5">
                    <li>Accepted payments: Cash, Bank Transfer, Mobile Money (M-PESA).</li>
                    <li>KCB Bank Account: 1350132330 (Tai Ubuntu Logistics Ltd)</li>
                    <li>M-PESA PAYBILL: 522533, ACCOUNT: 8077526</li>
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Legal Certification Footer */}
          <div className="mt-3 pt-2 border-t border-slate-100 flex justify-between items-center text-[9px] text-slate-400">
            <span>Official Computer-Generated & Sealed Document • {orgName}</span>
            <span>Page 1 of 1</span>
          </div>
        </div>
      </div>
    );

    // ==========================================
    // TEMPLATE 3: CLASSIC FORMAL (Traditional)
    // ==========================================
    const renderClassicTemplate = () => (
      <div className="flex flex-col justify-between h-full min-h-[267mm] relative">
        {/* Background Watermark Logo */}
        {showLogo && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5 z-0">
            <img
              src="/ubuntu-logo.webp"
              alt="Watermark"
              className="w-48 h-48 object-contain"
              crossOrigin="anonymous"
            />
          </div>
        )}
        <div className="relative z-10">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div>
              {showLogo && (
                <img
                  src={orgLogo || "/ubuntu-logo.webp"}
                  alt={orgName}
                  className="h-7 max-w-[100px] object-contain mb-2"
                  crossOrigin="anonymous"
                />
              )}
              <h1 className="text-4xl font-black tracking-tight text-slate-950">
                {documentTitle}
              </h1>
              <p className="text-slate-600 font-mono text-sm font-bold mt-1">
                Ref: #{document.documentNumber}
              </p>
            </div>

            <div className="text-right">
              <span className={`inline-block text-xs font-bold uppercase px-3 py-1 rounded-full border mb-3 ${statusBadge.bg}`}>
                {statusBadge.text}
              </span>
              <div className="space-y-1 text-xs text-slate-600">
                <div>
                  <span className="font-semibold text-slate-800">Date: </span>
                  {formattedDate}
                </div>
                {formattedDueDate && (
                  <div>
                    <span className="font-semibold text-slate-800">{dueDateLabel}: </span>
                    {formattedDueDate}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 2-column Client / Issuer Modern Cards */}
          <div className="grid grid-cols-2 gap-6 mb-6 pb-6 border-b border-slate-200">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 block mb-1">
                BILLED TO
              </span>
              <h3 className="text-lg font-bold text-slate-900">{client?.name}</h3>
              {client?.companyName && (
                <p className="text-xs font-semibold text-slate-700 mt-0.5">{client.companyName}</p>
              )}
              {client?.address && (
                <p className="text-xs text-slate-600 mt-1 leading-snug">{client.address}</p>
              )}
              {client?.email && <p className="text-xs text-slate-600 mt-1">{client.email}</p>}
            </div>

            <div className="text-right">
              <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 block mb-1">
                ISSUED BY
              </span>
              <h3 className="text-lg font-bold" style={{ color: primaryColor }}>{orgName}</h3>
              {organization?.address && (
                <p className="text-xs text-slate-600 mt-0.5">{organization.address}</p>
              )}
              {organization?.email && (
                <p className="text-xs text-slate-600 mt-0.5">{orgEmail}</p>
              )}
              {organization?.taxId && (
                <p className="text-xs font-semibold text-slate-800 mt-1">Tax ID: {organization.taxId}</p>
              )}
            </div>
          </div>

          {/* Minimalist Line Items */}
          <div className="mb-6">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b-2 font-bold uppercase tracking-wider text-[11px]" style={{ borderColor: primaryColor, color: primaryColor }}>
                  <th className="py-3 text-left w-10">#</th>
                  <th className="py-3 text-left">Description</th>
                  <th className="py-3 text-center w-20">Qty</th>
                  <th className="py-3 text-right w-28">Price</th>
                  <th className="py-3 text-right w-32">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {document.items && document.items.length > 0 ? (
                  document.items.map((item, i) => (
                    <tr key={i} className="hover:bg-slate-50/50">
                      <td className="py-3 text-slate-400 font-mono">{i + 1}</td>
                      <td className="py-3 font-semibold text-slate-900">{item.description}</td>
                      <td className="py-3 text-center font-mono text-slate-600">{item.quantity}</td>
                      <td className="py-3 text-right font-mono text-slate-600">{formatCurrency(item.unitPrice)}</td>
                      <td className="py-3 text-right font-mono font-bold text-slate-900">{formatCurrency(item.total)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-6 text-center text-slate-400 italic">No line items.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Modern Totals Section */}
          <div className="flex justify-end mb-4">
            <div className="w-64 space-y-1 text-[10px]">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span className="font-mono font-semibold">{formatCurrency(document.subtotal)}</span>
              </div>
              {document.taxAmount && parseFloat(String(document.taxAmount)) > 0 && (
                <div className="flex justify-between text-slate-600">
                  <span>Tax ({document.taxRate || 0}%)</span>
                  <span className="font-mono font-semibold">{formatCurrency(document.taxAmount)}</span>
                </div>
              )}
              {document.discountAmount && parseFloat(String(document.discountAmount)) > 0 && (
                <div className="flex justify-between text-emerald-600 font-medium">
                  <span>Discount</span>
                  <span className="font-mono font-semibold">-{formatCurrency(document.discountAmount)}</span>
                </div>
              )}
              <div className="border-t-2 pt-2 flex justify-between items-baseline" style={{ borderColor: primaryColor }}>
                <span className="text-sm font-black" style={{ color: primaryColor }}>TOTAL</span>
                <span className="text-lg font-black font-mono" style={{ color: secondaryColor }}>{formatCurrency(document.total)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer with Stamp & Signatures */}
        <div className="pt-3 border-t" style={{ borderColor: primaryColor }}>
          <div className="flex items-end justify-between">
            {/* Stamp - left side */}
            <div className="w-[4.5rem]">
              {showStamp && (
                <DocumentStamp
                  type={stampType}
                  customStampUrl={customStampUrl}
                  stampSource={stampSource}
                  organizationStampUrl={organization?.stampUrl}
                  companyName={orgName}
                  date={document.date}
                  referenceNumber={document.documentNumber}
                  color="#dc2626"
                  useLogoAsWatermark={true}
                  logoUrl="/ubuntu-logo.webp"
                />
              )}
            </div>

            {/* Signature Block with Watermark - right side */}
            <div className="flex-1 max-w-md relative">
              {/* Watermark logo positioned to overlap with signature */}
              {showLogo && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <img
                    src="/ubuntu-footer-logo.webp"
                    alt={orgName}
                    className="h-14 max-w-[100px] object-contain opacity-20"
                  />
                </div>
              )}
              {showSignature && (
                <DocumentSignature
                  signatoryName={signatoryName || organization?.signatoryName || "Authorized Representative"}
                  signatoryTitle={signatoryTitle || organization?.signatoryTitle || "Executive Director"}
                  signatureType="custom"
                  customSignatureUrl="/signature.webp"
                  signatureSource="url"
                  organizationSignatureUrl={organization?.signatureUrl}
                  date={document.date}
                  showClientSignature={showClientSignature}
                  clientName={client?.name}
                  clientCompanyName={client?.companyName}
                />
              )}
            </div>
          </div>

          {/* Terms & Conditions */}
          {showTerms && (
            <div className="mb-3 p-2 rounded border" style={{ borderColor: primaryColor, backgroundColor: `${primaryColor}05` }}>
              <span className="text-[9px] font-bold uppercase tracking-wider block mb-1" style={{ color: primaryColor }}>
                Terms & Conditions:
              </span>
              {document.terms ? (
                <p className="text-[9px] whitespace-pre-line" style={{ color: secondaryColor }}>
                  {document.terms}
                </p>
              ) : (
                <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 text-[9px]" style={{ color: secondaryColor }}>
                  <ul className="list-disc list-inside space-y-0.5">
                    <li>This quotation is valid for 14 days from the date of issue.</li>
                    <li>Prices are subject to change without prior notice.</li>
                    <li>Payment terms: 50% advance, 50% upon completion.</li>
                  </ul>
                  <ul className="list-disc list-inside space-y-0.5">
                    <li>Accepted payments: Cash, Bank Transfer, Mobile Money (M-PESA).</li>
                    <li>KCB Bank Account: 1350132330 (Tai Ubuntu Logistics Ltd)</li>
                    <li>M-PESA PAYBILL: 522533, ACCOUNT: 8077526</li>
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );

    // ==========================================
    // TEMPLATE 2: MODERN MINIMAL
    // ==========================================
    const renderModernTemplate = () => (
      <div className="flex flex-col justify-between h-full min-h-[267mm] relative">
        {/* Background Watermark Logo */}
        {showLogo && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5 z-0">
            <img
              src="/ubuntu-logo.webp"
              alt="Watermark"
              className="w-48 h-48 object-contain"
              crossOrigin="anonymous"
            />
          </div>
        )}
        <div className="relative z-10">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div>
              {showLogo && (
                <img
                  src={orgLogo || "/ubuntu-logo.webp"}
                  alt={orgName}
                  className="h-7 max-w-[100px] object-contain mb-2"
                  crossOrigin="anonymous"
                />
              )}
              <h1 className="text-4xl font-black tracking-tight text-slate-950">
                {documentTitle}
              </h1>
              <p className="text-slate-600 font-mono text-sm font-bold mt-1">
                Ref: #{document.documentNumber}
              </p>
            </div>

            <div className="text-right">
              <span className={`inline-block text-xs font-bold uppercase px-3 py-1 rounded-full border mb-3 ${statusBadge.bg}`}>
                {statusBadge.text}
              </span>
              <div className="space-y-1 text-xs text-slate-600">
                <div>
                  <span className="font-semibold text-slate-800">Date: </span>
                  {formattedDate}
                </div>
                {formattedDueDate && (
                  <div>
                    <span className="font-semibold text-slate-800">{dueDateLabel}: </span>
                    {formattedDueDate}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 2-column Client / Issuer Modern Cards */}
          <div className="grid grid-cols-2 gap-6 mb-6 pb-6 border-b border-slate-200">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 block mb-1">
                BILLED TO
              </span>
              <h3 className="text-lg font-bold text-slate-900">{client?.name}</h3>
              {client?.companyName && (
                <p className="text-xs font-semibold text-slate-700 mt-0.5">{client.companyName}</p>
              )}
              {client?.address && (
                <p className="text-xs text-slate-600 mt-1 leading-snug">{client.address}</p>
              )}
              {client?.email && <p className="text-xs text-slate-600 mt-1">{client.email}</p>}
            </div>

            <div className="text-right">
              <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 block mb-1">
                ISSUED BY
              </span>
              <h3 className="text-lg font-bold" style={{ color: primaryColor }}>{orgName}</h3>
              {organization?.address && (
                <p className="text-xs text-slate-600 mt-0.5">{organization.address}</p>
              )}
              {organization?.email && (
                <p className="text-xs text-slate-600 mt-0.5">{orgEmail}</p>
              )}
              {organization?.taxId && (
                <p className="text-xs font-semibold text-slate-800 mt-1">Tax ID: {organization.taxId}</p>
              )}
            </div>
          </div>

          {/* Minimalist Line Items */}
          <div className="mb-6">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b-2 font-bold uppercase tracking-wider text-[11px]" style={{ borderColor: primaryColor, color: primaryColor }}>
                  <th className="py-3 text-left w-10">#</th>
                  <th className="py-3 text-left">Description</th>
                  <th className="py-3 text-center w-20">Qty</th>
                  <th className="py-3 text-right w-28">Price</th>
                  <th className="py-3 text-right w-32">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {document.items && document.items.length > 0 ? (
                  document.items.map((item, i) => (
                    <tr key={i} className="hover:bg-slate-50/50">
                      <td className="py-3 text-slate-400 font-mono">{i + 1}</td>
                      <td className="py-3 font-semibold text-slate-900">{item.description}</td>
                      <td className="py-3 text-center font-mono text-slate-600">{item.quantity}</td>
                      <td className="py-3 text-right font-mono text-slate-600">{formatCurrency(item.unitPrice)}</td>
                      <td className="py-3 text-right font-mono font-bold text-slate-900">{formatCurrency(item.total)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-6 text-center text-slate-400 italic">No line items.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Modern Totals Section */}
          <div className="flex justify-end mb-4">
            <div className="w-64 space-y-1 text-[10px]">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span className="font-mono font-semibold">{formatCurrency(document.subtotal)}</span>
              </div>
              {document.taxAmount && parseFloat(String(document.taxAmount)) > 0 && (
                <div className="flex justify-between text-slate-600">
                  <span>Tax ({document.taxRate || 0}%)</span>
                  <span className="font-mono font-semibold">{formatCurrency(document.taxAmount)}</span>
                </div>
              )}
              {document.discountAmount && parseFloat(String(document.discountAmount)) > 0 && (
                <div className="flex justify-between text-emerald-600 font-medium">
                  <span>Discount</span>
                  <span className="font-mono font-semibold">-{formatCurrency(document.discountAmount)}</span>
                </div>
              )}
              <div className="border-t-2 pt-2 flex justify-between items-baseline" style={{ borderColor: primaryColor }}>
                <span className="text-sm font-black" style={{ color: primaryColor }}>TOTAL</span>
                <span className="text-lg font-black font-mono" style={{ color: secondaryColor }}>{formatCurrency(document.total)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer with Stamp & Signatures */}
        <div className="pt-1 border-t" style={{ borderColor: primaryColor }}>
          <div className="flex items-end justify-between">
            {/* Stamp - left side */}
            <div className="w-[4.5rem]">
              {showStamp && (
                <DocumentStamp
                  type={stampType}
                  customStampUrl={customStampUrl}
                  stampSource={stampSource}
                  organizationStampUrl={organization?.stampUrl}
                  companyName={orgName}
                  date={document.date}
                  referenceNumber={document.documentNumber}
                  color="#dc2626"
                  useLogoAsWatermark={true}
                  logoUrl="/ubuntu-logo.webp"
                />
              )}
            </div>

            {/* Signature Block with Watermark - right side */}
            <div className="flex-1 max-w-md relative">
              
              {showSignature && (
                <DocumentSignature
                  signatoryName={signatoryName || organization?.signatoryName || "Authorized Representative"}
                  signatoryTitle={signatoryTitle || organization?.signatoryTitle || "Executive Director"}
                  signatureType="custom"
                  customSignatureUrl="/signature.webp"
                  signatureSource="url"
                  organizationSignatureUrl={organization?.signatureUrl}
                  date={document.date}
                  showClientSignature={showClientSignature}
                  clientName={client?.name}
                  clientCompanyName={client?.companyName}
                />
              )}
            </div>
          </div>

          {/* Terms & Conditions */}
          {showTerms && (
            <div className="mb-3 p-2 rounded border" style={{ borderColor: primaryColor, backgroundColor: `${primaryColor}05` }}>
              <span className="text-[9px] font-bold uppercase tracking-wider block mb-1" style={{ color: primaryColor }}>
                Terms & Conditions:
              </span>
              {document.terms ? (
                <p className="text-[9px] whitespace-pre-line" style={{ color: secondaryColor }}>
                  {document.terms}
                </p>
              ) : (
                <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 text-[9px]" style={{ color: secondaryColor }}>
                  <ul className="list-disc list-inside space-y-0.5">
                    <li>This quotation is valid for 14 days from the date of issue.</li>
                    <li>Prices are subject to change without prior notice.</li>
                    <li>Payment terms: 50% advance, 50% upon completion.</li>
                  </ul>
                  <ul className="list-disc list-inside space-y-0.5">
                    <li>Accepted payments: Cash, Bank Transfer, Mobile Money (M-PESA).</li>
                    <li>KCB Bank Account: 1350132330 (Tai Ubuntu Logistics Ltd)</li>
                    <li>M-PESA PAYBILL: 522533, ACCOUNT: 8077526</li>
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );

    return (
      <div
        ref={ref}
        id="a4-document-printable-sheet"
        className="bg-white text-slate-950 shadow-2xl relative select-text"
        style={{
          width: "210mm",
          minHeight: "297mm",
          boxSizing: "border-box",
          padding: "16mm",
          margin: "0 auto",
          fontFamily,
          backgroundColor: "#ffffff",
          color: "#0f172a",
        }}
      >
        {style === "corporate" && renderCorporateTemplate()}
        {style === "modern" && renderModernTemplate()}
        {style === "classic" && renderClassicTemplate()}
      </div>
    );
  }
);
