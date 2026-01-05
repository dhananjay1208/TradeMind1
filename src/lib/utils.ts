import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatPercent(value: number): string {
  return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
}

export function calculatePnL(
  tradeType: 'LONG' | 'SHORT',
  entryPrice: number,
  exitPrice: number,
  quantity: number
): number {
  if (tradeType === 'LONG') {
    return (exitPrice - entryPrice) * quantity;
  } else {
    return (entryPrice - exitPrice) * quantity;
  }
}

export function getRiskZone(used: number, limit: number): {
  zone: 'safe' | 'caution' | 'danger' | 'stop';
  color: string;
} {
  const percentage = (used / limit) * 100;

  if (percentage >= 100) {
    return { zone: 'stop', color: 'bg-red-900 text-white' };
  } else if (percentage >= 75) {
    return { zone: 'danger', color: 'bg-red-500 text-white' };
  } else if (percentage >= 50) {
    return { zone: 'caution', color: 'bg-yellow-500 text-white' };
  } else {
    return { zone: 'safe', color: 'bg-green-500 text-white' };
  }
}
