export type CurrencyCode = "KES" | "USD" | "EUR";

export interface CurrencyOption {
  code: CurrencyCode;
  label: string;
  symbol: string;
  name: string;
}

export const CURRENCY_OPTIONS: CurrencyOption[] = [
  { code: "KES", label: "KES - Kenyan Shilling (Ksh)", symbol: "KSh", name: "Kenyan Shilling" },
  { code: "USD", label: "USD - US Dollar ($)", symbol: "$", name: "US Dollar" },
  { code: "EUR", label: "EUR - Euros (€)", symbol: "€", name: "Euros" },
];

export const DEFAULT_CURRENCY: CurrencyCode = "KES";

export function normalizeCurrency(currency?: string | null): CurrencyCode {
  if (!currency) return DEFAULT_CURRENCY;
  const upper = String(currency).trim().toUpperCase();
  if (upper === "USD" || upper === "$") return "USD";
  if (upper === "EUR" || upper === "EUROS" || upper === "€") return "EUR";
  if (upper === "KES" || upper === "KSH") return "KES";
  return DEFAULT_CURRENCY;
}

export function getCurrencySymbol(currency?: string | null): string {
  const code = normalizeCurrency(currency);
  switch (code) {
    case "USD":
      return "$";
    case "EUR":
      return "€";
    case "KES":
    default:
      return "KES";
  }
}

export function formatCurrency(
  amount: string | number | undefined | null,
  currency?: string | null,
  options?: { useSymbol?: boolean }
): string {
  const code = normalizeCurrency(currency);
  const prefix = options?.useSymbol ? getCurrencySymbol(code) : code;

  if (amount === undefined || amount === null || amount === "") {
    return `${prefix} 0.00`;
  }

  const num =
    typeof amount === "number"
      ? amount
      : parseFloat(String(amount).replace(/[^0-9.-]+/g, ""));

  const formatted = isNaN(num)
    ? String(amount)
    : num.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });

  return `${prefix} ${formatted}`;
}

