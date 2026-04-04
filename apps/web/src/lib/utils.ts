import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

// Pages that can be accessed while in guest mode
export const GUEST_ACCESSIBLE_PAGES = ['/home', '/poem-of-the-day', '/settings']

/**
 * Utility function for comining className values.
 * @param inputs className values to combine.
 * @returns The className values merged into one string.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}

/**
 * Sleep for a given amount of time.
 * @param ms Number of milliseconds to sleep.
 * @returns A promise that resolves after the given amount of time.
 */
export function sleep(ms: number): Promise<void> {
  // SOURCE: https://stackoverflow.com/questions/951021/what-is-the-javascript-version-of-sleep
  return new Promise((resolve) => setTimeout(resolve, ms))
}
