import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/** Merges Tailwind CSS classes with conflict resolution. */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}

/** Returns score color class based on threshold. */
export function scoreColor(score: number): "success" | "warning" | "danger" {
  if (score >= 80) return "success"
  if (score >= 60) return "warning"
  return "danger"
}

/** Formats a date string to French locale. */
export function formatDate(date: string): string {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(date))
}

/** Returns initials from a name string. */
export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}
