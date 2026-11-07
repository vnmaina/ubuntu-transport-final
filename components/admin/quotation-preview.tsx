"use client";

import { useState } from "react";
import { Download, Globe, Mail, Phone, Loader2, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuotation } from "@/context/quotation-context";
import { formatDate } from "@/utils/formatters";
import { generateQuotationPDF } from "@/utils/pdf-generator";
import { saveQuotationToHistory } from "@/utils/history";
import { toast } from "sonner";
import { QuotationData } from "@/types/quotation";

interface QuotationDocumentProps {
  quotation: QuotationData;
  id?: string;
}

/**
 * The pristine, print-ready A4 document view for Quotations.
 * Styled with generous padding and professional layout.
 */
export function QuotationDocument({
  quotation,
  id = "quotation-document",
}: QuotationDocumentProps) {
  const currency = quotation.currency || "KES";
  return (
    <div
      id={id}
      className="relative bg-white text-slate-800 flex flex-col justify-between p-8 sm:p-12 md:p-14"
      style={{ minHeight: "1120px", aspectRatio: "1 / 1.414" }}
    >
      {/* Subtle Background Watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.035] z-0">
        <img
          src="/ubuntu.webp"
          alt="watermark"
          className="w-96 h-96 object-contain"
        />
      </div>

      {/* ════════════════════════════════════════
          TOP HEADER ZONE
      ════════════════════════════════════════ */}
      <div className="relative z-10">
        {/* Top Accent Stripe */}
        <div className="h-1.5 w-full bg-[#262559] rounded-full mb-6" />

        {/* Logo + Company (Side-by-side) & Quotation Title Row */}
        <div className="flex flex-row justify-between items-start gap-4">
          {/* Logo & Company Name NEXT TO LOGO */}
          <div className="flex items-center gap-4">
            <img
              src="/ubuntu.webp"
              alt="Ubuntu Logistics & Transport"
              className="h-20 sm:h-24 w-auto object-contain shrink-0"
            />
            <div>
              <h2 className="text-lg sm:text-xl font-black text-[#262559] tracking-tight leading-tight">
                Ubuntu Logistics &amp; Transport
              </h2>
              <p className="text-xs sm:text-sm font-medium text-slate-500 mt-0.5">
                Reliable &amp; Efficient Transport Logistics
              </p>
            </div>
          </div>

          <div className="text-right">
            <h1 className="text-2xl sm:text-3xl font-black text-[#262559] tracking-wider uppercase">
              QUOTATION
            </h1>
            <div className="mt-1 flex items-center justify-end">
              <span className="font-mono font-bold text-xs sm:text-sm px-2.5 py-0.5 rounded bg-[#262559]/10 text-[#262559] border border-[#262559]/20">
                #{quotation.quotationNumber}
              </span>
            </div>
            <div className="text-right text-xs text-slate-600 mt-2 space-y-0.5">
              <p>
                <span className="text-slate-400 font-bold uppercase text-[10px] mr-1.5">
                  Date:
                </span>
                <span className="font-semibold text-slate-800">
                  {formatDate(quotation.date)}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <hr className="border-slate-200/90 my-5" />

        {/* FROM / PREPARED FOR Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-slate-50/80 border border-slate-200/70 rounded-xl p-3.5 sm:p-4">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
              From
            </p>
            <p className="font-bold text-sm sm:text-base text-slate-900">
              {quotation.fromName || "Ubuntu Logistics & Transport"}
            </p>
            <div className="mt-2 space-y-1 text-xs text-slate-600">
              <div className="flex items-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                <span>North Airport Road, Embakasi, Nairobi, Kenya</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>info@ubuntulogistics.co.ke</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>+254 728 798589</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>www.ubuntulogistics.co.ke</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-50/80 border border-slate-200/70 rounded-xl p-3.5 sm:p-4">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
              Prepared For
            </p>
            <p className="font-bold text-sm sm:text-base text-slate-900">
              {quotation.toName || "Valued Client"}
            </p>
            {quotation.toEmail && (
              <p className="text-xs text-slate-600 flex items-center gap-1.5 mt-2">
                <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{quotation.toEmail}</span>
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════
          CONTENT ZONE: ITEMS TABLE
      ════════════════════════════════════════ */}
      <div className="relative z-10 my-4 flex-1">
        <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
          <table className="w-full text-xs sm:text-sm">
            <thead className="bg-[#262559] text-white">
              <tr>
                <th className="text-left py-2.5 px-3.5 font-semibold text-[11px] sm:text-xs tracking-wider uppercase">
                  Date
                </th>
                <th className="text-center py-2.5 px-2 font-semibold text-[11px] sm:text-xs tracking-wider uppercase w-16 sm:w-20">
                  Days
                </th>
                <th className="text-left py-2.5 px-3 font-semibold text-[11px] sm:text-xs tracking-wider uppercase">
                  Pickup Point
                </th>
                <th className="text-left py-2.5 px-3 font-semibold text-[11px] sm:text-xs tracking-wider uppercase">
                  Dropoff / Return
                </th>
                <th className="text-right py-2.5 px-3.5 font-semibold text-[11px] sm:text-xs tracking-wider uppercase w-28 sm:w-32">
                  Amount ({currency})
                </th>
              </tr>
            </thead>
            <tbody>
              {quotation.items.map((item, idx) => (
                <tr
                  key={item.id}
                  className={`border-t border-slate-100 ${
                    idx % 2 === 1 ? "bg-slate-50/50" : "bg-white"
                  }`}
                >
                  <td className="py-2.5 px-3.5 whitespace-nowrap text-slate-700">
                    {item.date ? formatDate(item.date) : "—"}
                  </td>
                  <td className="py-2.5 px-2 text-center text-slate-600 font-mono">
                    {item.numberOfDays === ""
                      ? 1
                      : Number(item.numberOfDays) || 1}
                  </td>
                  <td className="py-2.5 px-3 font-medium text-slate-800">
                    {item.pickupPaid || "—"}
                  </td>
                  <td className="py-2.5 px-3 text-slate-700">
                    {item.dropoffReturnTrip || "—"}
                  </td>
                  <td className="py-2.5 px-3.5 text-right font-bold text-slate-900 font-mono">
                    {Number(item.amount).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals & Notes Row */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 mt-4 items-start">
          <div className="sm:col-span-7 bg-slate-50/80 border border-slate-200/80 rounded-xl p-3.5 text-xs">
            <h4 className="font-bold text-[10px] uppercase tracking-wider text-slate-500 mb-2">
              Payment &amp; Booking Information
            </h4>
            <div className="space-y-1.5 text-slate-700">
              <p>
                <span className="font-semibold text-slate-800">
                  Bank Transfer:
                </span>{" "}
                KCB Bank • Acc:{" "}
                <strong className="font-mono text-slate-900">1350132330</strong>
              </p>
              <p className="text-[10px] text-slate-500">
                Acc Name: Ubuntu Logistics &amp; Transport
              </p>
              <div className="pt-1.5 border-t border-slate-200/80">
                <p>
                  <span className="font-semibold text-slate-800">
                    M-PESA Paybill:
                  </span>{" "}
                  Business:{" "}
                  <strong className="font-mono text-slate-900">522533</strong> •
                  Acc:{" "}
                  <strong className="font-mono text-slate-900">8077526</strong>
                </p>
              </div>
            </div>
          </div>

          <div className="sm:col-span-5 flex justify-end">
            <div className="w-full bg-slate-50/90 border border-slate-200 rounded-xl p-3.5 text-xs space-y-2">
              <div className="flex justify-between font-black text-sm sm:text-base text-[#262559]">
                <span>Quotation Total</span>
                <span className="font-mono">
                  {currency}{" "}
                  {Number(quotation.total).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════
          FOOTER ZONE: TERMS & OFFICIAL STAMP
      ════════════════════════════════════════ */}
      <div className="relative z-10 border-t border-slate-200/90 pt-3 mt-4">
        <div>
          <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            Terms &amp; Conditions
          </h3>
          {quotation.terms ? (
            <p className="text-[9px] text-slate-500 leading-tight whitespace-pre-line">
              {quotation.terms}
            </p>
          ) : (
            <ul className="list-disc pl-3.5 space-y-0.5 text-[9px] text-slate-500 leading-tight">
              <li>This quotation is valid for 14 days from the date of issue.</li>
              <li>Prices are subject to change without prior notice.</li>
              <li>Payment terms: 50% advance, 50% upon completion.</li>
              <li>Accepted payments: Cash, Cheque, Bank Transfer, M-PESA.</li>
            </ul>
          )}
        </div>

        {/* Stamp & Authorized Signatory Row */}
        <div className="flex justify-between items-end mt-3 pt-2">
          {/* Official Stamp with Inside Red Verification Text */}
          <div className="relative w-28 sm:w-32 aspect-square flex items-center justify-center select-none">
            <img
              src="/stamp-ubuntu.webp"
              alt="Official Stamp"
              className="w-full h-full object-contain pointer-events-none"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none px-2 -rotate-2">
              <span className="text-red-600 font-extrabold text-[8.5px] sm:text-[10px] tracking-wider uppercase leading-none font-sans">
                --Verified Document
              </span>
              <span className="text-red-600 font-mono font-bold text-[8px] sm:text-[9.5px] tracking-tight leading-none mt-1">
                {formatDate(quotation.date) || "Oct 5, 2026"} --
              </span>
            </div>
          </div>

          <div className="text-center w-44 sm:w-52">
            <div className="h-9 flex items-end justify-center mb-1">
              <img
                src="/signature.webp"
                alt="Signature"
                className="h-8 object-contain"
              />
            </div>
            <div className="border-t border-slate-400 pt-1">
              <p className="text-[10px] sm:text-[11px] font-bold text-slate-800 leading-none">
                Authorized Signatory
              </p>
              <p className="text-[9px] text-slate-500 mt-0.5">
                Ubuntu Logistics &amp; Transport
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Decorative Stripe */}
        <div className="h-1 w-full bg-[#262559] rounded-full mt-3" />
      </div>
    </div>
  );
}

interface QuotationPreviewProps {
  onBack: () => void;
  onDownloadComplete?: () => void;
}

export default function QuotationPreview({
  onBack,
  onDownloadComplete,
}: QuotationPreviewProps) {
  const { quotation } = useQuotation();
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownloadPDF = async () => {
    const toastId = "quotation-pdf-download";
    setIsGenerating(true);
    toast.loading(
      `Generating PDF for Quotation #${quotation.quotationNumber}...`,
      { id: toastId }
    );

    try {
      await saveQuotationToHistory(quotation);
      await generateQuotationPDF(
        quotation,
        `quotation-${quotation.quotationNumber}`
      );
      toast.success(
        `Quotation #${quotation.quotationNumber} PDF downloaded successfully!`,
        { id: toastId }
      );
      onDownloadComplete?.();
    } catch (err) {
      console.error("PDF generation failed:", err);
      toast.error("Failed to generate and download quotation PDF.", {
        id: toastId,
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100/80 px-4 py-8 sm:px-6 lg:px-12">
      <div className="max-w-4xl mx-auto">
        {/* Page controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Quotation Preview
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Review formatting and layout before downloading official PDF
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Button
              variant="outline"
              onClick={onBack}
              className="w-full sm:w-auto border-slate-300 hover:bg-slate-50"
            >
              Back
            </Button>
            <Button
              onClick={handleDownloadPDF}
              disabled={isGenerating}
              className="w-full sm:w-auto bg-[#262559] hover:bg-[#1f1e47] text-white shadow-sm"
            >
              {isGenerating ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Download className="w-4 h-4 mr-2" />
              )}
              {isGenerating ? "Generating PDF…" : "Download PDF (<200KB)"}
            </Button>
          </div>
        </div>

        {/* ─── Paper Preview Frame with Shadow ─── */}
        <div className="bg-white shadow-2xl rounded-2xl border border-slate-200/80 overflow-hidden mb-12">
          {/* Printable / Capturable A4 Document with Generous Padding */}
          <QuotationDocument quotation={quotation} />
        </div>
      </div>
    </div>
  );
}