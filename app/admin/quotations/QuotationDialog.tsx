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
import { QuotationRow } from "./columns";
import {
    generateQuotationNumberAction,
    createQuotationAction,
    updateQuotationAction,
} from "@/app/actions/documents";
import { toast } from "sonner";
import { CURRENCY_OPTIONS, formatCurrency } from "@/utils/currency";

interface QuotationDialogProps {
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
    quantity: string;
    unitPrice: string;
    total: string;
    itemDate?: string;
}

export function QuotationDialog({ quotation, clients, services, open, onClose, isCreating }: QuotationDialogProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [isGeneratingNumber, setIsGeneratingNumber] = useState(false);
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
        if (quotation && !isCreating) {
            setFormData({
                quotationNumber: quotation.quotationNumber,
                clientId: quotation.clientId,
                quotationDate: new Date(quotation.quotationDate).toISOString().split('T')[0],
                validUntil: quotation.validUntil ? new Date(quotation.validUntil).toISOString().split('T')[0] : "",
                status: quotation.status as "draft" | "sent" | "accepted" | "rejected" | "expired",
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
                status: "draft",
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
    }, [quotation, isCreating, open]);

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

    const addLineItem = () => {
        setFormData({
            ...formData,
            items: [
                ...formData.items,
                {
                    description: "",
                    quantity: "1",
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
            const quantity = parseFloat(newItems[index].quantity) || 0;
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
        return {
            subtotal: subtotal.toFixed(2),
            total: subtotal.toFixed(2),
        };
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
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

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-h-[80vh] overflow-hidden mx-auto my-4 !max-w-[50%] w-[80%] md:!w-1/2 sm:!max-w-[50%] flex flex-col">
                <DialogHeader>
                    <DialogTitle>
                        {isCreating ? "Create New Quotation" : "Edit Quotation"}
                    </DialogTitle>
                    <DialogDescription>
                        {isCreating
                            ? "Create a new quotation for a client."
                            : "Update the quotation details."}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="flex flex-col h-full">
                    <div className="flex-1 overflow-y-auto grid gap-5 py-4 pr-2">
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
                                <Label htmlFor="clientId" className="text-[10px]">Client *</Label>
                                <Select
                                    value={formData.clientId}
                                    onValueChange={(value: string | null) =>
                                        setFormData({ ...formData, clientId: value || "" })
                                    }
                                    required
                                >
                                    <SelectTrigger className="h-7 text-xs">
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
                                <Label htmlFor="currency" className="text-[10px]">Currency</Label>
                                <Select
                                    value={formData.currency || "KES"}
                                    onValueChange={(value: any) =>
                                        setFormData({ ...formData, currency: value })
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
                            <div className="space-y-2">
                                <Label htmlFor="status" className="text-[10px]">Status</Label>
                                <Select
                                    value={formData.status}
                                    onValueChange={(value: any) =>
                                        setFormData({ ...formData, status: value })
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

                        {/* Line Items */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <Label className="text-xs">Line Items</Label>
                                <Button type="button" variant="outline" size="sm" onClick={addLineItem} className="h-7 text-[10px]">
                                    <Plus className="size-2.5 mr-1" />
                                    Add Item
                                </Button>
                            </div>

                            {formData.items.map((item, index) => (
                                <div key={index} className="grid grid-cols-12 gap-3 items-start p-4 border rounded-lg">
                                    <div className="col-span-3 space-y-2">
                                        <Label className="text-[10px]">Description</Label>
                                        <Input
                                            value={item.description}
                                            onChange={(e) => updateLineItem(index, "description", e.target.value)}
                                            placeholder="Item description"
                                            className="h-7 text-xs"
                                        />
                                    </div>
                                    <div className="col-span-2 space-y-2">
                                        <Label className="text-[10px]">Date</Label>
                                        <Input
                                            type="date"
                                            value={item.itemDate || ""}
                                            onChange={(e) => updateLineItem(index, "itemDate", e.target.value)}
                                            className="h-7 text-xs"
                                        />
                                    </div>
                                    <div className="col-span-2 space-y-2">
                                        <Label className="text-[10px]">Quantity</Label>
                                        <Input
                                            type="number"
                                            value={item.quantity}
                                            onChange={(e) => updateLineItem(index, "quantity", parseFloat(e.target.value) || 0)}
                                            min="0"
                                            className="h-7 text-xs"
                                        />
                                    </div>
                                    <div className="col-span-2 space-y-2">
                                        <Label className="text-[10px]">Unit Price</Label>
                                        <Input
                                            type="number"
                                            value={item.unitPrice}
                                            onChange={(e) => updateLineItem(index, "unitPrice", e.target.value)}
                                            min="0"
                                            step="0.01"
                                            className="h-7 text-xs"
                                        />
                                    </div>
                                    <div className="col-span-2 space-y-2">
                                        <Label className="text-[10px]">Total</Label>
                                        <Input
                                            value={item.total}
                                            readOnly
                                            className="bg-muted h-7 text-xs"
                                        />
                                    </div>
                                    <div className="col-span-1">
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => removeLineItem(index)}
                                            className="h-7 w-7 mt-6"
                                        >
                                            <Trash2 className="size-2.5 text-red-500" />
                                        </Button>
                                    </div>
                                </div>
                            ))}

                            {formData.items.length === 0 && (
                                <div className="text-center py-8 text-muted-foreground border rounded-lg text-xs">
                                    No line items added. Click "Add Item" to get started.
                                </div>
                            )}
                        </div>

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

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="notes" className="text-[10px]">Notes</Label>
                                <Textarea
                                    id="notes"
                                    value={formData.notes}
                                    onChange={(e) =>
                                        setFormData({ ...formData, notes: e.target.value })
                                    }
                                    rows={3}
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
                                    rows={3}
                                    className="text-xs resize-none"
                                />
                            </div>
                        </div>
                    </div>
                    <DialogFooter className="pt-4">
                        <Button type="button" variant="outline" onClick={onClose} className="h-7 text-xs">
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading || formData.items.length === 0} className="h-7 text-xs">
                            {isLoading && <Loader2 className="mr-2 size-2.5 animate-spin" />}
                            {isCreating ? "Create Quotation" : "Update Quotation"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
