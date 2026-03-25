import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Pages that can be accessed while in guest mode
export const GUEST_ACCESSIBLE_PAGES = ['/home', '/poem-of-the-day', '/settings']
