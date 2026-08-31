const currencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
});

/**
 * Format money consistently across the app (currency symbol, 2 decimals,
 * thousands separators).
 */
export function formatMoney(value: string | number): string {
    return currencyFormatter.format(Number(value));
}
