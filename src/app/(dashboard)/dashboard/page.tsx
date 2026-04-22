"use client"

import { useEffect, useState } from "react"
import { Plus, FolderOpen, Send, CalendarCheck, Star } from "lucide-react"
import { api } from "@/lib/api"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import { StatusBadge, ScoreBadge } from "@/components/ui/Badge"
import { cn, formatDate } from "@/lib/utils"
import type { CandidatureSummary, CandidatureStatus } from "@/types"

// ─── Kanban column config ─────────────────────────────────────────────────────

interface KanbanColumn {
  status:   CandidatureStatus
  label:    string
  bg:       string
  dotColor: string
  textColor:string
  countBg:  string
}

const COLUMNS: KanbanColumn[] = [
  { status: "to_send",   label: "À envoyer", bg: "var(--color-kanban-to-send)",   dotColor: "#64748B", textColor: "#374151", countBg: "#E2E8F0" },
  { status: "sent",      label: "Envoyée",   bg: "var(--color-kanban-sent)",      dotColor: "#3B82F6", textColor: "#1D4ED8", countBg: "#BFDBFE" },
  { status: "interview", label: "Entretien", bg: "var(--color-kanban-interview)", dotColor: "#8B5CF6", textColor: "#6D28D9", countBg: "#DDD6FE" },
  { status: "rejected",  label: "Refusée",   bg: "var(--color-kanban-rejected)",  dotColor: "#EF4444", textColor: "#B91C1C", countBg: "#FECACA" },
  { status: "accepted",  label: "Acceptée",  bg: "var(--color-kanban-accepted)",  dotColor: "#10B981", textColor: "#065F46", countBg: "#A7F3D0" },
]

// ─── Stats config ─────────────────────────────────────────────────────────────

function StatsCard({ icon: Icon, label, value, sub, iconBg, iconColor }: {
  icon: React.ElementType
  label: string
  value: string | number
  sub?: string
  iconBg: string
  iconColor: string
}) {
  return (
    <Card className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-[12px]" style={{ color: "var(--color-text-muted)" }}>{label}</span>
        <div className="w-8 h-8 rounded-[8px] flex items-center justify-center" style={{ background: iconBg }}>
          <Icon size={16} style={{ color: iconColor }} />
        </div>
      </div>
      <span className="text-[30px] font-black" style={{ color: "var(--color-text-primary)" }}>{value}</span>
      {sub && <span className="text-[11px]" style={{ color: sub.includes("cours") ? "var(--color-success-text)" : "var(--color-text-subtle)" }}>{sub}</span>}
    </Card>
  )
}

// ─── Candidature card ─────────────────────────────────────────────────────────

function CandidatureCard({ item, onStatusChange }: {
  item: CandidatureSummary
  onStatusChange: (id: string, status: CandidatureStatus) => void
}) {
  return (
    <div
      className="flex flex-col gap-2 p-3 rounded-[10px] bg-white border cursor-pointer hover:shadow-md transition-shadow"
      style={{ borderColor: "var(--color-border)" }}
    >
      <div className="flex items-center gap-2">
        <div
          className="w-[30px] h-[30px] rounded-[6px] flex items-center justify-center shrink-0 text-[13px] font-bold"
          style={{ background: "var(--color-primary-light)", color: "var(--color-primary)" }}
        >
          {item.company_name[0]?.toUpperCase()}
        </div>
        <div className="min-w-0">
          <p className="text-[12px] font-bold truncate" style={{ color: "var(--color-text-primary)" }}>
            {item.company_name}
          </p>
          <p className="text-[11px] truncate" style={{ color: "var(--color-text-muted)" }}>
            {item.job_title}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-1.5">
        <span className="text-[10px]" style={{ color: "var(--color-text-subtle)" }}>{formatDate(item.created_at)}</span>
        <div className="flex-1" />
        <button
          className="text-[10px] font-semibold px-2 py-0.5 rounded-[6px]"
          style={{ background: "var(--color-primary-light)", color: "var(--color-primary)" }}
        >
          Revoir
        </button>
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const [candidatures, setCandidatures] = useState<CandidatureSummary[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get<{ items: CandidatureSummary[] }>("/api/v1/candidatures?page_size=100")
      .then((data) => setCandidatures(data.items))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const byStatus = (status: CandidatureStatus) =>
    candidatures.filter((c) => c.status === status)

  const stats = {
    total:     candidatures.length,
    sent:      candidatures.filter((c) => c.status !== "to_send").length,
    interview: byStatus("interview").length,
  }

  const handleStatusChange = async (id: string, status: CandidatureStatus) => {
    await api.patch(`/api/v1/candidatures/${id}/status`, { status })
    setCandidatures((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status } : c))
    )
  }

  return (
    <div className="flex flex-col gap-6 p-8">

      {/* ── Stats row ── */}
      <div className="grid grid-cols-4 gap-4">
        <StatsCard icon={FolderOpen}    label="Offres enregistrées"     value={stats.total}      sub="offres analysées"     iconBg="var(--color-primary-light)"  iconColor="var(--color-primary)" />
        <StatsCard icon={Send}          label="Candidatures envoyées"   value={stats.sent}       sub={`sur ${stats.total} offres`} iconBg="var(--color-info-light)" iconColor="var(--color-info-text)" />
        <StatsCard icon={CalendarCheck} label="Entretiens obtenus"      value={stats.interview}  sub="en cours"             iconBg="var(--color-success-light)" iconColor="var(--color-success-text)" />
        <StatsCard icon={Star}          label="Score moyen"             value="—"                sub="de compatibilité"     iconBg="var(--color-warning-light)" iconColor="var(--color-warning-text)" />
      </div>

      {/* ── Kanban header ── */}
      <div className="flex items-center gap-3">
        <h2 className="text-[15px] font-bold" style={{ color: "var(--color-text-primary)" }}>
          Suivi des candidatures
        </h2>
        <span className="px-3 py-1 rounded-full text-[11px] font-semibold"
          style={{ background: "var(--color-surface-muted)", color: "var(--color-text-muted)" }}>
          {stats.total} candidatures
        </span>
        <div className="flex-1" />
        <Button size="sm" onClick={() => {/* open modal */}}>
          <Plus size={14} /> Nouvelle analyse
        </Button>
      </div>

      {/* ── Kanban board ── */}
      <div className="grid grid-cols-5 gap-3">
        {COLUMNS.map((col) => {
          const items = byStatus(col.status)
          return (
            <div
              key={col.status}
              className="flex flex-col gap-2.5 p-3 rounded-[12px] min-h-[400px]"
              style={{ background: col.bg }}
            >
              {/* Column header */}
              <div className="flex items-center gap-2 pb-1">
                <span className="w-2 h-2 rounded-full shrink-0" style={{ background: col.dotColor }} />
                <span className="text-[12px] font-bold" style={{ color: col.textColor }}>
                  {col.label}
                </span>
                <span className="ml-auto px-2 py-0.5 rounded-full text-[10px] font-bold"
                  style={{ background: col.countBg, color: col.textColor }}>
                  {items.length}
                </span>
              </div>

              {/* Cards */}
              {loading ? (
                <div className="flex flex-col gap-2">
                  {[1, 2].map((i) => (
                    <div key={i} className="h-[70px] rounded-[10px] bg-white/60 animate-pulse" />
                  ))}
                </div>
              ) : (
                items.map((item) => (
                  <CandidatureCard key={item.id} item={item} onStatusChange={handleStatusChange} />
                ))
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
