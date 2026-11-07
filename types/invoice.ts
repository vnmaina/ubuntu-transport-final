export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number | "";
  rate: number | "";
  amount: number;
  numberOfDays: number | "";
}

export interface InvoiceData {
  _id?: string;
  invoiceNumber: string;
  date: string; // YYYY-MM-DD
  dueDate?: string; // YYYY-MM-DD
  fromName: string;
  fromEmail: string;
  toName: string;
  toEmail: string;
  items: InvoiceItem[];
  taxRate: number | "";
  taxAmount: number;
  subtotal: number;
  total: number;
  currency?: string;
  notes?: string;
  status?: string;
  numberOfDays?: number;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}
