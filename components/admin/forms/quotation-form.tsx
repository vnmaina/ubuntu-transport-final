import BasicDetails, { StatusOption } from "./basic-details";
import ContactDetails from "./contact-details";
import QuotationItemsList from "./quotation-items-list";
import QuotationTotals from "./quotation-totals";
import { useQuotation } from "@/context/quotation-context";

const QUOTATION_STATUS_OPTIONS: StatusOption[] = [
  { value: "draft", label: "Draft" },
  { value: "sent", label: "Sent" },
  { value: "accepted", label: "Accepted" },
  { value: "rejected", label: "Rejected" },
  { value: "expired", label: "Expired" },
];

export default function QuotationForm() {
  const { quotation, updateQuotation } = useQuotation();

  return (
    <div className="space-y-6">
      <BasicDetails 
        title="Quotation Details"
        numberLabel="Quotation Number"
        documentNumber={quotation.quotationNumber}
        onNumberChange={(val) => updateQuotation({ quotationNumber: val })}
        date={quotation.date}
        onDateChange={(val) => updateQuotation({ date: val })}
        dueDate={quotation.dueDate || ""}
        onDueDateChange={(val) => updateQuotation({ dueDate: val })}        
        currency={quotation.currency || "KES"}
        onCurrencyChange={(val) => updateQuotation({ currency: val })}
        status={quotation.status}
        onStatusChange={(val) => updateQuotation({ status: val })}
        statusOptions={QUOTATION_STATUS_OPTIONS}
      />
      <ContactDetails
        fromName={quotation.fromName}
        onFromNameChange={(val) => updateQuotation({ fromName: val })}
        fromEmail={quotation.fromEmail}
        onFromEmailChange={(val) => updateQuotation({ fromEmail: val })}
        toName={quotation.toName}
        onToNameChange={(val) => updateQuotation({ toName: val })}
        toEmail={quotation.toEmail}
        onToEmailChange={(val) => updateQuotation({ toEmail: val })}
      />
      <QuotationItemsList />
      <QuotationTotals />
    </div>
  );
}
