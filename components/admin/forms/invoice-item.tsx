import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { InvoiceItem as InvoiceItemType } from "@/types/invoice";
import { useInvoice } from "@/context/invoice-context";

interface InvoiceItemProps {
  item: InvoiceItemType;
  index: number;
  canRemove: boolean;
}

export default function InvoiceItem({
  item,
  index,
  canRemove,
}: InvoiceItemProps) {
  const { removeItem, updateItem, invoice } = useInvoice();
  const currency = invoice.currency || "KES";

  const handleQuantityChange = (value: string) => {
    if (value === "") {
      updateItem(index, "quantity", "");
    } else {
      const numValue = Number.parseInt(value);
      if (!isNaN(numValue) && numValue >= 0) {
        updateItem(index, "quantity", numValue);
      }
    }
  };

  const handleQuantityBlur = () => {
    if (item.quantity === "" || item.quantity === 0) {
      updateItem(index, "quantity", 1);
    }
  };

  const handleRateChange = (value: string) => {
    if (value === "") {
      updateItem(index, "rate", "");
    } else {
      const numValue = Number.parseFloat(value);
      if (!isNaN(numValue) && numValue >= 0) {
        updateItem(index, "rate", numValue);
      }
    }
  };

  const handleRateBlur = () => {
    if (item.rate === "") {
      updateItem(index, "rate", 0);
    }
  };

  const handleDaysChange = (value: string) => {
    if (value === "") {
      updateItem(index, "numberOfDays", "");
    } else {
      const numValue = Number.parseInt(value);
      if (!isNaN(numValue) && numValue >= 0) {
        updateItem(index, "numberOfDays", numValue);
      }
    }
  };

  const handleDaysBlur = () => {
    if (item.numberOfDays === "" || item.numberOfDays === 0) {
      updateItem(index, "numberOfDays", 1);
    }
  };

  return (
    <div className="grid grid-cols-12 gap-3 p-4 border rounded-xl bg-card items-end">
      <div className="col-span-12 md:col-span-4">
        <Label className="text-xs font-semibold mb-1 block">Description</Label>
        <Input
          placeholder="e.g. 33-Seater Safari Bus Rental"
          value={item.description}
          onChange={(e) => updateItem(index, "description", e.target.value)}
        />
      </div>
      <div className="col-span-4 sm:col-span-2 md:col-span-1">
        <Label className="text-xs font-semibold mb-1 block">Qty</Label>
        <Input
          type="number"
          min="1"
          value={item.quantity}
          onChange={(e) => handleQuantityChange(e.target.value)}
          onBlur={handleQuantityBlur}
        />
      </div>
      <div className="col-span-8 sm:col-span-4 md:col-span-2">
        <Label className="text-xs font-semibold mb-1 block">Rate ({currency})</Label>
        <Input
          type="number"
          min="0"
          step="0.01"
          value={item.rate}
          onChange={(e) => handleRateChange(e.target.value)}
          onBlur={handleRateBlur}
        />
      </div>
      <div className="col-span-6 sm:col-span-3 md:col-span-2">
        <Label className="text-xs font-semibold mb-1 block">No. of Days</Label>
        <Input
          type="number"
          min="1"
          value={item.numberOfDays}
          onChange={(e) => handleDaysChange(e.target.value)}
          onBlur={handleDaysBlur}
        />
      </div>
      <div className="col-span-6 sm:col-span-3 md:col-span-2">
        <Label className="text-xs font-semibold mb-1 block">Amount ({currency})</Label>
        <div className="h-9 px-3 py-2 bg-muted/40 border rounded-md flex items-center text-xs font-semibold truncate">
          {currency} {typeof item.amount === "number" ? item.amount.toFixed(2) : "0.00"}
        </div>
      </div>
      <div className="col-span-12 md:col-span-1 flex items-end justify-end">
        <Button
          variant="outline"
          size="icon"
          className="size-9 text-destructive hover:bg-destructive/10 hover:text-destructive shrink-0"
          onClick={() => removeItem(index)}
          disabled={!canRemove}
          title="Remove item"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
