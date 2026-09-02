import { cn } from "@/lib/utils"
import { BOARD_COLUMNS } from "../../_lib/columns.config"

/**
 * Stand-in for the board while it loads.
 *
 * Same grid and same column surfaces as the real board, so the layout does not
 * jump when the data lands — only the cards fade in.
 */
export function BoardSkeleton() {
  return (
    <div
      className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5"
      aria-hidden="true"
    >
      {BOARD_COLUMNS.map((column) => (
        <div
          key={column.status}
          className={cn(
            "flex min-h-[400px] flex-col gap-2.5 rounded-[12px] p-3",
            column.surface
          )}
        >
          <div className="flex items-center gap-2 pb-1">
            <span className={cn("h-2 w-2 shrink-0 rounded-full", column.dot)} />
            <span className={cn("text-[12px] font-bold", column.text)}>
              {column.label}
            </span>
          </div>

          {[0, 1].map((row) => (
            <div
              key={row}
              className="h-[70px] animate-pulse rounded-[10px] bg-white/60"
            />
          ))}
        </div>
      ))}
    </div>
  )
}
