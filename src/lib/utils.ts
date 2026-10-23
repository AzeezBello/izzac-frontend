import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges conditional class names and resolves Tailwind conflicts so that
 * consumer `className` overrides primitive defaults predictably.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/** Zero-pads a 1-based index for editorial ledger numbering ("01", "02"). */
export function pad(index: number): string {
  return String(index).padStart(2, "0");
}
