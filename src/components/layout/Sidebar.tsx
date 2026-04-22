"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Search,
  LayoutDashboard,
  Briefcase,
  Settings,
  ChevronRight,
} from "lucide-react"
import { cn, getInitials } from "@/lib/utils"
import { useSession } from "@/lib/auth-client"

const NAV_ITEMS = [
  { href: "/analyser",     label: "Analyser CV",    icon: Search },
  { href: "/dashboard",    label: "Dashboard",      icon: LayoutDashboard },
  { href: "/candidatures", label: "Candidatures",   icon: Briefcase },
  { href: "/parametres",   label: "Paramètres",     icon: Settings },
] as const

export function Sidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const user = session?.user

  return (
    <aside
      className="fixed left-0 top-0 h-screen flex flex-col py-7 px-4 gap-1.5 scrollbar-thin overflow-y-auto z-30"
      style={{
        width: "var(--spacing-sidebar)",
        background: "var(--color-sidebar)",
      }}
    >
      {/* ── Logo ── */}
      <div className="flex items-center gap-2.5 pb-5 px-1">
        <div
          className="w-9 h-9 rounded-[9px] flex items-center justify-center shrink-0 bg-gradient-primary-diagonal"
        >
          <span className="text-white font-black text-lg">M</span>
        </div>
        <span className="text-[var(--color-text-on-dark)] font-bold text-[15px]">
          MatchCV
        </span>
      </div>

      {/* ── Nav label ── */}
      <span
        className="text-[9px] font-bold tracking-[1.5px] px-2 py-1"
        style={{ color: "var(--color-text-subtle)" }}
      >
        NAVIGATION
      </span>

      {/* ── Nav items ── */}
      <nav className="flex flex-col gap-1">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(`${href}/`)
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-2.5 h-[42px] rounded-[10px] px-3.5 text-[13px] transition-all",
                active
                  ? "bg-gradient-primary text-white font-semibold"
                  : "text-[var(--color-text-subtle)] hover:bg-[var(--color-surface-dark-2)]",
              )}
            >
              <Icon size={16} />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* ── Spacer ── */}
      <div className="flex-1" />

      {/* ── User section ── */}
      <div
        className="flex items-center gap-2.5 h-[52px] rounded-[10px] px-3"
        style={{ background: "var(--color-surface-dark)" }}
      >
        <div className="w-[34px] h-[34px] rounded-full shrink-0 flex items-center justify-center bg-gradient-primary-diagonal">
          {user?.image ? (
            <img src={user.image} alt="" className="w-full h-full rounded-full object-cover" />
          ) : (
            <span className="text-white text-[13px] font-bold">
              {getInitials(user?.name ?? "U")}
            </span>
          )}
        </div>
        <div className="flex flex-col gap-0.5 min-w-0">
          <span className="text-(--color-text-on-dark) text-[12px] font-semibold truncate">
            {user?.name ?? "Utilisateur"}
          </span>
          <span className="text-text-subtle text-[10px] truncate">
            Candidat actif
          </span>
        </div>
        <ChevronRight size={14} className="ml-auto shrink-0" style={{ color: "var(--color-text-subtle)" }} />
      </div>
    </aside>
  )
}
