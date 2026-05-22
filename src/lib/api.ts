/**
 * FastAPI client with automatic JWT token injection.
 *
 * Flow:
 * 1. After login, exchangeToken() is called once to get a FastAPI API token.
 * 2. The token is stored in localStorage.
 * 3. All subsequent requests use apiFetch() which injects the token automatically.
 */

import type { ApiError } from "@/types"

const API_APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"
const TOKEN_KEY = "jobmatch_api_token"

// ─────────────────────────────────────────────────────────────────────────────
// Token management
// ─────────────────────────────────────────────────────────────────────────────

export function getApiToken(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem(TOKEN_KEY)
}

export function setApiToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token)
}

export function clearApiToken(): void {
  localStorage.removeItem(TOKEN_KEY)
}

// ─────────────────────────────────────────────────────────────────────────────
// Token exchange — called ONCE after better-auth login
// ─────────────────────────────────────────────────────────────────────────────

export async function exchangeToken(sessionToken: string): Promise<string> {
  const res = await fetch(`${API_URL}/api/v1/auth/token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ session_token: sessionToken }),
  })

  if (!res.ok) {
    const error: ApiError = await res.json()
    throw new Error(error.error.message)
  }

  const data: { api_token: string } = await res.json()
  //setApiToken(data.api_token)
  return data.api_token
}

// ─────────────────────────────────────────────────────────────────────────────
// Base fetch wrapper
// ─────────────────────────────────────────────────────────────────────────────

export class ApiRequestError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
    public readonly requestId?: string,
  ) {
    super(message)
    this.name = "ApiRequestError"
  }
}

type FetchOptions = Omit<RequestInit, "headers"> & {
  headers?: Record<string, string>
}

export async function apiFetch<T>(
  path: string,
  options: FetchOptions = {},
): Promise<T> {


  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...options.headers,
  }


  const res = await fetch(`${API_APP_URL}${path}`, {
    ...options,
    headers,
  })

  if (!res.ok) {
    const errorData: ApiError = await res.json().catch(() => ({
      error: { code: "UNKNOWN", message: res.statusText, context: {} },
      request_id: "",
    }))

    // Token expired — clear it and redirect to login
    if (res.status === 401) {
      clearApiToken()
      if (typeof window !== "undefined") {
        window.location.href = "/login"
      }
    }

    throw new ApiRequestError(
      res.status,
      errorData.error.code,
      errorData.error.message,
      errorData.request_id,
    )
  }

  // Handle 204 No Content
  if (res.status === 204) return undefined as T

  return res.json() as Promise<T>
}

export async function apiExternalFetch<T>(
  path: string,
  options: FetchOptions = {},
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...options.headers,
  }


  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  })

  if (!res.ok) {
    const errorData: ApiError = await res.json().catch(() => ({
      error: { code: "UNKNOWN", message: res.statusText, context: {} },
      request_id: "",
    }))

    // Token expired — clear it and redirect to login
    /*     if (res.status === 401) {
          clearApiToken()
          if (typeof window !== "undefined") {
            window.location.href = "/login"
          }
        } */

    throw new ApiRequestError(
      res.status,
      errorData.error.code,
      errorData.error.message,
      errorData.request_id,
    )
  }

  // Handle 204 No Content
  if (res.status === 204) return undefined as T

  return res.json() as Promise<T>
}

export async function apiExternalFetchMultipart(
  path: string,
  body: FormData,
  options: FetchOptions = {},
): Promise<Response> {
  const headers: Record<string, string> = {
    ...options.headers,
  }


  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
    body,
  })

  if (!res.ok) {
    const errorData: ApiError = await res.json().catch(() => ({
      error: { code: "UNKNOWN", message: res.statusText, context: {} },
      request_id: "",
    }))


    throw new ApiRequestError(
      res.status,
      errorData.error.code,
      errorData.error.message,
      errorData.request_id,
    )
  }



  return res
}

// ─────────────────────────────────────────────────────────────────────────────
// Typed API helpers
// ─────────────────────────────────────────────────────────────────────────────

export const api = {
  get: <T>(path: string) => apiFetch<T>(path),

  post: <T>(path: string, body: unknown) =>
    apiFetch<T>(path, { method: "POST", body: JSON.stringify(body) }),

  patch: <T>(path: string, body: unknown) =>
    apiFetch<T>(path, { method: "PATCH", body: JSON.stringify(body) }),

  put: <T>(path: string, body: unknown) =>
    apiFetch<T>(path, { method: "PUT", body: JSON.stringify(body) }),

  delete: <T>(path: string, body?: unknown) =>
    apiFetch<T>(path, { method: "DELETE", body: body ? JSON.stringify(body) : undefined }),

  upload: <T>(path: string, formData: FormData) =>
    apiFetch<T>(path, {
      method: "POST",
      body: formData,
      headers: {}, // Let browser set Content-Type with boundary
    }),
}


export const apiExternal = {
  get: <T>(path: string, options?: FetchOptions) => apiExternalFetch<T>(path, options),

  post: <T>(path: string, body: unknown, options?: FetchOptions) =>
    apiExternalFetch<T>(path, { method: "POST", body: JSON.stringify(body), ...options }),
  multipart: (path: string, body: FormData, options?: FetchOptions) =>
    apiExternalFetchMultipart(path, body, options),

  patch: <T>(path: string, body: unknown, options?: FetchOptions) =>
    apiExternalFetch<T>(path, { method: "PATCH", body: JSON.stringify(body), ...options }),

  put: <T>(path: string, body: unknown, options?: FetchOptions) =>
    apiExternalFetch<T>(path, { method: "PUT", body: JSON.stringify(body), ...options }),

  delete: <T>(path: string, options?: FetchOptions) =>
    apiExternalFetch<T>(path, { method: "DELETE", ...options }),

  upload: <T>(path: string, formData: FormData, options?: FetchOptions) =>
    apiExternalFetch<T>(path, {
      method: "POST",
      body: formData,
      headers: {}, // Let browser set Content-Type with boundary
      ...options
    }),
}