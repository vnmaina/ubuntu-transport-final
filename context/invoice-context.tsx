"use client";

import React, { createContext, useContext, useState } from "react";
import { InvoiceData, InvoiceItem } from "@/types/invoice";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { formatDateDDMMYY } from "@/utils/document-number";

interface InvoiceContextProps {
  invoice: InvoiceData;
  updateInvoice: (updatedFields: Partial<InvoiceData>) => void;
  addItem: () => void;
  removeItem: (index: number) => void;
  updateItem: <K extends keyof InvoiceItem>(
    index: number,
    field: K,
    value: InvoiceItem[K]
  ) => void;
  saveInvoice: () => Promise<void>;
}

const defaultItem = (): InvoiceItem => ({
  id: crypto.randomUUID(),
  description: "",
  quantity: 1,
  rate: 0,
  numberOfDays: 1,
  amount: 0,
});

const defaultInvoice = (): InvoiceData => {
  const today = new Date().toISOString().split("T")[0];

  return {
    invoiceNumber: `INV-1-${formatDateDDMMYY()}`,
    date: today,
    fromName: "Ubuntu Logistics",
    fromEmail: "info@ubuntulogistics.co.ke",
    toName: "",
    toEmail: "",
    items: [defaultItem()],
    taxRate: 16,
    taxAmount: 0,
    subtotal: 0,
    total: 0,
    currency: "KES",
    notes: "",
    status: "draft",
    numberOfDays: 1,
  };
};

const recalculateTotals = (
  state: InvoiceData
): InvoiceData => {
  const subtotal = state.items.reduce((sum, item) => {
    return sum + (Number(item.amount) || 0);
  }, 0);

  const totalDays = state.items.reduce((sum, item) => {
    const days = item.numberOfDays === "" ? 1 : Number(item.numberOfDays) || 1;
    return sum + days;
  }, 0);

  const taxRate = Number(state.taxRate) || 0;
  const taxAmount = subtotal * (taxRate / 100);
  const total = subtotal + taxAmount;

  return {
    ...state,
    subtotal,
    taxAmount,
    total,
    numberOfDays: totalDays,
  };
};

const InvoiceContext = createContext<
  InvoiceContextProps | undefined
>(undefined);

export function InvoiceProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [invoice, setInvoiceState] = useState<InvoiceData>(() =>
    recalculateTotals(defaultInvoice())
  );
  
  const createInvoice = useMutation(api.invoices.createInvoice);
  const updateInvoiceMutation = useMutation(api.invoices.updateInvoice);

  const updateInvoice = (
    updatedFields: Partial<InvoiceData>
  ) => {
    setInvoiceState((prev) =>
      recalculateTotals({
        ...prev,
        ...updatedFields,
      })
    );
  };

  const addItem = () => {
    setInvoiceState((prev) =>
      recalculateTotals({
        ...prev,
        items: [...prev.items, defaultItem()],
      })
    );
  };

  const removeItem = (index: number) => {
    setInvoiceState((prev) => {
      const items = prev.items.filter(
        (_, itemIndex) => itemIndex !== index
      );

      return recalculateTotals({
        ...prev,
        items: items.length > 0 ? items : [defaultItem()],
      });
    });
  };

  const updateItem = <K extends keyof InvoiceItem>(
    index: number,
    field: K,
    value: InvoiceItem[K]
  ) => {
    setInvoiceState((prev) => {
      const items = prev.items.map((item, itemIndex) => {
        if (itemIndex !== index) {
          return item;
        }

        const updatedItem = {
          ...item,
          [field]: value,
        };

        const quantity =
          Number(updatedItem.quantity) || 0;
        const rate =
          Number(updatedItem.rate) || 0;
        const days =
          updatedItem.numberOfDays === ""
            ? 1
            : Number(updatedItem.numberOfDays) || 1;

        return {
          ...updatedItem,
          amount: quantity * rate * days,
        };
      });

      return recalculateTotals({
        ...prev,
        items,
      });
    });
  };

  const saveInvoice = async () => {
    // Convert items to match Convex schema
    const itemsForConvex = invoice.items.map(item => ({
      id: item.id,
      description: item.description,
      quantity: item.quantity === "" ? 1 : Number(item.quantity),
      rate: item.rate === "" ? 0 : Number(item.rate),
      amount: item.amount,
      numberOfDays: item.numberOfDays === "" ? 1 : Number(item.numberOfDays),
    }));

    const invoiceData = {
      invoiceNumber: invoice.invoiceNumber,
      date: invoice.date,
      dueDate: invoice.dueDate || undefined,
      fromName: invoice.fromName,
      fromEmail: invoice.fromEmail,
      toName: invoice.toName,
      toEmail: invoice.toEmail,
      items: itemsForConvex,
      taxRate: invoice.taxRate === "" ? 0 : Number(invoice.taxRate),
      taxAmount: invoice.taxAmount,
      subtotal: invoice.subtotal,
      total: invoice.total,
      currency: invoice.currency || "KES",
      notes: invoice.notes || undefined,
      status: (invoice.status || "draft") as any,
      numberOfDays: invoice.numberOfDays,
    };

    try {
      if (invoice._id) {
        await updateInvoiceMutation({
          id: invoice._id as any,
          ...invoiceData,
        });
        console.log("Invoice updated in Convex:", invoiceData);
      } else {
        await createInvoice(invoiceData);
        console.log("Invoice saved to Convex:", invoiceData);
      }
    } catch (error) {
      console.error("Failed to save invoice to Convex:", error);
      // Fallback to localStorage
      const history = JSON.parse(localStorage.getItem("ubuntu-documents-history") || "[]");
      const newItem = {
        id: crypto.randomUUID(),
        type: "invoice" as const,
        number: invoice.invoiceNumber,
        date: invoice.date,
        data: invoice,
        timestamp: Date.now(),
      };
      history.unshift(newItem);
      if (history.length > 50) history.pop();
      localStorage.setItem("ubuntu-documents-history", JSON.stringify(history));
    }
  };

  return (
    <InvoiceContext.Provider
      value={{
        invoice,
        updateInvoice,
        addItem,
        removeItem,
        updateItem,
        saveInvoice,
      }}
    >
      {children}
    </InvoiceContext.Provider>
  );
}

export function useInvoice() {
  const context = useContext(InvoiceContext);

  if (!context) {
    throw new Error(
      "useInvoice must be used within an InvoiceProvider"
    );
  }

  return context;
}
