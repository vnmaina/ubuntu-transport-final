export type DocumentType = "invoice" | "quotation" | "receipt";
export type TemplateStyle = "corporate" | "modern" | "classic";

export type StampType = 
  | "seal" 
  | "paid" 
  | "approved" 
  | "authorized" 
  | "quotation" 
  | "received"
  | "custom";

export interface LineItem {
  id?: string;
  serviceId?: string;
  description: string;
  quantity: number;
  unitPrice: string | number;
  total: string | number;
}

export interface ClientData {
  _id?: string;
  name: string;
  companyName?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  taxId?: string;
}

export interface OrganizationData {
  _id?: string;
  name: string;
  logo?: string;
  email?: string;
  phone?: string;
  address?: string;
  website?: string;
  taxId?: string;
  bankName?: string;
  accountNumber?: string;
  accountName?: string;
  branch?: string;
  swiftCode?: string;
  iban?: string;
  routingNumber?: string;
  bankAddress?: string;
  mpesaPhoneNumber?: string;
  mpesaBusinessNumber?: string;
  mpesaAccountName?: string;
  mpesaTillNumber?: string;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  fontFamily?: string;
  stampUrl?: string;
  signatureUrl?: string;
  signatoryName?: string;
  signatoryTitle?: string;
}

export interface DocumentCustomization {
  style: TemplateStyle;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  fontFamily: string;

  // Logo
  showLogo: boolean;
  logoUrl?: string;
  logoSource?: "organization" | "url" | "upload";
  logoPosition: "left" | "center" | "right";

  // Stamp
  showStamp: boolean;
  stampType: StampType;
  customStampUrl?: string;
  stampSource?: "organization" | "url" | "upload";
  stampText?: string;

  // Signatures
  showSignature: boolean;
  signatureType: "cursive" | "custom";
  customSignatureUrl?: string;
  signatureSource?: "organization" | "url" | "upload";
  signatoryName: string;
  signatoryTitle: string;
  signatureDate?: string;

  // Client Acceptance Block (especially for Quotations & formal invoices)
  showClientSignature: boolean;
  clientSignatoryName?: string;

  // Additional sections
  showPaymentDetails: boolean;
  showTerms: boolean;
  showNotes: boolean;
  showQrCode: boolean;
}

export interface NormalizedDocument {
  type: DocumentType;
  id?: string;
  documentNumber: string;
  date: number | string;
  dueDate?: number | string;
  validUntil?: number | string;
  status: string; // paid, sent, draft, overdue, cancelled, accepted, rejected, expired
  client: ClientData;
  items: LineItem[];
  subtotal: string | number;
  taxRate?: number;
  taxAmount?: string | number;
  discountAmount?: string | number;
  total: string | number;
  currency?: string;
  paidAmount?: string | number;
  balanceDue?: string | number;
  terms?: string;
  notes?: string;
  paymentMethod?: string;
  paymentReference?: string;
  invoiceNumber?: string; // for receipts linking to an invoice
}
