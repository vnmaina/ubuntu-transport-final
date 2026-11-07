"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Plus } from "lucide-react";
import { InvoiceRow } from "./columns";
import {
  generateInvoiceNumberAction,
  createInvoiceAction,
  updateInvoiceAction,
} from "@/app/actions/documents";
import { toast } from "sonner";
import { FormWizard } from "@/components/admin/forms/FormWizard";
import { LineItemsInput } from "@/components/admin/forms/LineItemsInput";
import { InlineClientCreator } from "@/components/admin/forms/InlineClientCreator";
import { InvoicePreview } from "./InvoicePreview";
import { UbuntuInvoicePreview } from "@/components/admin/invoices/UbuntuInvoicePreview";
import { getOrganization } from "@/app/actions/organization";
import { CURRENCY_OPTIONS, formatCurrency } from "@/utils/currency";

interface InvoiceFormSheetProps {
  invoice?: InvoiceRow | null;
  clients: any[];
  services: any[];
  quotations: any[];
  templates: any[];
  open: boolean;
  onClose: () => void;
  isCreating?: boolean;
}

interface LineItem {
  serviceId?: string;
  description: string;
  quantity: number;
  unitPrice: string;
  total: string;
  itemDate?: string;
}

export function InvoiceFormSheet({
  invoice,
  clients,
  services,
  quotations,
  templates,
  open,
  onClose,
  isCreating,
}: InvoiceFormSheetProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingNumber, setIsGeneratingNumber] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [showUbuntuPreview, setShowUbuntuPreview] = useState(false);
  const [organization, setOrganization] = useState<any>(null);
  const [localClients, setLocalClients] = useState(clients);
  const [localServices, setLocalServices] = useState(services);
  const [formData, setFormData] = useState({
    invoiceNumber: "" as string,
    clientId: "" as string,
    quotationId: "" as string,
    invoiceDate: new Date().toISOString().split('T')[0],
    dueDate: "",
    status: "draft" as "draft" | "sent" | "paid" | "partially_paid" | "overdue" | "cancelled",
    currency: "KES" as string,
    items: [] as LineItem[],
    taxRate: 0,
    discountAmount: "0",
    notes: "",
    terms: "",
    templateId: "" as string,
    paidAmount: "" as string,
    balanceDue: "" as string,
    paymentType: "" as "MPESA" | "BANK" | "CASH" | "OTHER" | "",
    paymentReference: "" as string,
    paymentDate: "" as string,
  });

  useEffect(() => {
    async function fetchOrg() {
      try {
        const org = await getOrganization();
        setOrganization(org);
      } catch (error) {
        console.error("Failed to fetch organization:", error);
      }
    }
    fetchOrg();
  }, []);

  useEffect(() => {
    if (invoice && !isCreating) {
      setFormData({
        invoiceNumber: invoice.invoiceNumber,
        clientId: invoice.clientId,
        quotationId: invoice.quotationId ?? "",
        invoiceDate: new Date(invoice.invoiceDate).toISOString().split('T')[0],
        dueDate: invoice.dueDate ? new Date(invoice.dueDate).toISOString().split('T')[0] : "",
        status: invoice.status,
        currency: (invoice as any).currency || "KES",
        items: (invoice.items as LineItem[]).map(item => ({
          ...item,
          itemDate: item.itemDate ? new Date(item.itemDate).toISOString().split('T')[0] : undefined,
        })),
        taxRate: invoice.taxRate || 0,
        discountAmount: invoice.discountAmount || "0",
        notes: invoice.notes ?? "",
        terms: invoice.terms ?? "",
        templateId: invoice.templateId ?? "",
        paidAmount: invoice.paidAmount ?? "",
        balanceDue: invoice.balanceDue ?? "",
        paymentType: (invoice.paymentType as any) ?? "",
        paymentReference: invoice.paymentReference ?? "",
        paymentDate: invoice.paymentDate ?? "",
      });
    } else {
      setFormData({
        invoiceNumber: "",
        clientId: "",
        quotationId: "",
        invoiceDate: new Date().toISOString().split('T')[0],
        dueDate: "",
        status: "draft",
        currency: "KES",
        items: [],
        taxRate: 0,
        discountAmount: "0",
        notes: "",
        terms: "",
        templateId: "",
        paidAmount: "",
        balanceDue: "",
        paymentType: "",
        paymentReference: "",
        paymentDate: "",
      });

      if (open && isCreating) {
        generateInvoiceNumberAction().then((result) => {
          if (result.success && result.number) {
            setFormData((prev) => ({ ...prev, invoiceNumber: result.number! }));
          }
        });
      }
    }
    setCurrentStep(0);
    setShowPreview(false);
    setShowUbuntuPreview(false);
    setLocalClients(clients);
    setLocalServices(services);
  }, [invoice, isCreating, open, clients, services]);

  const generateNumber = async () => {
    setIsGeneratingNumber(true);
    try {
      const result = await generateInvoiceNumberAction();
      if (result.success && result.number) {
        setFormData((prev) => ({ ...prev, invoiceNumber: result.number! }));
      }
    } catch (error) {
      toast.error("Failed to generate invoice number");
    } finally {
      setIsGeneratingNumber(false);
    }
  };

  const loadFromQuotation = async (quotationId: string | null) => {
    if (!quotationId) return;
    const quotation = quotations.find(q => q._id === quotationId);
    if (quotation) {
      setFormData({
        ...formData,
        clientId: quotation.clientId,
        currency: (quotation as any).currency || formData.currency || "KES",
        items: quotation.items,
        terms: quotation.terms ?? "",
      });
    }
  };

  const calculateTotals = () => {
    const subtotal = formData.items.reduce((sum, item) => sum + parseFloat(item.total || "0"), 0);
    const taxAmount = (subtotal * (formData.taxRate / 100)).toFixed(2);
    const discount = parseFloat(formData.discountAmount) || 0;
    const total = (subtotal + parseFloat(taxAmount) - discount).toFixed(2);
    return {
      subtotal: subtotal.toFixed(2),
      taxAmount,
      total,
    };
  };

  const handleSubmit = async () => {
    setIsLoading(true);

    try {
      // Validation for partially paid
      if (formData.status === "partially_paid") {
        if (!formData.paidAmount || parseFloat(formData.paidAmount) <= 0) {
          toast.error("Please enter the amount paid for partially paid invoices");
          setIsLoading(false);
          return;
        }
        if (!formData.paymentType) {
          toast.error("Please select the payment type for partially paid invoices");
          setIsLoading(false);
          return;
        }
      }

      const totals = calculateTotals();
      const submitData = {
        ...formData,
        clientId: formData.clientId as any,
        quotationId: formData.quotationId || undefined,
        invoiceDate: new Date(formData.invoiceDate).getTime(),
        dueDate: formData.dueDate ? new Date(formData.dueDate).getTime() : undefined,
        templateId: formData.templateId || undefined,
        items: formData.items.map(item => ({
          ...item,
          itemDate: item.itemDate ? new Date(item.itemDate).getTime() : undefined,
        })),
        ...totals,
        // Only include payment fields if status is paid or partially_paid
        paidAmount: formData.status === "paid"
          ? totals.total // Fully paid - use total amount
          : formData.status === "partially_paid"
          ? formData.paidAmount || "0" // Partially paid - use paidAmount
          : undefined,
        balanceDue: formData.status === "paid"
          ? "0" // Fully paid - no balance
          : formData.status === "partially_paid"
          ? formData.balanceDue || totals.total // Partially paid - use balanceDue or remaining
          : undefined,
        paymentType: (formData.status === "paid" || formData.status === "partially_paid") ? formData.paymentType : undefined,
        paymentReference: (formData.status === "paid" || formData.status === "partially_paid") ? formData.paymentReference : undefined,
        paymentDate: (formData.status === "paid" || formData.status === "partially_paid") ? formData.paymentDate : undefined,
      };

      if (isCreating) {
        const result = await createInvoiceAction(submitData);
        if (result.error) {
          toast.error(result.error);
        } else {
          toast.success("Invoice created successfully");
          onClose();
        }
      } else if (invoice) {
        const result = await updateInvoiceAction(invoice._id, submitData);
        if (result.error) {
          toast.error(result.error);
        } else {
          toast.success("Invoice updated successfully");
          onClose();
        }
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const totals = calculateTotals();

  const canProceedFromStep1 = () => {
    return !!formData.clientId && !!formData.invoiceDate;
  };

  const canProceedFromStep2 = () => {
    return formData.items.length > 0;
  };

  const handleNext = () => {
    if (currentStep === 2) {
      setShowPreview(true);
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleShowUbuntuPreview = () => {
    setShowUbuntuPreview(true);
  };

  const handlePrevious = () => {
    if (showPreview) {
      setShowPreview(false);
    } else if (showUbuntuPreview) {
      setShowUbuntuPreview(false);
    } else {
      setCurrentStep(currentStep - 1);
    }
  };

  const currentStepCanNext = () => {
    if (currentStep === 0) return canProceedFromStep1();
    if (currentStep === 1) return canProceedFromStep2();
    if (currentStep === 2) return true;
    return false;
  };

  const previewInvoice = {
    ...formData,
    ...totals,
    subtotal: totals.subtotal,
    taxAmount: totals.taxAmount,
    total: totals.total,
    client: localClients.find(c => c._id === formData.clientId),
  };

  return (
    <>
      <Sheet open={open} onOpenChange={onClose}>
        <SheetContent side="right" className="overflow-y-auto max-w-[95vw] md:!max-w-[85%] w-[95%] md:!w-[85%] lg:!max-w-[75%] lg:!w-[75%]">
          <SheetHeader className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <SheetTitle>
                  {isCreating ? "Create New Invoice" : "Edit Invoice"}
                </SheetTitle>
                <SheetDescription>
                  {isCreating
                    ? "Create a new invoice for a client."
                    : "Update the invoice details."}
                </SheetDescription>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleShowUbuntuPreview}
                className="hidden md:flex"
              >
                Preview Ubuntu Style
              </Button>
            </div>
          </SheetHeader>

          <FormWizard
            currentStep={currentStep}
            totalSteps={3}
            onPrevious={handlePrevious}
            onNext={handleNext}
            onSubmit={handleSubmit}
            isLastStep={currentStep === 2 && !showPreview}
            canNext={currentStepCanNext()}
            isLoading={isLoading}
          >
            {/* Step 1: Basic Information */}
            {currentStep === 0 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="invoiceNumber" className="text-xs font-medium">Invoice Number *</Label>
                    <div className="flex gap-2">
                      <Input
                        id="invoiceNumber"
                        value={formData.invoiceNumber}
                        onChange={(e) =>
                          setFormData({ ...formData, invoiceNumber: e.target.value })
                        }
                        required
                        className="h-9 text-sm"
                      />
                      {isCreating && (
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={generateNumber}
                          disabled={isGeneratingNumber}
                          className="h-9 w-9 shrink-0"
                        >
                          {isGeneratingNumber ? (
                            <Loader2 className="size-4 animate-spin" />
                          ) : (
                            <Plus className="size-4" />
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status" className="text-xs font-medium">Status</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value: any) =>
                        setFormData({ ...formData, status: value })
                      }
                    >
                      <SelectTrigger className="h-9 text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="sent">Sent</SelectItem>
                        <SelectItem value="paid">Paid</SelectItem>
                        <SelectItem value="partially_paid">Partially Paid</SelectItem>
                        <SelectItem value="overdue">Overdue</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="currency" className="text-xs font-medium">Currency</Label>
                    <Select
                      value={formData.currency || "KES"}
                      onValueChange={(value: any) =>
                        setFormData({ ...formData, currency: value })
                      }
                    >
                      <SelectTrigger className="h-9 text-sm">
                        <SelectValue placeholder="Select Currency" />
                      </SelectTrigger>
                      <SelectContent>
                        {CURRENCY_OPTIONS.map((opt) => (
                          <SelectItem key={opt.code} value={opt.code}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Payment Fields - Show when status is paid or partially_paid */}
                {(formData.status === "paid" || formData.status === "partially_paid") && (
                  <div className="space-y-4 p-4 bg-primary/5 rounded-lg border-2 border-primary/20">
                    <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <span className="text-lg">💰</span>
                      Payment Details
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="paymentType" className="text-xs font-medium">
                          Payment Type {formData.status === "partially_paid" && "*"}
                        </Label>
                        <Select
                          value={formData.paymentType}
                          onValueChange={(value: any) =>
                            setFormData({ ...formData, paymentType: value })
                          }
                        >
                          <SelectTrigger className="h-9 text-sm">
                            <SelectValue placeholder="Select payment type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="MPESA">MPESA</SelectItem>
                            <SelectItem value="BANK">Bank Transfer</SelectItem>
                            <SelectItem value="CASH">Cash</SelectItem>
                            <SelectItem value="OTHER">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="paymentDate" className="text-xs font-medium">Payment Date</Label>
                        <Input
                          id="paymentDate"
                          type="date"
                          value={formData.paymentDate}
                          onChange={(e) => setFormData({ ...formData, paymentDate: e.target.value })}
                          className="h-9 text-sm"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="paidAmount" className="text-xs font-medium">
                          {formData.status === "partially_paid" ? "Amount Paid *" : "Amount Paid"}
                        </Label>
                        <Input
                          id="paidAmount"
                          type="number"
                          step="0.01"
                          value={formData.paidAmount}
                          onChange={(e) => {
                            const paidAmount = e.target.value;
                            // Auto-calculate balance due for partially paid
                            let balanceDue = formData.balanceDue;
                            if (formData.status === "partially_paid" && paidAmount) {
                              const total = parseFloat(totals.total) || 0;
                              const paid = parseFloat(paidAmount) || 0;
                              balanceDue = Math.max(0, total - paid).toFixed(2);
                            }
                            setFormData({ ...formData, paidAmount, balanceDue });
                          }}
                          placeholder="0.00"
                          className="h-9 text-sm"
                          required={formData.status === "partially_paid"}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="balanceDue" className="text-xs font-medium">Balance Due</Label>
                        <Input
                          id="balanceDue"
                          type="number"
                          step="0.01"
                          value={formData.balanceDue}
                          onChange={(e) => setFormData({ ...formData, balanceDue: e.target.value })}
                          placeholder="0.00"
                          className="h-9 text-sm"
                          readOnly={formData.status === "partially_paid"}
                        />
                        {formData.status === "partially_paid" && (
                          <p className="text-xs text-muted-foreground">Auto-calculated from total - amount paid</p>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="paymentReference" className="text-xs font-medium">Payment Reference (Transaction ID)</Label>
                      <Input
                        id="paymentReference"
                        value={formData.paymentReference}
                        onChange={(e) => setFormData({ ...formData, paymentReference: e.target.value })}
                        placeholder="e.g., MPESA transaction ID or Bank reference"
                        className="h-9 text-sm"
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="clientId" className="text-xs font-medium">Client *</Label>
                  <div className="flex gap-2">
                    <Select
                      value={formData.clientId}
                      onValueChange={(value) =>
                        value && setFormData({ ...formData, clientId: value })
                      }
                    >
                      <SelectTrigger className="h-9 text-sm">
                        <SelectValue placeholder="Select a client" />
                      </SelectTrigger>
                      <SelectContent>
                        {localClients.map((client) => (
                          <SelectItem key={client._id} value={client._id}>
                            {client.name} {client.companyName && `(${client.companyName})`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <InlineClientCreator
                      onClientCreated={(client) => {
                        setLocalClients([...localClients, client]);
                        setFormData({ ...formData, clientId: client._id });
                      }}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="quotationId" className="text-xs font-medium">From Quotation (Optional)</Label>
                  <Select
                    value={formData.quotationId ?? ""}
                    onValueChange={(value) => {
                      setFormData({ ...formData, quotationId: value || "" });
                      if (value) loadFromQuotation(value);
                    }}
                  >
                    <SelectTrigger className="h-9 text-sm">
                      <SelectValue placeholder="Select a quotation to load data" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">None</SelectItem>
                      {quotations.map((quotation) => (
                        <SelectItem key={quotation._id} value={quotation._id}>
                          {quotation.quotationNumber} - {quotation.client?.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="invoiceDate" className="text-xs font-medium">Invoice Date *</Label>
                    <Input
                      id="invoiceDate"
                      type="date"
                      value={formData.invoiceDate}
                      onChange={(e) =>
                        setFormData({ ...formData, invoiceDate: e.target.value })
                      }
                      required
                      className="h-9 text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dueDate" className="text-xs font-medium">Due Date</Label>
                    <Input
                      id="dueDate"
                      type="date"
                      value={formData.dueDate}
                      onChange={(e) =>
                        setFormData({ ...formData, dueDate: e.target.value })
                      }
                      className="h-9 text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="templateId" className="text-xs font-medium">Invoice Template</Label>
                    <Select
                      value={formData.templateId ?? ""}
                      onValueChange={(value) =>
                        setFormData({ ...formData, templateId: value || "" })
                      }
                    >
                      <SelectTrigger className="h-9 text-sm">
                        <SelectValue placeholder="Select template" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Default</SelectItem>
                        {templates.map((template) => (
                          <SelectItem key={template._id} value={template._id}>
                            {template.name} ({template.style})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="taxRate" className="text-xs font-medium">Tax Rate (%)</Label>
                    <Input
                      id="taxRate"
                      type="number"
                      value={formData.taxRate}
                      onChange={(e) =>
                        setFormData({ ...formData, taxRate: parseFloat(e.target.value) || 0 })
                      }
                      min="0"
                      step="0.1"
                      className="h-9 text-sm"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Line Items */}
            {currentStep === 1 && (
              <div className="space-y-5">
                <LineItemsInput
                  items={formData.items}
                  onChange={(items) => setFormData({ ...formData, items })}
                  services={localServices}
                  onServiceCreated={(service) => {
                    setLocalServices([...localServices, service]);
                  }}
                />

                {/* Totals */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-muted rounded-lg">
                  <div>
                    <Label className="text-xs font-medium">Subtotal</Label>
                    <p className="text-lg font-bold">{formatCurrency(totals.subtotal, formData.currency)}</p>
                  </div>
                  <div>
                    <Label className="text-xs font-medium">Tax ({formData.taxRate}%)</Label>
                    <p className="text-lg font-bold">{formatCurrency(totals.taxAmount, formData.currency)}</p>
                  </div>
                  <div>
                    <Label className="text-xs font-medium">Discount</Label>
                    <Input
                      type="number"
                      value={formData.discountAmount}
                      onChange={(e) =>
                        setFormData({ ...formData, discountAmount: e.target.value })
                      }
                      min="0"
                      step="0.01"
                      className="h-9 text-sm"
                    />
                  </div>
                  <div>
                    <Label className="text-xs font-medium">Total</Label>
                    <p className="text-xl font-bold">{formatCurrency(totals.total, formData.currency)}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Notes & Terms */}
            {currentStep === 2 && (
              <div className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="notes" className="text-xs font-medium">Notes</Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) =>
                        setFormData({ ...formData, notes: e.target.value })
                      }
                      rows={4}
                      className="text-sm resize-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="terms" className="text-xs font-medium">Terms</Label>
                    <Textarea
                      id="terms"
                      value={formData.terms}
                      onChange={(e) =>
                        setFormData({ ...formData, terms: e.target.value })
                      }
                      rows={4}
                      className="text-sm resize-none"
                    />
                  </div>
                </div>

                <div className="p-4 bg-muted rounded-lg">
                  <h3 className="font-semibold mb-2 text-sm">Invoice Summary</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Client:</span>
                      <span className="font-medium">
                        {clients.find(c => c._id === formData.clientId)?.name}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Amount:</span>
                      <span className="font-bold">Ksh {totals.total}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </FormWizard>
        </SheetContent>
      </Sheet>

      {/* Preview Dialog */}
      <InvoicePreview
        invoice={previewInvoice as any}
        clients={clients}
        templates={templates}
        open={showPreview}
        onClose={() => setShowPreview(false)}
      />

      {/* Ubuntu Style Preview */}
      {showUbuntuPreview && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="w-full max-w-6xl h-full flex flex-col bg-white rounded-lg overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">Ubuntu Style Preview</h2>
              <Button variant="outline" size="sm" onClick={() => setShowUbuntuPreview(false)}>
                Close
              </Button>
            </div>
            <div className="flex-1 overflow-auto">
              <UbuntuInvoicePreview
                invoice={previewInvoice as any}
                organization={organization}
                onBack={() => setShowUbuntuPreview(false)}
                onDownloadComplete={() => {
                  setShowUbuntuPreview(false);
                  toast.success("Invoice saved successfully");
                }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
