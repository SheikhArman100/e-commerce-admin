/**
 * Currency formatting for the admin dashboard.
 * All monetary values are Bangladeshi Taka (৳, BDT).
 */

export const CURRENCY_SYMBOL = '৳';

/**
 * Formats a number as Taka, e.g. formatTaka(1234.5, 2) → "৳1,234.50"
 */
export function formatTaka(value: number, decimals: number = 0): string {
  const formatted = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);

  return `${CURRENCY_SYMBOL}${formatted}`;
}
