import { flexRender, type HeaderGroup } from "@tanstack/react-table"
import type { CandidatureSummary } from "@/types"

export const TABLE_GRID = "220px 1fr 110px 110px 120px 140px 80px"

interface CandidaturesTableHeaderProps {
  headerGroups: HeaderGroup<CandidatureSummary>[]
}

export function CandidaturesTableHeader({ headerGroups }: CandidaturesTableHeaderProps) {
  return (
    <>
      {headerGroups.map((headerGroup) => (
        <div
          key={headerGroup.id}
          className="grid text-[11px] font-bold tracking-wide h-11 px-5 items-center border-b"
          style={{
            gridTemplateColumns: TABLE_GRID,
            borderColor: "var(--color-border)",
            background: "var(--color-surface-muted)",
            color: "var(--color-text-subtle)",
          }}
        >
          {headerGroup.headers.map((header) => (
            <div key={header.id}>
              {header.isPlaceholder
                ? null
                : flexRender(header.column.columnDef.header, header.getContext())}
            </div>
          ))}
        </div>
      ))}
    </>
  )
}
