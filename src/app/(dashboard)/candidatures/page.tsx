"use client"

import { useEffect, useState } from "react"
import { Plus, Search, SlidersHorizontal, ArrowUpDown, Eye, Trash2 } from "lucide-react"
import { api } from "@/lib/api"
import { Button } from "@/components/ui/Button"
import { StatusBadge, ScoreBadge } from "@/components/ui/Badge"
import { cn, formatDate } from "@/lib/utils"
import type { CandidatureSummary, CandidatureStatus, PaginatedResponse } from "@/types"

const STATUS_TABS: { value: CandidatureStatus | "all"; label: string }[] = [
  { value: "all",       label: "Toutes" },
  { value: "to_send",   label: "À envoyer" },
  { value: "sent",      label: "Envoyée" },
  { value: "interview", label: "Entretien" },
  { value: "accepted",  label: "Acceptée" },
]

export default function CandidaturesPage() {
  const [candidatures, setCandidatures] = useState<CandidatureSummary[]>([])
  const [total, setTotal]       = useState(0)
  const [search, setSearch]     = useState("")
  const [activeTab, setActiveTab] = useState<CandidatureStatus | "all">("all")
  const [loading, setLoading]   = useState(true)
  const [page, setPage]         = useState(1)
  const PAGE_SIZE = 10

  useEffect(() => {
    setLoading(true)
    const params = new URLSearchParams({
      page: String(page),
      page_size: String(PAGE_SIZE),
      ...(activeTab !== "all" ? { status: activeTab } : {}),
    })
    api.get<PaginatedResponse<CandidatureSummary>>(`/api/v1/candidatures?${params}`)
      .then((data) => { setCandidatures(data.items); setTotal(data.total) })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [page, activeTab])

  const filtered = search
    ? candidatures.filter((c) =>
        c.company_name.toLowerCase().includes(search.toLowerCase()) ||
        c.job_title.toLowerCase().includes(search.toLowerCase())
      )
    : candidatures

  async function handleDelete(id: string) {
    if (!confirm("Supprimer cette candidature ?")) return
    await api.delete(`/api/v1/candidatures/${id}`)
    setCandidatures((prev) => prev.filter((c) => c.id !== id))
    setTotal((t) => t - 1)
  }

  return (
    <div className="flex flex-col gap-5 p-8">

      {/* ── Header ── */}
      <div className="flex items-center gap-3">
        <div className="flex-1" />
        <Button size="sm">
          <Plus size={14} /> Ajouter
        </Button>
      </div>

      {/* ── Filter bar ── */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="flex items-center gap-2 flex-1 h-[42px] px-3.5 rounded-[10px] border"
          style={{ background: "white", borderColor: "var(--color-border)" }}>
          <Search size={16} style={{ color: "var(--color-text-subtle)" }} />
          <input
            className="flex-1 text-[13px] outline-none bg-transparent placeholder:text-[var(--color-text-subtle)]"
            placeholder="Rechercher une entreprise, un poste..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ color: "var(--color-text-secondary)" }}
          />
        </div>
        <Button variant="ghost" size="md">
          <ArrowUpDown size={14} /> Trier par date
        </Button>
        <Button variant="ghost" size="md">
          <SlidersHorizontal size={14} /> Filtres
        </Button>
      </div>

      {/* ── Status tabs ── */}
      <div className="flex items-center gap-1.5 flex-wrap">
        {STATUS_TABS.map((tab) => {
          const active = activeTab === tab.value
          return (
            <button
              key={tab.value}
              onClick={() => { setActiveTab(tab.value); setPage(1) }}
              className={cn(
                "flex items-center gap-2 px-4 py-1.5 rounded-[8px] text-[13px] transition-colors",
                active
                  ? "bg-[var(--color-primary)] text-white font-semibold"
                  : "bg-white border border-[var(--color-border)] text-[var(--color-text-muted)] hover:bg-[var(--color-surface-muted)]"
              )}
            >
              {tab.label}
              {tab.value === "all" && (
                <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-bold",
                  active ? "bg-white/20 text-white" : "bg-[var(--color-surface-muted)] text-[var(--color-text-muted)]"
                )}>{total}</span>
              )}
            </button>
          )
        })}
      </div>

      {/* ── Table ── */}
      <div className="rounded-[14px] border overflow-hidden shadow-[var(--shadow-card)]"
        style={{ borderColor: "var(--color-border)", background: "white" }}>

        {/* Table header */}
        <div className="grid text-[11px] font-bold tracking-wide h-11 px-5 items-center border-b"
          style={{ gridTemplateColumns: "220px 1fr 110px 110px 120px 140px 80px", borderColor: "var(--color-border)", background: "var(--color-surface-muted)", color: "var(--color-text-subtle)" }}>
          <span>Entreprise</span>
          <span>Poste</span>
          <span>Score</span>
          <span>ATS</span>
          <span>Date</span>
          <span>Statut</span>
          <span className="text-center">Actions</span>
        </div>

        {/* Rows */}
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-16 border-b animate-pulse" style={{ borderColor: "var(--color-border-muted)", background: i % 2 ? "var(--color-surface-muted)" : "white" }} />
          ))
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 gap-2" style={{ color: "var(--color-text-subtle)" }}>
            <Search size={32} className="opacity-30" />
            <p className="text-[13px]">Aucune candidature trouvée</p>
          </div>
        ) : (
          filtered.map((item, i) => (
            <div
              key={item.id}
              className="grid h-16 px-5 items-center border-b hover:bg-[var(--color-surface-muted)] transition-colors"
              style={{ gridTemplateColumns: "220px 1fr 110px 110px 120px 140px 80px", borderColor: "var(--color-border-muted)", background: i % 2 === 1 ? "var(--color-surface-muted)" : "white" }}
            >
              {/* Company */}
              <div className="flex items-center gap-2.5">
                <div className="w-[34px] h-[34px] rounded-[8px] flex items-center justify-center shrink-0 text-[14px] font-bold"
                  style={{ background: "var(--color-primary-light)", color: "var(--color-primary)" }}>
                  {item.company_name[0]?.toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="text-[13px] font-bold truncate" style={{ color: "var(--color-text-primary)" }}>{item.company_name}</p>
                  <p className="text-[11px] truncate" style={{ color: "var(--color-text-subtle)" }}>{item.work_mode}</p>
                </div>
              </div>

              {/* Job */}
              <div className="min-w-0">
                <p className="text-[13px] font-medium truncate" style={{ color: "var(--color-text-secondary)" }}>{item.job_title}</p>
                <p className="text-[11px] truncate" style={{ color: "var(--color-text-subtle)" }}>{item.contract_type}</p>
              </div>

              {/* Score — no analyse yet */}
              <span className="text-[12px]" style={{ color: "var(--color-text-subtle)" }}>—</span>
              <span className="text-[12px]" style={{ color: "var(--color-text-subtle)" }}>—</span>

              {/* Date */}
              <span className="text-[12px]" style={{ color: "var(--color-text-muted)" }}>{formatDate(item.created_at)}</span>

              {/* Status */}
              <StatusBadge status={item.status} />

              {/* Actions */}
              <div className="flex items-center gap-2 justify-center">
                <button className="w-7 h-7 rounded-[6px] flex items-center justify-center hover:opacity-80 transition-opacity"
                  style={{ background: "var(--color-primary-light)" }}>
                  <Eye size={13} style={{ color: "var(--color-primary)" }} />
                </button>
                <button
                  className="w-7 h-7 rounded-[6px] flex items-center justify-center hover:opacity-80 transition-opacity"
                  style={{ background: "var(--color-surface-muted)" }}
                  onClick={() => handleDelete(item.id)}
                >
                  <Trash2 size={13} style={{ color: "var(--color-text-subtle)" }} />
                </button>
              </div>
            </div>
          ))
        )}

        {/* Pagination */}
        <div className="flex items-center gap-3 px-5 h-[52px] border-t" style={{ borderColor: "var(--color-border)" }}>
          <span className="text-[12px]" style={{ color: "var(--color-text-muted)" }}>
            Affichage {Math.min((page - 1) * PAGE_SIZE + 1, total)}–{Math.min(page * PAGE_SIZE, total)} sur {total} candidatures
          </span>
          <div className="flex-1" />
          <button
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-[8px] text-[12px] border disabled:opacity-40"
            style={{ borderColor: "var(--color-border)", color: "var(--color-text-muted)" }}
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Précédent
          </button>
          {Array.from({ length: Math.ceil(total / PAGE_SIZE) }, (_, i) => i + 1).slice(0, 5).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={cn("w-8 h-8 rounded-[8px] text-[12px] font-semibold transition-colors",
                p === page
                  ? "bg-[var(--color-primary)] text-white"
                  : "text-[var(--color-text-muted)] hover:bg-[var(--color-surface-muted)]"
              )}
            >
              {p}
            </button>
          ))}
          <button
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-[8px] text-[12px] border disabled:opacity-40"
            style={{ borderColor: "var(--color-border)", color: "var(--color-text-muted)" }}
            disabled={page * PAGE_SIZE >= total}
            onClick={() => setPage((p) => p + 1)}
          >
            Suivant
          </button>
        </div>
      </div>
    </div>
  )
}
