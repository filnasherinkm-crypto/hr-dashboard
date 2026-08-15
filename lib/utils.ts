import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function getInitials(name: string): string {
  if (!name) return 'HR';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/**
 * Calculates relative time string from reference date (Aug 11, 2026)
 * e.g. "in 3d", "in 11d", "Today", "in 22d"
 */
export function getRelativeTime(targetDateStr: string, referenceDateStr: string = '2026-08-11'): string {
  const target = new Date(targetDateStr);
  const ref = new Date(referenceDateStr);
  
  // Set both to midnight UTC to compare exact days
  const targetUtc = Date.UTC(target.getFullYear(), target.getMonth(), target.getDate());
  const refUtc = Date.UTC(ref.getFullYear(), ref.getMonth(), ref.getDate());
  
  const diffDays = Math.round((targetUtc - refUtc) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';
  if (diffDays > 0) return `in ${diffDays}d`;
  if (diffDays === -1) return 'Yesterday';
  return `${Math.abs(diffDays)}d ago`;
}

export function formatDatePretty(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

export const AVATAR_COLORS = [
  '#FF7900', // Reference Primary Orange
  '#E65100', // Deep Orange
  '#FF6D00', // Vibrant Amber Orange
  '#F57C00', // Warm Orange
  '#EF6C00', // Burnt Orange
  '#FB8C00', // Golden Orange
];

export function getAvatarColor(idOrName: string): string {
  let hash = 0;
  for (let i = 0; i < idOrName.length; i++) {
    hash = idOrName.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % AVATAR_COLORS.length;
  return AVATAR_COLORS[index];
}
