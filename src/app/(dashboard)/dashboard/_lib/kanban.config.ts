import type { KanbanColumnConfig } from "../_types"

export const KANBAN_COLUMNS: KanbanColumnConfig[] = [
  {
    status: "to_send",
    label: "À envoyer",
    bg: "var(--color-kanban-to-send)",
    dotColor: "#64748B",
    textColor: "#374151",
    countBg: "#E2E8F0",
  },
  {
    status: "sent",
    label: "Envoyée",
    bg: "var(--color-kanban-sent)",
    dotColor: "#3B82F6",
    textColor: "#1D4ED8",
    countBg: "#BFDBFE",
  },
  {
    status: "interview",
    label: "Entretien",
    bg: "var(--color-kanban-interview)",
    dotColor: "#8B5CF6",
    textColor: "#6D28D9",
    countBg: "#DDD6FE",
  },
  {
    status: "rejected",
    label: "Refusée",
    bg: "var(--color-kanban-rejected)",
    dotColor: "#EF4444",
    textColor: "#B91C1C",
    countBg: "#FECACA",
  },
  {
    status: "accepted",
    label: "Acceptée",
    bg: "var(--color-kanban-accepted)",
    dotColor: "#10B981",
    textColor: "#065F46",
    countBg: "#A7F3D0",
  },
]
