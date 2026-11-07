import BasicDetails, { StatusOption } from "./basic-details";
import ContactDetails from "./contact-details";
import ItemsList from "./items-list";
import TaxAndTotals from "./tax-and-totals";
import { useInvoice } from "@/context/invoice-context";

const INVOICE_STATUS_OPTIONS: StatusOption[] = [
  { value: "draft", label: "Draft" },
  { value: "sent", label: "Sent" },
  { value: "paid", label: "Paid" },
  { value: "partially_paid", label: "Partially Paid" },
  { value: "overdue", label: "Overdue" },
  { value: "cancelled", label: "Cancelled" },
];

export default function InvoiceForm() {
  const { invoice, updateInvoice } = useInvoice();

  return (
    <div className="space-y-6">
      <BasicDetails 
        documentNumber={invoice.invoiceNumber}
        onNumberChange={(val) => updateInvoice({ invoiceNumber: val })}
        date={invoice.date}
        onDateChange={(val) => updateInvoice({ date: val })}
        dueDate={invoice.dueDate || ""}
        onDueDateChange={(val) => updateInvoice({ dueDate: val })}
        currency={invoice.currency || "KES"}
        onCurrencyChange={(val) => updateInvoice({ currency: val })}
        status={invoice.status}
        onStatusChange={(val) => updateInvoice({ status: val })}
        statusOptions={INVOICE_STATUS_OPTIONS}
      />
      <ContactDetails
        fromName={invoice.fromName}
        onFromNameChange={(val) => updateInvoice({ fromName: val })}
        fromEmail={invoice.fromEmail}
        onFromEmailChange={(val) => updateInvoice({ fromEmail: val })}
        toName={invoice.toName}
        onToNameChange={(val) => updateInvoice({ toName: val })}
        toEmail={invoice.toEmail}
        onToEmailChange={(val) => updateInvoice({ toEmail: val })}
      />
      <ItemsList />
      <TaxAndTotals />
    </div>
  );
}
