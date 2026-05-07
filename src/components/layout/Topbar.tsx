"use client"

import { usePathname, useRouter } from "next/navigation"
import { useState, useRef, useEffect } from "react"
import { getInitials } from "@/lib/utils"
import { signOut } from "@/lib/auth-client"

const PAGE_TITLES: Record<string, { title: string; subtitle: string }> = {
  "/analyser": { title: "Analyser votre CV", subtitle: "Comparez votre CV avec une offre et obtenez votre score IA" },
  "/dashboard": { title: "Dashboard", subtitle: "Suivi de ta recherche d'emploi" },
  "/candidatures": { title: "Mes Candidatures", subtitle: "Retrouve toutes tes candidatures et leur statut" },
  "/parametres": { title: "Paramètres", subtitle: "Configurez votre expérience MatchCV" },
}

interface TopbarProps {
  user: { name?: string | null; email: string; image?: string | null }
}

export function Topbar({ user }: TopbarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const page = PAGE_TITLES[pathname] ?? { title: "MatchCV", subtitle: "" }
  const [open, setOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)



  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside)
    }
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [open])

  async function handleSignOut() {
    await signOut()
    router.push("/login")
  }

  return (
    <header
      className="flex items-center px-8 shrink-0 border-b"
      style={{
        height: "var(--spacing-topbar)",
        background: "var(--color-surface)",
        borderColor: "var(--color-border)",
      }}
    >
      {/* Page title */}
      <div className="flex flex-col gap-0.5">
        <h1 className="text-[22px] font-extrabold" style={{ color: "var(--color-text-primary)" }}>
          {page.title}
        </h1>
        {page.subtitle && (
          <p className="text-[13px]" style={{ color: "var(--color-text-muted)" }}>
            {page.subtitle}
          </p>
        )}
      </div>

      <div className="flex-1" />

      {/* User menu */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-2.5 rounded-full pl-1 pr-3 py-1 cursor-pointer hover:opacity-80 transition-opacity focus:outline-none"
          style={{ background: "var(--color-surface-raised, transparent)" }}
          aria-haspopup="true"
          aria-expanded={open}
        >
          <div className="w-9 h-9 rounded-full flex items-center justify-center bg-gradient-primary-diagonal shrink-0">
            {user.image ? (
              <img src={user.image} alt="" className="w-full h-full rounded-full object-cover" />
            ) : (
              <span className="text-white text-[13px] font-bold">
                {getInitials(user.name ?? user.email)}
              </span>
            )}
          </div>
          <span className="text-[13px] font-semibold hidden sm:block" style={{ color: "var(--color-text-primary)" }}>
            {user.name ?? user.email}
          </span>
        </button>

        {open && (
          <div
            className="absolute right-0 mt-2 min-w-[200px] rounded-xl border shadow-lg z-50 overflow-hidden"
            style={{
              background: "var(--color-surface)",
              borderColor: "var(--color-border)",
            }}
          >
            <div className="px-4 py-3 border-b" style={{ borderColor: "var(--color-border)" }}>
              <p className="text-[13px] font-semibold truncate" style={{ color: "var(--color-text-primary)" }}>
                {user.name ?? "Utilisateur"}
              </p>
              <p className="text-[12px] truncate" style={{ color: "var(--color-text-muted)" }}>
                {user.email}
              </p>
            </div>
            <div className="p-1">
              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-[13px] font-medium transition-colors hover:bg-red-50 text-red-600 hover:text-red-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                Déconnexion
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
