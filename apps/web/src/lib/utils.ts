import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Utility function for comining className values.
 * @param inputs className values to combine.
 * @returns The className values merged into one string.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}

// Pages that can be accessed while in guest mode
export const GUEST_ACCESSIBLE_PAGES = ['/home', '/poem-of-the-day', '/settings']
