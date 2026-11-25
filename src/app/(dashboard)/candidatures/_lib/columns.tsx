import { type ColumnDef } from "@tanstack/react-table"
import { StatusBadge } from "@/components/ui/Badge"
import { formatDate } from "@/lib/utils"
import type { CandidatureSummary } from "@/types"
import { CandidatureRowActions } from "../_components/CandidaturesTable/CandidatureRowActions"

interface ColumnCallbacks {
  onDelete: (id: string) => void
  onView: (id: string) => void
  onEdit: (id: string) => void
  onAnalyse: (id: string) => void
}

export function createColumns({
  onDelete,
  onView,
  onEdit,
  onAnalyse,
}: ColumnCallbacks): ColumnDef<CandidatureSummary>[] {
  return [
    {
      id: "company",
      header: "Entreprise",
      cell: ({ row }) => {
        const item = row.original
        return (
          <div className="flex items-center gap-2.5">
            <div
              className="w-[34px] h-[34px] rounded-[8px] flex items-center justify-center shrink-0 text-[14px] font-bold"
              style={{ background: "var(--color-primary-light)", color: "var(--color-primary)" }}
            >
              {item.company_name[0]?.toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-[13px] font-bold truncate" style={{ color: "var(--color-text-primary)" }}>
                {item.company_name}
              </p>
              <p className="text-[11px] truncate" style={{ color: "var(--color-text-subtle)" }}>
                {item.work_mode}
              </p>
            </div>
          </div>
        )
      },
    },
    {
      id: "job",
      header: "Poste",
      cell: ({ row }) => {
        const item = row.original
        return (
          <div className="min-w-0">
            <p className="text-[13px] font-medium truncate" style={{ color: "var(--color-text-secondary)" }}>
              {item.job_title}
            </p>
            <p className="text-[11px] truncate" style={{ color: "var(--color-text-subtle)" }}>
              {item.contract_type}
            </p>
          </div>
        )
      },
    },
    {
      id: "score",
      header: "Score",
      cell: () => (
        <span className="text-[12px]" style={{ color: "var(--color-text-subtle)" }}>—</span>
      ),
    },
    {
      id: "ats",
      header: "ATS",
      cell: () => (
        <span className="text-[12px]" style={{ color: "var(--color-text-subtle)" }}>—</span>
      ),
    },
    {
      id: "date",
      header: "Date",
      cell: ({ row }) => (
        <span className="text-[12px]" style={{ color: "var(--color-text-muted)" }}>
          {formatDate(row.original.created_at)}
        </span>
      ),
    },
    {
      id: "status",
      header: "Statut",
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      id: "actions",
      header: () => <span className="block text-center">Actions</span>,
      cell: ({ row }) => (
        <CandidatureRowActions
          id={row.original.id}
          onView={onView}
          onEdit={onEdit}
          onAnalyse={onAnalyse}
          onDelete={onDelete}
        />
      ),
    },
  ]
}
