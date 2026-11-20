
export interface QuotationItem {
  id: string;
  date: string; // YYYY-MM-DD
  pickupPaid: string;
  dropoffReturnTrip: string;
  amount: number | "";
  numberOfDays: number | "";
  status: string;
}

export interface QuotationData {
  _id?: string;
  quotationNumber: string;
  date: string; // YYYY-MM-DD
  dueDate?: string; // YYYY-MM-DD

  fromName: string;
  fromEmail: string;
  toName: string;
  toEmail: string;

  items: QuotationItem[];

  // Financial details
  subtotal?: number;
  taxRate?: number;
  taxAmount?: number;
  discountAmount?: number;
  total: number;
  currency?: string;

  // Additional information
  notes?: string;
  terms?: string;
  status?: string;
  numberOfDays?: number;

  createdAt?: string | Date;
  updatedAt?: string | Date;
}
