import { QuotationItem as QItemType } from "@/types/quotation";
import { useQuotation } from "@/context/quotation-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2 } from "lucide-react";

interface QuotationItemProps {
  item: QItemType;
  index: number;
  canRemove: boolean;
}

export default function QuotationItem({ item, index, canRemove }: QuotationItemProps) {
  const { updateItem, removeItem, quotation } = useQuotation();
  const currency = quotation.currency || "KES";

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
    <div className="flex flex-col md:flex-row gap-3 items-end border-b pb-4 mb-4 md:border-none md:pb-0 md:mb-0 bg-card">
      <div className="w-full md:w-40">
        <label className="text-xs font-semibold mb-1 block">Date</label>
        <Input
          type="date"
          value={item.date}
          onChange={(e) => updateItem(index, "date", e.target.value)}
        />
      </div>
      <div className="w-full md:w-28">
        <label className="text-xs font-semibold mb-1 block">No. of Days</label>
        <Input
          type="number"
          min="1"
          value={item.numberOfDays}
          onChange={(e) => handleDaysChange(e.target.value)}
          onBlur={handleDaysBlur}
        />
      </div>
      <div className="flex-1 w-full">
        <label className="text-xs font-semibold mb-1 block">Pickup Point</label>
        <Input
          type="text"
          value={item.pickupPaid}
          onChange={(e) => updateItem(index, "pickupPaid", e.target.value)}
          placeholder="e.g. Nairobi CBD"
        />
      </div>
      <div className="flex-1 w-full">
        <label className="text-xs font-semibold mb-1 block">Dropoff / Return</label>
        <Input
          type="text"
          value={item.dropoffReturnTrip}
          onChange={(e) => updateItem(index, "dropoffReturnTrip", e.target.value)}
          placeholder="e.g. Naivasha Route"
        />
      </div>
      <div className="w-full md:w-36">
        <label className="text-xs font-semibold mb-1 block">Amount ({currency})</label>
        <Input
          type="number"
          min="0"
          step="0.01"
          value={item.amount}
          onChange={(e) => updateItem(index, "amount", e.target.value === "" ? "" : Number(e.target.value))}
        />
      </div>
      <div className="w-full md:w-auto">
        <Button
          variant="outline"
          size="icon"
          onClick={() => removeItem(index)}
          disabled={!canRemove}
          className="w-full md:size-9 text-destructive hover:bg-destructive/10 hover:text-destructive shrink-0"
          title="Remove item"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
