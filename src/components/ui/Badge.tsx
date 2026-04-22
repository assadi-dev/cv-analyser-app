import { cn } from "@/lib/utils"
import type { CandidatureStatus } from "@/types"

type BadgeVariant = "success" | "warning" | "danger" | "info" | "purple" | "neutral"

interface BadgeProps {
  variant?: BadgeVariant
  children: React.ReactNode
  dot?: boolean
  className?: string
}

const VARIANT_STYLES: Record<BadgeVariant, string> = {
  success: "bg-[var(--color-success-light)] text-[var(--color-success-text)]",
  warning: "bg-[var(--color-warning-light)] text-[var(--color-warning-text)]",
  danger:  "bg-[var(--color-danger-light)]  text-[var(--color-danger-text)]",
  info:    "bg-[var(--color-info-light)]    text-[var(--color-info-text)]",
  purple:  "bg-[var(--color-primary-light)] text-[var(--color-primary)]",
  neutral: "bg-[var(--color-surface-muted)] text-[var(--color-text-muted)]",
}

const DOT_STYLES: Record<BadgeVariant, string> = {
  success: "bg-[var(--color-success)]",
  warning: "bg-[var(--color-warning)]",
  danger:  "bg-[var(--color-danger)]",
  info:    "bg-[var(--color-info)]",
  purple:  "bg-[var(--color-primary)]",
  neutral: "bg-[var(--color-text-muted)]",
}

export function Badge({ variant = "neutral", children, dot, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold",
        VARIANT_STYLES[variant],
        className,
      )}
    >
      {dot && <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", DOT_STYLES[variant])} />}
      {children}
    </span>
  )
}

// ─── Score badge ──────────────────────────────────────────────────────────────

export function ScoreBadge({ score }: { score: number }) {
  const variant: BadgeVariant = score >= 80 ? "success" : score >= 60 ? "warning" : "neutral"
  return <Badge variant={variant}>{score}%</Badge>
}

// ─── Status badge ─────────────────────────────────────────────────────────────

const STATUS_MAP: Record<CandidatureStatus, { label: string; variant: BadgeVariant }> = {
  to_send:   { label: "À envoyer",  variant: "neutral" },
  sent:      { label: "Envoyée",    variant: "info" },
  interview: { label: "Entretien",  variant: "purple" },
  rejected:  { label: "Refusée",    variant: "danger" },
  accepted:  { label: "Acceptée",   variant: "success" },
}

export function StatusBadge({ status }: { status: CandidatureStatus }) {
  const { label, variant } = STATUS_MAP[status]
  return <Badge variant={variant} dot>{label}</Badge>
}
