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
 */
export function formatAmount(num: number): string {
  if (num >= 10000000) return `${(num / 10000000).toFixed(1)}Cr`;
  if (num >= 100000) return `${(num / 100000).toFixed(1)}L`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return `${num}`;
}

/**
 * Format a percentage with sign.
 * Examples: 8.3 → +8.3%, -5.2 → -5.2%
 */
export function formatPercent(num: number, showSign = true): string {
  const sign = showSign && num > 0 ? '+' : '';
  return `${sign}${num.toFixed(1)}%`;
}

/**
 * Calculate runway months from cash balance and burn rate.
 */
export function calculateRunway(cashBalance: number, monthlyBurn: number): number {
  if (monthlyBurn <= 0) return Infinity;
  return Math.round((cashBalance / monthlyBurn) * 10) / 10;
}

/**
 * Determine severity based on runway months.
 */
export function getRunwaySeverity(months: number): 'healthy' | 'warning' | 'critical' {
  if (months >= 6) return 'healthy';
  if (months >= 4) return 'warning';
  return 'critical';
}

/**
 * Get overdue color key for design tokens.
 * Returns valid CSS design-token keys only.
 */
export function getOverdueColor(days: number): string {
  if (days > 60) return 'danger';
  if (days > 30) return 'warning';
  if (days > 0) return 'info';
  return 'emerald';
}

/**
 * Calculate aging bucket from overdue days.
 */
export function getAgingBucket(days: number): '0-30' | '31-60' | '61-90' | '90+' {
  if (days > 90) return '90+';
  if (days > 60) return '61-90';
  if (days > 30) return '31-60';
  return '0-30';
}

/**
 * Get payment probability label.
 */
export function getProbabilityLabel(probability: number): { label: string; color: string } {
  if (probability >= 80) return { label: 'High', color: 'success' };
  if (probability >= 50) return { label: 'Medium', color: 'warning' };
  return { label: 'Low', color: 'danger' };
}

/**
 * Calculate variance indicator.
 */
export function getVarianceIndicator(variancePercent: number): { label: string; color: string } {
  if (variancePercent > 10) return { label: 'Above', color: 'success' };
  if (variancePercent > -10) return { label: 'On Track', color: 'info' };
  return { label: 'Below', color: 'danger' };
}

/**
 * Get impact level color for AI insights.
 */
export function getImpactColor(impact: 'low' | 'medium' | 'high' | 'critical'): string {
  switch (impact) {
    case 'critical': return 'danger';
    case 'high': return 'warning';
    case 'medium': return 'info';
    case 'low': return 'accent';
  }
}
