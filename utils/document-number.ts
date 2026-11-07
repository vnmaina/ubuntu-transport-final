/**
 * Formats a date as dd-mm-yy (e.g. 10-11-26)
 */
export function formatDateDDMMYY(d: Date = new Date()): string {
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = String(d.getFullYear()).slice(-2);
  return `${day}-${month}-${year}`;
}

/**
 * Computes the next document number from existing document numbers.
 * Generates numbers in the format: {PREFIX}-{number}-{dd-mm-yy}
 * e.g. INV-1-10-11-26, QTN-1-10-11-26
 * The number sequence starts from 1 and increments sequentially.
 */
export function getNextDocumentNumber(
  prefix: "INV" | "QTN",
  existingNumbers: (string | undefined | null)[],
  date: Date = new Date()
): string {
  let maxNum = 0;
  const regex = new RegExp(`^${prefix}-(\\d+)-\\d{2}-\\d{2}-\\d{2}$`, "i");
  for (const numStr of existingNumbers) {
    if (!numStr) continue;
    const match = numStr.match(regex);
    if (match) {
      const parsed = parseInt(match[1], 10);
      if (!isNaN(parsed) && parsed > maxNum) {
        maxNum = parsed;
      }
    }
  }
  const nextNum = maxNum + 1;
  return `${prefix}-${nextNum}-${formatDateDDMMYY(date)}`;
}

