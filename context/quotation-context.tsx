"use client";

import React, { createContext, useContext, useState } from "react";
import { QuotationData, QuotationItem } from "@/types/quotation";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { formatDateDDMMYY } from "@/utils/document-number";

interface QuotationContextProps {
  quotation: QuotationData;
  updateQuotation: (updatedFields: Partial<QuotationData>) => void;
  addItem: () => void;
  removeItem: (index: number) => void;
  updateItem: <K extends keyof QuotationItem>(
    index: number,
    field: K,
    value: QuotationItem[K]
  ) => void;
  saveQuotation: () => Promise<void>;
}

const defaultItem = (): QuotationItem => {
  const today = new Date().toISOString().split("T")[0];

  return {
    id: crypto.randomUUID(),
    date: today,
    pickupPaid: "",
    dropoffReturnTrip: "",   
    numberOfDays: 1,
    amount: 0,
    status: "draft",
  };
};

const defaultQuotation = (): QuotationData => {
  const today = new Date().toISOString().split("T")[0];

  return {
    quotationNumber: `QTN-1-${formatDateDDMMYY()}`,
    date: today,
    fromName: "Ubuntu Logistics",
    fromEmail: "info@ubuntulogistics.co.ke",
    toName: "",
    toEmail: "",
    items: [defaultItem()],
    total: 0,
    currency: "KES",
    notes: "",
    status: "draft",
    numberOfDays: 0,
  };
};

const recalculateTotals = (
  state: QuotationData
): QuotationData => {
  const total = state.items.reduce((sum, item) => {
    const amount = Number(item.amount) || 0;
    return sum + amount;
  }, 0);

  return {
    ...state,
    total,
  };
};

const QuotationContext = createContext<
  QuotationContextProps | undefined
>(undefined);

export function QuotationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [quotation, setQuotationState] = useState<QuotationData>(() =>
    recalculateTotals(defaultQuotation())
  );
  
  const createQuotation = useMutation(api.quotations.createQuotation);
  const updateQuotationMutation = useMutation(api.quotations.updateQuotation);

  const updateQuotation = (
    updatedFields: Partial<QuotationData>
  ) => {
    setQuotationState((prev) =>
      recalculateTotals({
        ...prev,
        ...updatedFields,
      })
    );
  };

  const addItem = () => {
    setQuotationState((prev) =>
      recalculateTotals({
        ...prev,
        items: [...prev.items, defaultItem()],
      })
    );
  };

  const removeItem = (index: number) => {
    setQuotationState((prev) => {
      const items = prev.items.filter(
        (_, itemIndex) => itemIndex !== index
      );

      return recalculateTotals({
        ...prev,
        items: items.length > 0 ? items : [defaultItem()],
      });
    });
  };

  const updateItem = <K extends keyof QuotationItem>(
    index: number,
    field: K,
    value: QuotationItem[K]
  ) => {
    setQuotationState((prev) => {
      const items = prev.items.map((item, itemIndex) =>
        itemIndex === index
          ? {
              ...item,
              [field]: value,
            }
          : item
      );

      return recalculateTotals({
        ...prev,
        items,
      });
    });
  };

  const saveQuotation = async () => {
    // Convert items to match Convex schema
    const itemsForConvex = quotation.items.map(item => ({
      id: item.id,
      date: item.date,
      pickupPaid: item.pickupPaid,
      dropoffReturnTrip: item.dropoffReturnTrip,
      amount: item.amount === "" ? 0 : Number(item.amount),
      numberOfDays: item.numberOfDays === "" ? 1 : Number(item.numberOfDays),
      status: item.status,
    }));

    const quotationData = {
      quotationNumber: quotation.quotationNumber,
      date: quotation.date,
      dueDate: quotation.dueDate || undefined,
      fromName: quotation.fromName,
      fromEmail: quotation.fromEmail,
      toName: quotation.toName,
      toEmail: quotation.toEmail,
      items: itemsForConvex,
      total: quotation.total,
      currency: quotation.currency || "KES",
      notes: quotation.notes || undefined,
      status: (quotation.status || "draft") as any,
      numberOfDays: quotation.numberOfDays,
    };

    try {
      if (quotation._id) {
        await updateQuotationMutation({
          id: quotation._id as any,
          ...quotationData,
        });
        console.log("Quotation updated in Convex:", quotationData);
      } else {
        await createQuotation(quotationData);
        console.log("Quotation saved to Convex:", quotationData);
      }
    } catch (error) {
      console.error("Failed to save quotation to Convex:", error);
      // Fallback to localStorage
      const history = JSON.parse(localStorage.getItem("ubuntu-documents-history") || "[]");
      const newItem = {
        id: crypto.randomUUID(),
        type: "quotation" as const,
        number: quotation.quotationNumber,
        date: quotation.date,
        data: quotation,
        timestamp: Date.now(),
      };
      history.unshift(newItem);
      if (history.length > 50) history.pop();
      localStorage.setItem("ubuntu-documents-history", JSON.stringify(history));
    }
  };

  return (
    <QuotationContext.Provider
      value={{
        quotation,
        updateQuotation,
        addItem,
        removeItem,
        updateItem,
        saveQuotation,
      }}
    >
      {children}
    </QuotationContext.Provider>
  );
}

export function useQuotation() {
  const context = useContext(QuotationContext);

  if (!context) {
    throw new Error(
      "useQuotation must be used within an QuotationProvider"
    );
  }

  return context;
}
