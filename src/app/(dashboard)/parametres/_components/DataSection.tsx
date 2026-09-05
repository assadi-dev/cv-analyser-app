"use client"

import { Shield, Trash2 } from "lucide-react"
import { Card, CardHeader } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"

const DATA_ROWS = [
  { label: "Exporter mes données", sub: "Télécharger toutes vos analyses et candidatures — JSON ou CSV", actions: ["JSON", "CSV"], danger: false },
  { label: "Supprimer toutes les analyses", sub: "Efface l'historique des analyses IA sans toucher aux candidatures", actions: ["Supprimer"], danger: true },
  { label: "Réinitialiser l'application", sub: "Supprime toutes les données, analyses, candidatures et préférences. Irréversible.", actions: ["Réinitialiser"], danger: true },
] as const

interface DataSectionProps {
  onDeleteAccountRequest: () => void
}

export function DataSection({ onDeleteAccountRequest }: DataSectionProps) {
  return (
    <Card>
      <CardHeader icon={<Shield size={15} style={{ color: "var(--color-danger)" }} />}
        iconBg="var(--color-danger-light)" title="Données & Confidentialité"
        subtitle="Gérez vos données personnelles et les informations stockées" />
      <div className="flex flex-col gap-3">
        {DATA_ROWS.map((row) => (
          <div key={row.label}
            className="flex flex-col sm:flex-row sm:items-center gap-3 px-4 py-3 rounded-[10px] border"
            style={{
              background: row.danger ? "var(--color-danger-light)" : "var(--color-surface-muted)",
              borderColor: row.danger ? "#FECACA" : "var(--color-border)",
            }}>
            <div className="flex flex-col gap-0.5 flex-1 min-w-0">
              <span className="text-[13px] font-semibold" style={{ color: row.danger ? "var(--color-danger-text)" : "var(--color-text-secondary)" }}>{row.label}</span>
              <span className="text-[11px]" style={{ color: row.danger ? "#F87171" : "var(--color-text-subtle)" }}>{row.sub}</span>
            </div>
            <div className="flex gap-2 shrink-0">
              {row.actions.map((action) => (
                <Button key={action} variant={row.danger ? "danger" : "secondary"} size="sm">
                  {action}
                </Button>
              ))}
            </div>
          </div>
        ))}

        {/* Delete account */}
        <div
          className="flex flex-col sm:flex-row sm:items-center gap-3 px-4 py-4 rounded-[10px] border mt-2"
          style={{ background: "#FEF2F2", borderColor: "#FECACA" }}
        >
          <div className="w-9 h-9 rounded-md flex items-center justify-center shrink-0" style={{ background: "#FEE2E2" }}>
            <Trash2 size={16} style={{ color: "var(--color-danger-text)" }} />
          </div>
          <div className="flex flex-col gap-0.5 flex-1 min-w-0">
            <span className="text-[13px] font-semibold" style={{ color: "var(--color-danger-text)" }}>
              Supprimer mon compte
            </span>
            <span className="text-[11px]" style={{ color: "#F87171" }}>
              Supprime définitivement votre compte, toutes vos données et analyses. Cette action est irréversible.
            </span>
          </div>
          <Button variant="danger" size="sm" onClick={onDeleteAccountRequest}>
            Supprimer le compte
          </Button>
        </div>
      </div>
    </Card>
  )
}
