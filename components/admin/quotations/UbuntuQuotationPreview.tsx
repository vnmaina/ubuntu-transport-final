
"use client";

import { useRef, useState } from "react";
import {
  Download,
  Globe,
  Mail,
  Phone,
  Loader2,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/utils/formatters";
import { exportElementToPdf } from "@/components/documents/pdf-export";
import { toast } from "sonner";

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

  const subtotal = Number(
    quotation.subtotal ??
    (quotation.items || []).reduce(
      (sum: number, item: any) => sum + Number(item.total || 0),
      0
    )
  );

  const taxRate = Number(quotation.taxRate || 0);
  const taxAmount = Number(quotation.taxAmount || 0);
  const discountAmount = Number(quotation.discountAmount || 0);

  const total = Number(
    quotation.total ??
    subtotal + taxAmount - discountAmount
  );

  const quotationDate = quotation.quotationDate
    ? formatDate(quotation.quotationDate)
    : "";

  const validUntil = quotation.validUntil
    ? formatDate(quotation.validUntil)
    : quotation.quotationDate
      ? formatDate(
          new Date(
            new Date(quotation.quotationDate).getTime() +
              14 * 24 * 60 * 60 * 1000
          )
        )
      : "";

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-6 sm:px-6 lg:px-12">
      <div className="mx-auto max-w-4xl">

        {/* Page Controls */}
        <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <h1 className="text-xl font-bold sm:text-2xl">
            Quotation Preview
          </h1>

          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
            <Button
              variant="outline"
              onClick={onBack}
              className="w-full sm:w-auto"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>

            <Button
              onClick={handleDownloadPDF}
              disabled={isGenerating}
              className="w-full sm:w-auto"
            >
              {isGenerating ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Download className="mr-2 h-4 w-4" />
              )}

              {isGenerating ? "Generating…" : "Download PDF"}
            </Button>
          </div>
        </div>

        {/* A4 Document */}
        <div
          ref={previewRef}
          className="relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
          style={{ aspectRatio: "1 / 1.414" }}
        >
          {/* Watermark */}
          <img
            src="/ubuntu.webp"
            alt="Ubuntu Logistics watermark"
            className="pointer-events-none absolute inset-0 z-0 h-full w-full object-contain opacity-[0.05]"
          />

          {/* Top Accent */}
          <div className="h-2 shrink-0 bg-[#1a1a2e]" />

          {/* HEADER */}
          <div
            className="relative z-10 flex flex-col justify-between px-6 sm:px-10"
            style={{ height: "20%" }}
          >
            {/* Logo and Quotation Details */}
            <div className="flex flex-row items-start justify-between gap-4 pt-4">
              <img
                src={organization?.logo || "/ubuntu.webp"}
                alt="Ubuntu Logistics"
                className="h-auto w-24 object-contain"
              />

              <div className="text-right">
                <h2 className="text-2xl font-bold tracking-wide text-[#1a1a2e] sm:text-3xl">
                  QUOTATION
                </h2>

                <p className="text-xs text-gray-500 sm:text-sm">
                  #{quotation.quotationNumber}
                </p>

                <p className="text-xs text-gray-400">
                  {quotationDate}
                </p>

                {validUntil && (
                  <p className="mt-0.5 text-xs text-gray-400">
                    Valid Until: {validUntil}
                  </p>
                )}
              </div>
            </div>

            <hr className="border-gray-200" />

            {/* FROM / PREPARED FOR */}
            <div className="flex w-full flex-row justify-between gap-4 pb-2">
              <div>
                <p className="mb-0.5 text-[9px] font-bold uppercase tracking-widest text-gray-400 sm:text-xs">
                  From
                </p>

                <p className="text-sm font-semibold sm:text-base">
                  {orgName}
                </p>

                <div className="flex items-center gap-1 text-[9px] text-gray-500 sm:text-xs">
                  <Mail className="h-2.5 w-2.5 shrink-0" />
                  {orgEmail}
                </div>

                {organization?.phone && (
                  <div className="flex items-center gap-1 text-[9px] text-gray-500 sm:text-xs">
                    <Phone className="h-2.5 w-2.5 shrink-0" />
                    {organization.phone}
                  </div>
                )}

                {organization?.website && (
                  <div className="flex items-center gap-1 text-[9px] text-gray-500 sm:text-xs">
                    <Globe className="h-2.5 w-2.5 shrink-0" />
                    {organization.website}
                  </div>
                )}
              </div>

              <div className="text-right">
                <p className="mb-0.5 text-[9px] font-bold uppercase tracking-widest text-gray-400 sm:text-xs">
                  Prepared For
                </p>

                <p className="text-sm font-semibold sm:text-base">
                  {client.name || "—"}
                </p>

                {client.companyName && (
                  <p className="text-[9px] text-gray-500 sm:text-xs">
                    {client.companyName}
                  </p>
                )}

                {client.email && (
                  <p className="text-[9px] text-gray-500 sm:text-xs">
                    {client.email}
                  </p>
                )}

                {client.phone && (
                  <p className="text-[9px] text-gray-500 sm:text-xs">
                    {client.phone}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* CONTENT */}
          <div
            className="relative z-10 flex flex-col overflow-hidden px-6 sm:px-10"
            style={{ height: "72%" }}
          >
            {/* Items Table */}
            <div className="mt-1 mb-3 overflow-hidden rounded-lg border">
              <table className="w-full text-[10px] sm:text-xs">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-3 py-2 text-left font-semibold text-gray-600">
                      Description
                    </th>

                    <th className="px-3 py-2 text-center font-semibold text-gray-600">
                      Qty
                    </th>

                    <th className="px-3 py-2 text-right font-semibold text-gray-600">
                      Rate
                    </th>

                    <th className="px-3 py-2 text-right font-semibold text-gray-600">
                      Amount
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {(quotation.items || []).map((item: any, idx: number) => (
                    <tr
                      key={idx}
                      className={`border-t ${
                        idx % 2 === 1 ? "bg-gray-50/60" : ""
                      }`}
                    >
                      <td className="px-3 py-2">
                        {item.description}
                      </td>

                      <td className="px-3 py-2 text-center">
                        {item.quantity}
                      </td>

                      <td className="px-3 py-2 text-right">
                        {currency} {Number(item.unitPrice || 0).toFixed(2)}
                      </td>

                      <td className="px-3 py-2 text-right font-semibold">
                        {currency} {Number(item.total || 0).toFixed(2)}
                      </td>
                    </tr>
                  ))}

                  {(!quotation.items || quotation.items.length === 0) && (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-3 py-6 text-center text-gray-400"
                      >
                        No quotation items available.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Financial Summary */}
            <div className="flex justify-end">
              <div className="w-full rounded-xl border bg-gray-50 p-3 sm:w-72">

                {/* Subtotal */}
                <div className="mb-1.5 flex justify-between text-[10px] text-gray-500 sm:text-xs">
                  <span>Subtotal</span>
                  <span>
                    {currency} {subtotal.toFixed(2)}
                  </span>
                </div>

                {/* VAT / Tax */}
                {taxAmount > 0 && (
                  <div className="mb-1.5 flex justify-between text-[10px] text-gray-500 sm:text-xs">
                    <span>
                      VAT ({taxRate}%)
                    </span>

                    <span>
                      {currency} {taxAmount.toFixed(2)}
                    </span>
                  </div>
                )}

                {/* Discount */}
                {discountAmount > 0 && (
                  <div className="mb-1.5 flex justify-between text-[10px] text-gray-500 sm:text-xs">
                    <span>Discount</span>

                    <span className="text-emerald-600">
                      -{currency} {discountAmount.toFixed(2)}
                    </span>
                  </div>
                )}

                {/* Total */}
                <div className="flex justify-between border-t pt-1.5 text-xs font-bold sm:text-sm">
                  <span>Total</span>

                  <span className="text-[#1a1a2e]">
                    {currency} {total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Spacer */}
            <div className="flex-1" />

            {/* FOOTER */}
            <div className="border-t border-gray-200 pt-2 pb-1">

              {/* Terms and Conditions */}
              <h3 className="mb-1 text-[9px] font-bold uppercase tracking-wider text-gray-600 sm:text-[10px]">
                Terms &amp; Conditions
              </h3>

              {quotation.terms ? (
                <p className="whitespace-pre-line text-[8px] text-gray-500 sm:text-[9px]">
                  {quotation.terms}
                </p>
              ) : (
                <ul className="list-disc space-y-0.5 pl-3 text-[8px] text-gray-500 sm:text-[9px]">
                  <li>
                    This quotation is valid for 14 days from the date of issue.
                  </li>

                  <li>
                    Prices are subject to change without prior notice.
                  </li>

                  <li>
                    A 50% deposit is required to confirm the booking.
                  </li>

                  <li>
                    Payments: Cash, Bank Transfer, M-PESA. KCB Bank:{" "}
                    <strong>1350132330</strong> (Tai Ubuntu Logistics Ltd) |
                    M-PESA Paybill: <strong>522533</strong>, Acc:{" "}
                    <strong>8077526</strong>.
                  </li>
                </ul>
              )}

              {/* Stamp and Logo */}
              <div className="mt-2 flex items-center justify-between">
                <div className="relative w-16 sm:w-20">
                  <img
                    src="/stamp.webp"
                    alt="Official stamp"
                    className="w-full object-contain"
                  />

                  <p className="absolute inset-0 flex items-center justify-center px-1 text-center text-[6px] font-bold leading-tight text-red-500 sm:text-[8px]">
                    {quotationDate}
                  </p>
                </div>

                <img
                  src={organization?.logo || "/ubuntu.webp"}
                  alt="Ubuntu Logistics"
                  className="h-10 object-contain sm:h-14"
                />
              </div>
            </div>
          </div>

          {/* Bottom Accent */}
          <div className="h-1.5 shrink-0 bg-[#1a1a2e]" />
        </div>
      </div>
    </div>
  );
}
