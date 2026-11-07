"use client";

import React, { useState, useEffect } from "react";
import { getOrganization } from "@/app/actions/organization";
import { CorporateDocumentViewer } from "@/components/documents/CorporateDocumentViewer";
import { NormalizedDocument } from "@/components/documents/document-types";

interface QuotationPreviewProps {
  quotation?: any;
  clients?: any[];
  open: boolean;
  onClose: () => void;
}

export function QuotationPreview({
  quotation,
  clients = [],
  open,
  onClose,
}: QuotationPreviewProps) {
  const [organization, setOrganization] = useState<any>(null);

  useEffect(() => {
    async function fetchOrg() {
      try {
        const org = await getOrganization();
        setOrganization(org);
      } catch (error) {
        console.error("Failed to fetch organization:", error);
      }
    }
    if (open) {
      fetchOrg();
    }
  }, [open]);

  if (!quotation || !open) return null;

  // Resolve client data
  const client =
    quotation.client ||
    clients.find((c) => c._id === quotation.clientId) || {
      name: "Valued Client",
    };

  const normalizedDocument: NormalizedDocument = {
    type: "quotation",
    id: quotation._id,
    documentNumber: quotation.quotationNumber || "QTN-0001",
    date: quotation.quotationDate || Date.now(),
    validUntil: quotation.validUntil,
    status: quotation.status || "draft",
    client: {
      _id: client._id,
      name: client.name || "Client Name",
      companyName: client.companyName,
      email: client.email,
      phone: client.phone,
      address: client.address,
      city: client.city,
      state: client.state,
      country: client.country,
      postalCode: client.postalCode,
      taxId: client.taxId,
    },
    items: (quotation.items || []).map((item: any, idx: number) => ({
      id: item.id || String(idx),
      serviceId: item.serviceId,
      description: item.description || "Quoted Service / Item",
      quantity: Number(item.quantity) || 1,
      unitPrice: item.unitPrice || "0.00",
      total: item.total || "0.00",
    })),
    subtotal: quotation.subtotal || "0.00",
    taxRate: quotation.taxRate,
    taxAmount: quotation.taxAmount,
    discountAmount: quotation.discountAmount,
    total: quotation.total || "0.00",
    currency: quotation.currency || "KES",
    terms: quotation.terms || "This quotation is valid for 14 days from the date of issue. Prices are subject to change without prior notice. Payment terms: 50% advance, 50% upon completion.",
    notes: quotation.notes,
  };

  return (
    <CorporateDocumentViewer
      document={normalizedDocument}
      organization={organization}
      open={open}
      onClose={onClose}
      defaultStyle="corporate"
    />
  );
}
