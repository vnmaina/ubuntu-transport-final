
"use client";

import { MapPin, Mail, Phone, Globe } from "lucide-react";
import { formatDate } from "@/utils/formatters";
import { QuotationData } from "@/types/quotation";

interface QuotationDocumentProps {
  quotation: QuotationData;
  id?: string;
}

export function QuotationDocument({
  quotation,
  id = "quotation-document",
}: QuotationDocumentProps) {
  const currency = quotation.currency || "KES";

  const formatMoney = (value: number) =>
    Number(value || 0).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  // Financial calculations
  const itemsSubtotal = (quotation.items || []).reduce(
    (sum, item) => sum + Number(item.amount || 0),
    0
  );

  const subtotal = Number(quotation.subtotal ?? itemsSubtotal);
  const taxRate = Number(quotation.taxRate || 0);
  const taxAmount = Number(quotation.taxAmount || 0);
  const discountAmount = Number(quotation.discountAmount || 0);

  const total = Number(
    quotation.total ?? subtotal + taxAmount - discountAmount
  );

  return (
    <div
      id={id}
      className="relative flex flex-col justify-between bg-white p-8 text-slate-800 sm:p-12 md:p-14"
      style={{ minHeight: "1120px", aspectRatio: "1 / 1.414" }}
    >
      {/* Watermark */}
      <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center opacity-[0.035]">
        <img
          src="/ubuntu.webp"
          alt="watermark"
          className="h-96 w-96 object-contain"
        />
      </div>

      {/* HEADER */}
      <div className="relative z-10">
        <div className="mb-6 h-1.5 w-full rounded-full bg-[#262559]" />

        {/* Logo and Quotation Details */}
        <div className="flex flex-row items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src="/ubuntu.webp"
              alt="Ubuntu Logistics & Transport"
              className="h-20 w-auto shrink-0 object-contain sm:h-24"
            />

            <div>
              <h2 className="text-lg font-black leading-tight tracking-tight text-[#262559] sm:text-xl">
                Ubuntu Logistics &amp; Transport
              </h2>

              <p className="mt-0.5 text-xs font-medium text-slate-500 sm:text-sm">
                Reliable &amp; Efficient Transport Logistics
              </p>
            </div>
          </div>

          <div className="text-right">
            <h1 className="text-2xl font-black uppercase tracking-wider text-[#262559] sm:text-3xl">
              QUOTATION
            </h1>

            <div className="mt-1 flex items-center justify-end">
              <span className="rounded border border-[#262559]/20 bg-[#262559]/10 px-2.5 py-0.5 font-mono text-xs font-bold text-[#262559] sm:text-sm">
                #{quotation.quotationNumber}
              </span>
            </div>

            <div className="mt-2 space-y-0.5 text-right text-xs text-slate-600">
              <p>
                <span className="mr-1.5 text-[10px] font-bold uppercase text-slate-400">
                  Date:
                </span>

                <span className="font-semibold text-slate-800">
                  {formatDate(quotation.date)}
                </span>
              </p>
            </div>
          </div>
        </div>

        <hr className="my-5 border-slate-200/90" />

        {/* FROM / PREPARED FOR */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-slate-200/70 bg-slate-50/80 p-3.5 sm:p-4">
            <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">
              From
            </p>

            <p className="text-sm font-bold text-slate-900 sm:text-base">
              {quotation.fromName || "Ubuntu Logistics & Transport"}
            </p>

            <div className="mt-2 space-y-1 text-xs text-slate-600">
              <div className="flex items-start gap-1.5">
                <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-400" />
                <span>
                  North Airport Road, Embakasi, Nairobi, Kenya
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                <span>info@ubuntulogistics.co.ke</span>
              </div>

              <div className="flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                <span>+254 728 798589</span>
              </div>

              <div className="flex items-center gap-1.5">
                <Globe className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                <span>www.ubuntulogistics.co.ke</span>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200/70 bg-slate-50/80 p-3.5 sm:p-4">
            <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Prepared For
            </p>

            <p className="text-sm font-bold text-slate-900 sm:text-base">
              {quotation.toName || "Valued Client"}
            </p>

            {quotation.toEmail && (
              <p className="mt-2 flex items-center gap-1.5 text-xs text-slate-600">
                <Mail className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                <span>{quotation.toEmail}</span>
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ITEMS TABLE */}
      <div className="relative z-10 my-4 flex-1">
        <div className="overflow-hidden rounded-xl border border-slate-200 shadow-xs">
          <table className="w-full text-xs sm:text-sm">
            <thead className="bg-[#262559] text-white">
              <tr>
                <th className="px-3.5 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider sm:text-xs">
                  Date
                </th>

                <th className="w-16 px-2 py-2.5 text-center text-[11px] font-semibold uppercase tracking-wider sm:w-20 sm:text-xs">
                  Days
                </th>

                <th className="px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider sm:text-xs">
                  Pickup Point
                </th>

                <th className="px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider sm:text-xs">
                  Dropoff / Return
                </th>

                <th className="w-28 px-3.5 py-2.5 text-right text-[11px] font-semibold uppercase tracking-wider sm:w-32 sm:text-xs">
                  Amount ({currency})
                </th>
              </tr>
            </thead>

            <tbody>
              {(quotation.items || []).map((item, idx) => (
                <tr
                  key={item.id || idx}
                  className={`border-t border-slate-100 ${
                    idx % 2 === 1 ? "bg-slate-50/50" : "bg-white"
                  }`}
                >
                  <td className="whitespace-nowrap px-3.5 py-2.5 text-slate-700">
                    {item.date ? formatDate(item.date) : "—"}
                  </td>

                  <td className="px-2 py-2.5 text-center font-mono text-slate-600">
                    {item.numberOfDays === ""
                      ? 1
                      : Number(item.numberOfDays) || 1}
                  </td>

                  <td className="px-3 py-2.5 font-medium text-slate-800">
                    {item.pickupPaid || "—"}
                  </td>

                  <td className="px-3 py-2.5 text-slate-700">
                    {item.dropoffReturnTrip || "—"}
                  </td>

                  <td className="px-3.5 py-2.5 text-right font-mono font-bold text-slate-900">
                    {formatMoney(Number(item.amount || 0))}
                  </td>
                </tr>
              ))}

              {(!quotation.items || quotation.items.length === 0) && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-3 py-8 text-center text-slate-400"
                  >
                    No quotation items available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* TOTALS & PAYMENT INFORMATION */}
        <div className="mt-4 grid grid-cols-1 items-start gap-4 sm:grid-cols-12">

          {/* Payment Information */}
          <div className="rounded-xl border border-slate-200/80 bg-slate-50/80 p-3.5 text-xs sm:col-span-7">
            <h4 className="mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Payment &amp; Booking Information
            </h4>

            <div className="space-y-1.5 text-slate-700">
              <p>
                <span className="font-semibold text-slate-800">
                  Bank Transfer:
                </span>{" "}
                KCB Bank • Acc:{" "}
                <strong className="font-mono text-slate-900">
                  1350132330
                </strong>
              </p>

              <p className="text-[10px] text-slate-500">
                Acc Name: TAI UBUNTU LOGISTICS LTD
              </p>

              <div className="border-t border-slate-200/80 pt-1.5">
                <p>
                  <span className="font-semibold text-slate-800">
                    M-PESA Paybill:
                  </span>{" "}
                  Business:{" "}
                  <strong className="font-mono text-slate-900">
                    522533
                  </strong>{" "}
                  • Acc:{" "}
                  <strong className="font-mono text-slate-900">
                    8077526
                  </strong>
                </p>
              </div>
            </div>
          </div>

          {/* Financial Summary */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/90 p-3.5 text-xs sm:col-span-5">

            {/* Subtotal */}
            <div className="mb-1.5 flex justify-between text-slate-500">
              <span>Subtotal</span>
              <span className="font-mono text-slate-700">
                {currency} {formatMoney(subtotal)}
              </span>
            </div>

            {/* VAT */}
            {taxAmount > 0 && (
              <div className="mb-1.5 flex justify-between text-slate-500">
                <span>VAT ({taxRate}%)</span>

                <span className="font-mono text-slate-700">
                  {currency} {formatMoney(taxAmount)}
                </span>
              </div>
            )}

            {/* Discount */}
            {discountAmount > 0 && (
              <div className="mb-1.5 flex justify-between text-slate-500">
                <span>Discount</span>

                <span className="font-mono text-emerald-600">
                  -{currency} {formatMoney(discountAmount)}
                </span>
              </div>
            )}

            {/* Grand Total */}
            <div className="mt-2 flex justify-between border-t border-slate-200 pt-2 text-sm font-black text-[#262559] sm:text-base">
              <span>Grand Total</span>

              <span className="font-mono">
                {currency} {formatMoney(total)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className="relative z-10 mt-4 border-t border-slate-200/90 pt-3">
        <div>
          <h3 className="mb-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Terms &amp; Conditions
          </h3>

          {quotation.terms ? (
            <p className="whitespace-pre-line text-[9px] leading-tight text-slate-500">
              {quotation.terms}
            </p>
          ) : (
            <ul className="list-disc space-y-0.5 pl-3.5 text-[9px] leading-tight text-slate-500">
              <li>
                This quotation is valid for 14 days from the date of issue.
              </li>

              <li>
                Prices are subject to change without prior notice.
              </li>

              <li>
                Payment terms: 50% advance, 50% upon completion.
              </li>

              <li>
                Accepted payments: Cash, Cheque, Bank Transfer, M-PESA.
              </li>
            </ul>
          )}
        </div>

        {/* Stamp & Signature */}
        <div className="mt-3 flex items-end justify-between pt-2">
          <div className="relative flex aspect-square w-28 select-none items-center justify-center sm:w-32">
            <img
              src="/stamp-ubuntu.webp"
              alt="Official Stamp"
              className="pointer-events-none h-full w-full object-contain"
            />

            <div className="pointer-events-none absolute inset-0 flex -rotate-2 flex-col items-center justify-center px-2 text-center">
              <span className="font-sans text-[8.5px] font-extrabold uppercase leading-none tracking-wider text-red-600 sm:text-[10px]">
                --Verified Document
              </span>

              <span className="mt-1 font-mono text-[8px] font-bold leading-none tracking-tight text-red-600 sm:text-[9.5px]">
                {formatDate(quotation.date) || "Oct 5, 2026"} --
              </span>
            </div>
          </div>

          <div className="w-44 text-center sm:w-52">
            <div className="mb-1 flex h-9 items-end justify-center">
              <img
                src="/signature.webp"
                alt="Authorized Signature"
                className="h-8 object-contain"
              />
            </div>

            <div className="border-t border-slate-400 pt-1">
              <p className="text-[10px] font-bold leading-none text-slate-800 sm:text-[11px]">
                Authorized Signatory
              </p>

              <p className="mt-0.5 text-[9px] text-slate-500">
                Ubuntu Logistics &amp; Transport
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Stripe */}
        <div className="mt-3 h-1 w-full rounded-full bg-[#262559]" />
      </div>
    </div>
  );
}
