/**
 * Dashboard layout — sidebar + topbar.
 * Redirects unauthenticated users to /login.
 */

import { redirect } from "next/navigation"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { Sidebar } from "@/components/layout/Sidebar"
import { Topbar } from "@/components/layout/Topbar"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session) {
    redirect("/login")
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--color-bg)]">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden" style={{ marginLeft: "var(--spacing-sidebar)" }}>
        <Topbar user={session.user} />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
