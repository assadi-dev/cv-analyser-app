import type { CandidatureStatus } from "@/types"

/**
 * Visual definition of each board column.
 *
 * Tailwind classes rather than inline styles: CLAUDE.md forbids inline CSS,
 * and Dice UI composes through `className` — fighting it with `style` props
 * would also break its drag states.
 *
 * Classes are written in full because Tailwind scans source text: a
 * constructed name like `bg-${color}-50` is never emitted.
 *
 * The surfaces come from the `--color-kanban-*` tokens of globals.css, the
 * palette the project already declared for this board. `border-transparent`
 * is deliberate: Dice UI's column ships a bare `border`, which in Tailwind v4
 * means 1px of `currentColor` — a near-black outline around every column. It
 * only sets the width, so declaring the colour here neutralises it without
 * touching the component.
 */
export interface BoardColumnConfig {
  status: CandidatureStatus
  label: string
  surface: string
  dot: string
  text: string
  badge: string
}

export const BOARD_COLUMNS: BoardColumnConfig[] = [
  {
    status: "to_send",
    label: "À envoyer",
    surface: "border-transparent bg-kanban-to-send",
    dot: "bg-slate-500",
    text: "text-slate-700",
    badge: "bg-slate-200 text-slate-700",
  },
  {
    status: "sent",
    label: "Envoyée",
    surface: "border-transparent bg-kanban-sent",
    dot: "bg-blue-500",
    text: "text-blue-700",
    badge: "bg-blue-200 text-blue-800",
  },
  {
    status: "interview",
    label: "Entretien",
    surface: "border-transparent bg-kanban-interview",
    dot: "bg-violet-500",
    text: "text-violet-700",
    badge: "bg-violet-200 text-violet-800",
  },
  {
    status: "rejected",
    label: "Refusée",
    surface: "border-transparent bg-kanban-rejected",
    dot: "bg-red-500",
    text: "text-red-700",
    badge: "bg-red-200 text-red-800",
  },
  {
    status: "accepted",
    label: "Acceptée",
    surface: "border-transparent bg-kanban-accepted",
    dot: "bg-emerald-500",
    text: "text-emerald-700",
    badge: "bg-emerald-200 text-emerald-800",
  },
]
