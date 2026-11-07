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
import { Loader2, Plus, Download } from "lucide-react";
import { QuotationRow } from "./columns";
import {
  generateQuotationNumberAction,
  createQuotationAction,
  updateQuotationAction,
} from "@/app/actions/documents";
import { toast } from "sonner";
import { FormWizard } from "@/components/admin/forms/FormWizard";
import { LineItemsInput } from "@/components/admin/forms/LineItemsInput";
import { InlineClientCreator } from "@/components/admin/forms/InlineClientCreator";
import { QuotationPreview } from "./QuotationPreview";
import { UbuntuQuotationPreview } from "@/components/admin/quotations/UbuntuQuotationPreview";
import { getOrganization } from "@/app/actions/organization";
import { CURRENCY_OPTIONS, formatCurrency } from "@/utils/currency";

interface QuotationFormSheetProps {
  quotation?: QuotationRow | null;
  clients: any[];
  services: any[];
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

export function QuotationFormSheet({
  quotation,
  clients,
  services,
  open,
  onClose,
  isCreating,
}: QuotationFormSheetProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingNumber, setIsGeneratingNumber] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [showUbuntuPreview, setShowUbuntuPreview] = useState(false);
  const [organization, setOrganization] = useState<any>(null);
  const [localClients, setLocalClients] = useState(clients);
  const [localServices, setLocalServices] = useState(services);
  const [formData, setFormData] = useState({
    quotationNumber: "",
    clientId: "",
    quotationDate: new Date().toISOString().split('T')[0],
    validUntil: "",
    status: "draft" as "draft" | "sent" | "accepted" | "rejected" | "expired",
    currency: "KES" as string,
    items: [] as LineItem[],
    notes: "",
    terms: "",
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
    if (quotation && !isCreating) {
      setFormData({
        quotationNumber: quotation.quotationNumber,
        clientId: quotation.clientId,
        quotationDate: new Date(quotation.quotationDate).toISOString().split('T')[0],
        validUntil: quotation.validUntil ? new Date(quotation.validUntil).toISOString().split('T')[0] : "",
        status: quotation.status,
        currency: (quotation as any).currency || "KES",
        items: (quotation.items as LineItem[]).map(item => ({
          ...item,
          itemDate: item.itemDate ? new Date(item.itemDate).toISOString().split('T')[0] : undefined,
        })),
        notes: quotation.notes || "",
        terms: quotation.terms || "",
      });
    } else {
      setFormData({
        quotationNumber: "",
        clientId: "",
        quotationDate: new Date().toISOString().split('T')[0],
        validUntil: "",
        status: "draft" as "draft" | "sent" | "accepted" | "rejected" | "expired",
        currency: "KES",
        items: [],
        notes: "",
        terms: "",
      });

      if (open && isCreating) {
        generateQuotationNumberAction().then((result) => {
          if (result.success && result.number) {
            setFormData((prev) => ({ ...prev, quotationNumber: result.number! }));
          }
        });
      }
    }
    setCurrentStep(0);
    setShowPreview(false);
    setShowUbuntuPreview(false);
    setLocalClients(clients);
    setLocalServices(services);
  }, [quotation, isCreating, open, clients, services]);

  const generateNumber = async () => {
    setIsGeneratingNumber(true);
    try {
      const result = await generateQuotationNumberAction();
      if (result.success && result.number) {
        setFormData({ ...formData, quotationNumber: result.number });
      }
    } catch (error) {
      toast.error("Failed to generate quotation number");
    } finally {
      setIsGeneratingNumber(false);
    }
  };

  const calculateTotals = () => {
    const subtotal = formData.items.reduce((sum, item) => sum + parseFloat(item.total || "0"), 0);
    return {
      subtotal: subtotal.toFixed(2),
      total: subtotal.toFixed(2),
    };
  };

