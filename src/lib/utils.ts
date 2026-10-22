import { clsx, type ClassValue } from "clsx";

/**
 * Merges conditional class names cleanly for shadcn/ui components.
 */
export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs);
}
