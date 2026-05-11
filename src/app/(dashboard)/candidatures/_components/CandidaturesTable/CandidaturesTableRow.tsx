import { flexRender, type Row } from "@tanstack/react-table"
import type { CandidatureSummary } from "@/types"
import { TABLE_GRID } from "./CandidaturesTableHeader"

interface CandidaturesTableRowProps {
  row: Row<CandidatureSummary>
  index: number
}

export function CandidaturesTableRow({ row, index }: CandidaturesTableRowProps) {
  return (
    <div
      className="grid h-16 px-5 items-center border-b hover:bg-[var(--color-surface-muted)] transition-colors"
      style={{
        gridTemplateColumns: TABLE_GRID,
        borderColor: "var(--color-border-muted)",
        background: index % 2 === 1 ? "var(--color-surface-muted)" : "white",
      }}
    >
      {row.getVisibleCells().map((cell) => (
        <div key={cell.id}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </div>
      ))}
    </div>
  )
}