  const handleSubmit = async () => {
    setIsLoading(true);

    try {
      const totals = calculateTotals();
      const submitData = {
        ...formData,
        clientId: formData.clientId as any,
        quotationDate: new Date(formData.quotationDate).getTime(),
        validUntil: formData.validUntil ? new Date(formData.validUntil).getTime() : undefined,
        items: formData.items.map(item => ({
          ...item,
          itemDate: item.itemDate ? new Date(item.itemDate).getTime() : undefined,
        })),
        ...totals,
      };

      if (isCreating) {
        const result = await createQuotationAction(submitData);
        if (result.error) {
          toast.error(result.error);
        } else {
          toast.success("Quotation created successfully");
          onClose();
        }
      } else if (quotation) {
        const result = await updateQuotationAction(quotation._id, submitData);
        if (result.error) {
          toast.error(result.error);
        } else {
          toast.success("Quotation updated successfully");
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
    return !!formData.quotationNumber && !!formData.clientId && !!formData.quotationDate;
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

  const previewQuotation = {
    ...formData,
    ...totals,
    subtotal: totals.subtotal,
    total: totals.total,
    client: localClients.find(c => c._id === formData.clientId),
  };

  return (
    <>
      <Sheet open={open} onOpenChange={onClose}>
        <SheetContent side="right" className="overflow-hidden max-w-[90vw] md:!max-w-[50%] w-[80%] md:!w-1/2">
          <SheetHeader>
            <div className="flex items-center justify-between">
              <div>
                <SheetTitle>
                  {isCreating ? "Create New Quotation" : "Edit Quotation"}
                </SheetTitle>
                <SheetDescription>
                  {isCreating
                    ? "Create a new quotation for a client."
                    : "Update the quotation details."}
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
              <div className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="quotationNumber" className="text-[10px]">Quotation Number *</Label>
                    <div className="flex gap-2">
                      <Input
                        id="quotationNumber"
                        value={formData.quotationNumber}
                        onChange={(e) =>
                          setFormData({ ...formData, quotationNumber: e.target.value })
                        }
                        required
                        className="h-7 text-xs"
                      />
                      {isCreating && (
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={generateNumber}
                          disabled={isGeneratingNumber}
                          className="h-7 w-7"
                        >
                          {isGeneratingNumber ? (
                            <Loader2 className="size-2.5 animate-spin" />
                          ) : (
                            <Plus className="size-2.5" />
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status" className="text-[10px]">Status</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) =>
                        value && setFormData({ ...formData, status: value as any })
                      }
                    >
                      <SelectTrigger className="h-7 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="sent">Sent</SelectItem>
                        <SelectItem value="accepted">Accepted</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                        <SelectItem value="expired">Expired</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="currency" className="text-[10px]">Currency</Label>
                    <Select
                      value={formData.currency || "KES"}
                      onValueChange={(value) =>
                        value && setFormData({ ...formData, currency: value })
                      }
                    >
                      <SelectTrigger className="h-7 text-xs">
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

                <div className="space-y-2">
                  <Label htmlFor="clientId" className="text-[10px]">Client *</Label>
                  <div className="flex gap-2">
                    <Select
                      value={formData.clientId}
                      onValueChange={(value) =>
                        value && setFormData({ ...formData, clientId: value })
                      }
                      required
                    >
                      <SelectTrigger className="h-7 text-xs">
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

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="quotationDate" className="text-[10px]">Quotation Date *</Label>
                    <Input
                      id="quotationDate"
                      type="date"
                      value={formData.quotationDate}
                      onChange={(e) =>
                        setFormData({ ...formData, quotationDate: e.target.value })
                      }
                      required
                      className="h-7 text-xs"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="validUntil" className="text-[10px]">Valid Until</Label>
                    <Input
                      id="validUntil"
                      type="date"
                      value={formData.validUntil}
                      onChange={(e) =>
                        setFormData({ ...formData, validUntil: e.target.value })
                      }
                      className="h-7 text-xs"
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
                <div className="grid grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
                  <div>
                    <Label className="text-[10px]">Subtotal</Label>
                    <p className="text-lg font-bold">{formatCurrency(totals.subtotal, formData.currency)}</p>
                  </div>
                  <div>
                    <Label className="text-[10px]">Total</Label>
                    <p className="text-lg font-bold">{formatCurrency(totals.total, formData.currency)}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Notes & Terms */}
            {currentStep === 2 && (
              <div className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="notes" className="text-[10px]">Notes</Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) =>
                        setFormData({ ...formData, notes: e.target.value })
                      }
                      rows={4}
                      className="text-xs resize-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="terms" className="text-[10px]">Terms</Label>
                    <Textarea
                      id="terms"
                      value={formData.terms}
                      onChange={(e) =>
                        setFormData({ ...formData, terms: e.target.value })
                      }
                      rows={4}
                      className="text-xs resize-none"
                    />
                  </div>
                </div>

                <div className="p-4 bg-muted rounded-lg">
                  <h3 className="font-semibold mb-2 text-xs">Quotation Summary</h3>
                  <div className="space-y-2 text-[10px]">
                    <div className="flex justify-between">
                      <span>Quotation Number:</span>
                      <span className="font-medium">{formData.quotationNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Client:</span>
                      <span className="font-medium">
                        {clients.find(c => c._id === formData.clientId)?.name}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Amount:</span>
                      <span className="font-bold">{formatCurrency(totals.total, formData.currency)}</span>
                    </div>
                    {formData.validUntil && (
                      <div className="flex justify-between">
                        <span>Valid Until:</span>
                        <span className="font-medium">
                          {new Date(formData.validUntil).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </FormWizard>
        </SheetContent>
      </Sheet>

      {/* Preview Dialog */}
      <QuotationPreview
        quotation={previewQuotation as any}
        clients={clients}
        open={showPreview}
        onClose={() => setShowPreview(false)}
      />

      {/* Ubuntu Style Preview */}
      {showUbuntuPreview && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="w-full max-w-6xl h-full flex flex-col bg-white rounded-lg overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">Ubuntu Style Preview</h2>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const previewElement = document.querySelector('[data-ubuntu-preview]') as HTMLElement;
                    if (previewElement) {
                      const filename = `quotation-${previewQuotation?.quotationNumber || 'draft'}.pdf`;
                      import("@/components/documents/pdf-export").then(({ exportElementToPdf }) => {
                        exportElementToPdf(previewElement, filename).then(() => {
                          toast.success("PDF downloaded successfully");
                        }).catch(() => {
                          toast.error("Failed to download PDF");
                        });
                      });
                    }
                  }}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF
                </Button>
                <Button variant="outline" size="sm" onClick={() => setShowUbuntuPreview(false)}>
                  Close
                </Button>
              </div>
            </div>
            <div className="flex-1 overflow-auto">
              <UbuntuQuotationPreview
                quotation={previewQuotation as any}
                organization={organization}
                onBack={() => setShowUbuntuPreview(false)}
                onDownloadComplete={() => {
                  setShowUbuntuPreview(false);
                  toast.success("Quotation saved successfully");
                }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
