import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useQuotation } from "@/context/quotation-context";
import { formatCurrency } from "@/utils/currency";

export default function QuotationTotals() {
  const { quotation, updateQuotation } = useQuotation();
  const currency = quotation.currency || "KES";

  const handleTaxRateChange = (value: string) => {
    if (value === "") {
      updateQuotation({ taxRate: "" });
      return;
    }

    const numValue = Number.parseFloat(value);
    if (!isNaN(numValue) && numValue >= 0 && numValue <= 100) {
      updateQuotation({ taxRate: numValue });
    }
  };

  const handleTaxRateBlur = () => {
    if (quotation.taxRate === "" || isNaN(Number(quotation.taxRate))) {
      updateQuotation({ taxRate: 0 });
    }
  };

  const handleDiscountChange = (value: string) => {
    if (value === "") {
      updateQuotation({ discountAmount: "" });
      return;
    }

    const numValue = Number.parseFloat(value);
    if (!isNaN(numValue) && numValue >= 0) {
      updateQuotation({ discountAmount: numValue });
    }
  };

  const taxRate = Number(quotation.taxRate) || 0;
  const discountAmount = Number(quotation.discountAmount) || 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>VAT &amp; Totals</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="quotation-taxRate">VAT Rate (%)</Label>
            <Input
              id="quotation-taxRate"
              type="number"
              min="0"
              max="100"
              step="0.01"
              value={quotation.taxRate ?? 0}
              onChange={(e) => handleTaxRateChange(e.target.value)}
              onBlur={handleTaxRateBlur}
            />
          </div>
          <div>
            <Label htmlFor="quotation-discountAmount">
              Discount ({currency})
            </Label>
            <Input
              id="quotation-discountAmount"
              type="number"
              min="0"
              step="0.01"
              value={quotation.discountAmount ?? ""}
              onChange={(e) => handleDiscountChange(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>{formatCurrency(quotation.subtotal, currency)}</span>
          </div>
          <div className="flex justify-between">
            <span>VAT ({taxRate}%):</span>
            <span>{formatCurrency(quotation.taxAmount, currency)}</span>
          </div>
          {discountAmount > 0 && (
            <div className="flex justify-between text-emerald-600">
              <span>Discount:</span>
              <span>-{formatCurrency(discountAmount, currency)}</span>
            </div>
          )}
          <div className="flex justify-between font-bold text-lg border-t pt-2">
            <span>Total:</span>
            <span>{formatCurrency(quotation.total, currency)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
