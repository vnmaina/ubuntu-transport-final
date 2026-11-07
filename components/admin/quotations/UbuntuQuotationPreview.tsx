"use client";

import { useState } from "react";
import { Download, Globe, Mail, Phone, Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/utils/formatters";
import { exportElementToPdf } from "@/components/documents/pdf-export";
import { toast } from "sonner";
import { useRef } from "react";

interface UbuntuQuotationPreviewProps {
  quotation?: any;
  organization?: any;
  onBack: () => void;
  onDownloadComplete?: () => void;
}

export function UbuntuQuotationPreview({
  quotation,
  organization,
  onBack,
  onDownloadComplete,
}: UbuntuQuotationPreviewProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  const handleDownloadPDF = async () => {
    if (!previewRef.current) return;
    
    const toastId = "quotation-pdf-download";
    setIsGenerating(true);
    toast.loading(
      `Generating PDF for Quotation #${quotation?.quotationNumber}...`,
      { id: toastId }
    );

    try {
      const filename = `quotation-${quotation?.quotationNumber}.pdf`;
      await exportElementToPdf(previewRef.current, filename);
      toast.success(
        `Quotation #${quotation?.quotationNumber} PDF downloaded successfully!`,
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

  if (!quotation) return null;

  const orgName = organization?.name || "Ubuntu Logistics";
  const orgEmail = organization?.email || "info@ubuntulogistics.co.ke";
  const client = quotation.client || {};
  const currency = quotation.currency || "KES";

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-6 sm:px-6 lg:px-12">
      <div className="max-w-4xl mx-auto">

        {/* Page controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h1 className="text-xl sm:text-2xl font-bold">Quotation Preview</h1>

          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Button variant="outline" onClick={onBack} className="w-full sm:w-auto">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <Button
              onClick={handleDownloadPDF}
              disabled={isGenerating}
              className="w-full sm:w-auto"
            >
              {isGenerating ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Download className="w-4 h-4 mr-2" />
              )}
              {isGenerating ? "Generating…" : "Download PDF"}
            </Button>
          </div>
        </div>

        {/* ─── A4-ratio paper card ─── */}
        <div
          ref={previewRef}
          className="relative bg-white shadow-2xl rounded-2xl overflow-hidden flex flex-col"
          style={{ aspectRatio: "1 / 1.414" }}
        >
          {/* Watermark */}
          <img
            src="/ubuntu.webp"
            alt="watermark"
            className="absolute inset-0 w-full h-full object-contain opacity-5 pointer-events-none z-0"
          />

          {/* TOP ACCENT BAR */}
          <div className="h-2 bg-[#1a1a2e] flex-shrink-0" />

          {/* ════════════════════════════════════════
              HEADER ZONE  —  30% of card height
          ════════════════════════════════════════ */}
          <div
            className="relative z-10 flex flex-col justify-between px-6 sm:px-10"
            style={{ height: "28%" }}
          >
            {/* Logo + Title row */}
            <div className="flex flex-row justify-between items-start pt-4 gap-4">
              <img
                src={organization?.logo || "/ubuntu.webp"}
                alt="logo"
                className="h-12 sm:h-16 lg:h-20 w-auto object-contain"
              />
              <div className="text-right">
                <h2 className="text-2xl sm:text-3xl font-bold text-[#1a1a2e] tracking-wide">
                  QUOTATION
                </h2>
                <p className="text-gray-500 text-xs sm:text-sm">
                  #{quotation.quotationNumber}
                </p>
                <p className="text-gray-400 text-xs">
                  {quotation.quotationDate ? formatDate(quotation.quotationDate) : ""}
                </p>
                {quotation.validUntil ? (
                  <p className="text-gray-400 text-xs">
                    Valid until: {formatDate(quotation.validUntil)}
                  </p>
                ) : quotation.quotationDate && (
                  <p className="text-gray-400 text-xs">
                    Valid until: {formatDate(new Date(new Date(quotation.quotationDate).getTime() + 14 * 24 * 60 * 60 * 1000))}
                  </p>
                )}
              </div>
            </div>

            <hr className="border-gray-200" />

            {/* FROM / PREPARED FOR */}
            <div className="flex flex-row justify-between gap-4 pb-2 w-full">
              <div>
                <p className="text-[9px] sm:text-xs font-bold text-gray-400 uppercase tracking-widest mb-0.5">
                  From
                </p>
                <p className="font-semibold text-sm sm:text-base">
                  {orgName}
                </p>
                <div className="flex items-center gap-1 text-[9px] sm:text-xs text-gray-500">
                  <Mail className="w-2.5 h-2.5" />
                  {orgEmail}
                </div>
                {organization?.phone && (
                  <div className="flex items-center gap-1 text-[9px] sm:text-xs text-gray-500">
                    <Phone className="w-2.5 h-2.5" />
                    {organization.phone}
                  </div>
                )}
                {organization?.website && (
                  <div className="flex items-center gap-1 text-[9px] sm:text-xs text-gray-500">
                    <Globe className="w-2.5 h-2.5" />
                    {organization.website}
                  </div>
                )}
              </div>

              <div className="text-right">
                <p className="text-[9px] sm:text-xs font-bold text-gray-400 uppercase tracking-widest mb-0.5">
                  Prepared For
                </p>
                <p className="font-semibold text-sm sm:text-base">
                  {client.name || "—"}
                </p>
                {client.companyName && (
                  <p className="text-[9px] sm:text-xs text-gray-500">
                    {client.companyName}
                  </p>
                )}
                <p className="text-[9px] sm:text-xs text-gray-500">
                  {client.email}
                </p>
              </div>
            </div>
          </div>

          {/* ════════════════════════════════════════
              CONTENT ZONE  —  70% of card height
          ════════════════════════════════════════ */}
          <div
            className="relative z-10 flex flex-col px-6 sm:px-10 overflow-hidden"
            style={{ height: "72%" }}
          >
            {/* Items table */}
            <div className="rounded-lg border overflow-hidden mb-3 mt-1">
              <table className="w-full text-[10px] sm:text-xs">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="text-left py-2 px-3 font-semibold text-gray-600">
                      Description
                    </th>
                    <th className="text-center py-2 px-3 font-semibold text-gray-600">
                      Qty
                    </th>
                    <th className="text-right py-2 px-3 font-semibold text-gray-600">
                      Rate
                    </th>
                    <th className="text-right py-2 px-3 font-semibold text-gray-600">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {(quotation.items || []).map((item: any, idx: number) => (
                    <tr
                      key={idx}
                      className={`border-t ${idx % 2 === 1 ? "bg-gray-50/60" : ""}`}
                    >
                      <td className="py-2 px-3">{item.description}</td>
                      <td className="py-2 px-3 text-center">{item.quantity}</td>
                      <td className="py-2 px-3 text-right">
                        {currency} {Number(item.unitPrice).toFixed(2)}
                      </td>
                      <td className="py-2 px-3 text-right font-semibold">
                        {currency} {Number(item.total).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Total box */}
            <div className="flex justify-end">
              <div className="w-full sm:w-60 bg-gray-50 border rounded-xl p-3">
                <div className="flex justify-between font-bold text-xs sm:text-sm">
                  <span>Total</span>
                  <span>{currency} {Number(quotation.total).toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Spacer */}
            <div className="flex-1" />

            {/* ── FOOTER ── */}
            <div className="border-t border-gray-200 pt-2 pb-1">
              <h3 className="text-[9px] sm:text-[10px] font-bold text-gray-600 uppercase tracking-wider mb-1">
                Terms &amp; Conditions
              </h3>
              {quotation.terms ? (
                <p className="text-[8px] sm:text-[9px] text-gray-500 whitespace-pre-line">
                  {quotation.terms}
                </p>
              ) : (
                <ul className="list-disc pl-3 space-y-0.5 text-[8px] sm:text-[9px] text-gray-500">
                  <li>This quotation is valid for 14 days from the date of issue.</li>
                  <li>Prices are subject to change without prior notice.</li>
                  <li>Payment terms: 50% advance, 50% upon completion.</li>
                </ul>
              )}

              <div className="flex justify-between items-center mt-2">
                <div className="relative w-16 sm:w-20">
                  <img
                    src="/stamp.webp"
                    alt="stamp"
                    className="w-full object-contain"
                  />
                  <p className="absolute inset-0 flex items-center justify-center text-[6px] sm:text-[8px] font-bold text-red-500 text-center leading-tight px-1">
                    {quotation.quotationDate ? formatDate(quotation.quotationDate) : ""}
                  </p>
                </div>
                <img
                  src={organization?.logo || "/ubuntu.webp"}
                  alt="footer logo"
                  className="h-10 sm:h-14 object-contain"
                />
              </div>
            </div>
          </div>

          {/* BOTTOM ACCENT BAR */}
          <div className="h-1.5 bg-[#1a1a2e] flex-shrink-0" />
        </div>
      </div>
    </div>
  );
}
