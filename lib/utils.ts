import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Get the validated BASE_URL from environment variables
 * @throws {Error} If NEXT_PUBLIC_BASE_URL is not defined
 * @returns {string} The validated base URL
 */
export function getBaseUrl(): string {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  
  if (!baseUrl) {
    throw new Error(
      'NEXT_PUBLIC_BASE_URL is not defined. Please set it in your .env file.'
    );
  }
  
  return baseUrl;
}
