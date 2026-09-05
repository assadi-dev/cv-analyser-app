"use client"

import { FileText, Star } from "lucide-react"
import { Card, CardHeader } from "@/components/ui/Card"
import { useCvs } from "../_hooks/useCvs"

function formatSize(kb: number): string {
  return kb >= 1024 ? `${(kb / 1024).toFixed(1)} Mo` : `${kb} Ko`
}

export function CvsSection() {
  const { cvs, isLoading } = useCvs()

  return (
    <Card>
      <CardHeader icon={<FileText size={15} style={{ color: "var(--color-primary)" }} />} title="Mes CV"
        subtitle="Les CV importés depuis vos candidatures et analyses" />

      {isLoading ? (
        <div className="h-24 rounded-[10px] animate-pulse" style={{ background: "var(--color-surface-muted)" }} />
      ) : cvs.length === 0 ? (
        <p className="text-[12px]" style={{ color: "var(--color-text-subtle)" }}>
          Aucun CV importé pour le moment.
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          {cvs.map((cv) => (
            <div
              key={cv.id}
              className="flex items-center gap-3 h-14 px-4 rounded-[10px] border"
              style={{ background: "var(--color-surface-muted)", borderColor: "var(--color-border)" }}
            >
              <div className="w-9 h-9 rounded-md flex items-center justify-center shrink-0" style={{ background: "var(--color-primary-light)" }}>
                <FileText size={16} style={{ color: "var(--color-primary)" }} />
              </div>
              <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                <span className="text-[13px] font-semibold truncate" style={{ color: "var(--color-text-secondary)" }}>
                  {cv.name}
                </span>
                <span className="text-[11px]" style={{ color: "var(--color-text-subtle)" }}>
                  {formatSize(cv.file_size_kb)} · {cv.mime_type}
                </span>
              </div>
              {cv.is_default && (
                <span className="flex items-center gap-1 shrink-0 px-2 py-1 rounded-full text-[10px] font-semibold"
                  style={{ background: "var(--color-primary-light)", color: "var(--color-primary)" }}>
                  <Star size={10} /> Par défaut
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}
