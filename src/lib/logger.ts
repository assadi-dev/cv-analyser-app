const isDev = process.env.NODE_ENV === "development"

export function logError(error: unknown, context?: string): void {
  if (!isDev) return
  if (context) {
    console.error(`[${context}]`, error)
  } else {
    console.error(error)
  }
}
