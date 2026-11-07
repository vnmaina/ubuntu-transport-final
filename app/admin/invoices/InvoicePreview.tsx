"use client";

import React, { useState, useEffect } from "react";
import { getOrganization } from "@/app/actions/organization";
import { CorporateDocumentViewer } from "@/components/documents/CorporateDocumentViewer";
import { NormalizedDocument, TemplateStyle } from "@/components/documents/document-types";

interface InvoicePreviewProps {
  invoice?: any;
  clients?: any[];
  templates?: any[];
  open: boolean;
  onClose: () => void;
}

export function InvoicePreview({
  invoice,
  clients = [],
  templates = [],
  open,
  onClose,
}: InvoicePreviewProps) {
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

  if (!invoice || !open) return null;

  // Resolve client data
  const client =
    invoice.client ||
    clients.find((c) => c._id === invoice.clientId) || {
      name: "Valued Client",
    };

  // Resolve template style if linked to a template
  const matchedTemplate = templates.find((t) => t._id === invoice.templateId);
  const defaultStyle: TemplateStyle =
    matchedTemplate?.style === "minimal"
      ? "modern"
      : matchedTemplate?.style === "classic"
      ? "classic"
      : "corporate";

  const normalizedDocument: NormalizedDocument = {
    type: "invoice",
    id: invoice._id,
    documentNumber: invoice.invoiceNumber || "INV-0001",
    date: invoice.invoiceDate || Date.now(),
    dueDate: invoice.dueDate,
    status: invoice.status || "draft",
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
    items: (invoice.items || []).map((item: any, idx: number) => ({
      id: item.id || String(idx),
      serviceId: item.serviceId,
      description: item.description || "Service Item",
      quantity: Number(item.quantity) || 1,
      unitPrice: item.unitPrice || "0.00",
      total: item.total || "0.00",
    })),
    subtotal: invoice.subtotal || "0.00",
    taxRate: invoice.taxRate,
    taxAmount: invoice.taxAmount,
    discountAmount: invoice.discountAmount,
    total: invoice.total || "0.00",
    currency: invoice.currency || "KES",
    paidAmount: invoice.paidAmount,
    balanceDue: invoice.balanceDue,
    terms: invoice.terms,
    notes: invoice.notes,
  };

  return (
    <CorporateDocumentViewer
      document={normalizedDocument}
      organization={organization}
      open={open}
      onClose={onClose}
      defaultStyle={defaultStyle}
    />
  );
}
