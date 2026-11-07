"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { InvoiceRow } from "./columns";
import {
    generateInvoiceNumberAction,
    createInvoiceAction,
    updateInvoiceAction,
} from "@/app/actions/documents";
import { toast } from "sonner";
import { CURRENCY_OPTIONS, formatCurrency } from "@/utils/currency";

interface InvoiceDialogProps {
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

export function InvoiceDialog({ invoice, clients, services, quotations, templates, open, onClose, isCreating }: InvoiceDialogProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [isGeneratingNumber, setIsGeneratingNumber] = useState(false);
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
        if (invoice && !isCreating) {
            setFormData({
                invoiceNumber: invoice.invoiceNumber,
                clientId: invoice.clientId,
                quotationId: invoice.quotationId || "",
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
                notes: invoice.notes || "",
                terms: invoice.terms || "",
                templateId: invoice.templateId || "",
                paidAmount: invoice.paidAmount || "",
                balanceDue: invoice.balanceDue || "",
                paymentType: (invoice.paymentType as any) || "",
                paymentReference: invoice.paymentReference || "",
                paymentDate: invoice.paymentDate || "",
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
    }, [invoice, isCreating, open]);

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

    const loadFromQuotation = async (quotationId: string) => {
        const quotation = quotations.find(q => q._id === quotationId);
        if (quotation) {
            setFormData({
                ...formData,
                clientId: quotation.clientId,
                currency: (quotation as any).currency || formData.currency || "KES",
                items: quotation.items,
                terms: quotation.terms || "",
            });
        }
    };

    const addLineItem = () => {
        setFormData({
            ...formData,
            items: [
                ...formData.items,
                {
                    description: "",
                    quantity: 1,
                    unitPrice: "0",
                    total: "0",
                    itemDate: new Date().toISOString().split('T')[0],
                },
            ],
        });
    };

    const updateLineItem = (index: number, field: keyof LineItem, value: any) => {
        const newItems = [...formData.items];
        newItems[index] = { ...newItems[index], [field]: value };

        // Calculate total if quantity or unit price changes
        if (field === "quantity" || field === "unitPrice") {
            const quantity = parseFloat(String(newItems[index].quantity)) || 0;
            const unitPrice = parseFloat(newItems[index].unitPrice) || 0;
            newItems[index].total = (quantity * unitPrice).toFixed(2);
        }

        setFormData({ ...formData, items: newItems });
    };

    const removeLineItem = (index: number) => {
        setFormData({
            ...formData,
            items: formData.items.filter((_, i) => i !== index),
        });
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // Validation for partially paid
            if (formData.status === "partially_paid" && (!formData.paidAmount || parseFloat(formData.paidAmount) <= 0)) {
                toast.error("Please enter the amount paid for partially paid invoices");
                setIsLoading(false);
                return;
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

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="mx-auto my-4 !max-w-[95%] w-[95%] md:!max-w-[85%] md:!w-[85%] lg:!max-w-[75%] lg:!w-[75%] flex flex-col">
                <DialogHeader>
                    <DialogTitle>
                        {isCreating ? "Create New Invoice" : "Edit Invoice"}
                    </DialogTitle>
                    <DialogDescription>
                        {isCreating
                            ? "Create a new invoice for a client."
                            : "Update the invoice details."}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="flex flex-col h-full">
                    <div className="flex-1 overflow-y-auto grid gap-5 py-4 pr-2">
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
                                                    const totals = calculateTotals();
                                                    const total = parseFloat(totals.total) || 0;
                                                    const paid = parseFloat(paidAmount) || 0;
                                                    balanceDue = Math.max(0, total - paid).toFixed(2);
                                                }
                                                setFormData({ ...formData, paidAmount, balanceDue });
                                            }}
                                            placeholder="0.00"
                                            className="h-9 text-sm"
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
                            <Select
                                value={formData.clientId || ""}
                                onValueChange={(value) =>
                                    setFormData({ ...formData, clientId: value || "" })
                                }
                            >
                                <SelectTrigger className="h-9 text-sm">
                                    <SelectValue placeholder="Select a client" />
                                </SelectTrigger>
                                <SelectContent>
                                    {clients.map((client) => (
                                        <SelectItem key={client._id} value={client._id}>
                                            {client.name} {client.companyName && `(${client.companyName})`}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="quotationId" className="text-xs font-medium">From Quotation (Optional)</Label>
                            <Select
                                value={formData.quotationId || ""}
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
                                    value={formData.templateId || ""}
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

                        {/* Line Items */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <Label className="text-sm font-medium">Line Items</Label>
                                <Button type="button" variant="outline" size="sm" onClick={addLineItem} className="h-9 text-sm">
                                    <Plus className="size-4 mr-2" />
                                    Add Item
                                </Button>
                            </div>

                            {formData.items.map((item, index) => (
                                <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-start p-4 border rounded-lg">
                                    <div className="md:col-span-4 space-y-2">
                                        <Label className="text-xs font-medium">Description</Label>
                                        <Input
                                            value={item.description}
                                            onChange={(e) => updateLineItem(index, "description", e.target.value)}
                                            placeholder="Item description"
                                            className="h-9 text-sm"
                                        />
                                    </div>
                                    <div className="md:col-span-2 space-y-2">
                                        <Label className="text-xs font-medium">Date</Label>
                                        <Input
                                            type="date"
                                            value={item.itemDate || ""}
                                            onChange={(e) => updateLineItem(index, "itemDate", e.target.value)}
                                            className="h-9 text-sm"
                                        />
                                    </div>
                                    <div className="md:col-span-2 space-y-2">
                                        <Label className="text-xs font-medium">Quantity</Label>
                                        <Input
                                            type="number"
                                            value={item.quantity}
                                            onChange={(e) => updateLineItem(index, "quantity", parseFloat(e.target.value) || 0)}
                                            min="0"
                                            className="h-9 text-sm"
                                        />
                                    </div>
                                    <div className="md:col-span-2 space-y-2">
                                        <Label className="text-xs font-medium">Unit Price</Label>
                                        <Input
                                            type="number"
                                            value={item.unitPrice}
                                            onChange={(e) => updateLineItem(index, "unitPrice", e.target.value)}
                                            min="0"
                                            step="0.01"
                                            className="h-9 text-sm"
                                        />
                                    </div>
                                    <div className="md:col-span-1 space-y-2">
                                        <Label className="text-xs font-medium">Total</Label>
                                        <Input
                                            value={item.total}
                                            readOnly
                                            className="bg-muted h-9 text-sm"
                                        />
                                    </div>
                                    <div className="md:col-span-1">
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => removeLineItem(index)}
                                            className="h-9 w-9 mt-6"
                                        >
                                            <Trash2 className="size-4 text-red-500" />
                                        </Button>
                                    </div>
                                </div>
                            ))}

                            {formData.items.length === 0 && (
                                <div className="text-center py-8 text-muted-foreground border rounded-lg text-sm">
                                    No line items added. Click "Add Item" to get started.
                                </div>
                            )}
                        </div>

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

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="notes" className="text-xs font-medium">Notes</Label>
                                <Textarea
                                    id="notes"
                                    value={formData.notes}
                                    onChange={(e) =>
                                        setFormData({ ...formData, notes: e.target.value })
                                    }
                                    rows={3}
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
                                    rows={3}
                                    className="text-sm resize-none"
                                />
                            </div>
                        </div>
                    </div>
                    <DialogFooter className="pt-4">
                        <Button type="button" variant="outline" onClick={onClose} className="h-9 text-sm">
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading || formData.items.length === 0} className="h-9 text-sm">
                            {isLoading && <Loader2 className="mr-2 size-4 animate-spin" />}
                            {isCreating ? "Create Invoice" : "Update Invoice"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
