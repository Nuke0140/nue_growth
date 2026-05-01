// ============================================
// Finance Module — Shared Utilities
// ============================================

/**
 * Format a number as Indian Rupees with lakh/crore notation.
 * Examples: 1500 → ₹1.5K, 250000 → ₹2.5L, 12000000 → ₹1.2Cr
 */
export function formatINR(num: number): string {
  if (num >= 10000000) return `₹${(num / 10000000).toFixed(1)}Cr`;
  if (num >= 100000) return `₹${(num / 100000).toFixed(1)}L`;
  if (num >= 1000) return `₹${(num / 1000).toFixed(1)}K`;
  return `₹${num}`;
}

/**
 * Format a number as a compact amount string (without ₹ symbol).
 * Used for secondary displays where the currency context is already shown.
 */
export function formatAmount(num: number): string {
  if (num >= 10000000) return `${(num / 10000000).toFixed(1)}Cr`;
  if (num >= 100000) return `${(num / 100000).toFixed(1)}L`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return `${num}`;
}
