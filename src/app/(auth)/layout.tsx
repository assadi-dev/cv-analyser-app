/**
 * Auth layout — no sidebar, no topbar.
 * Redirects authenticated users to /analyser.
 */

import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth.api.getSession({ headers: await headers() })

  if (session) {
    redirect("/analyser")
  }

  return (
    <main className="min-h-screen">
      {children}
    </main>
  )
}
