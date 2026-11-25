import type { ReactNode } from "react"

interface StepLayoutProps {
  left: ReactNode
  right: ReactNode
}

/**
 * The two-panel body shared by every step: white panel on the left, muted one
 * on the right — the layout the single-page form already had.
 *
 * From `md` each panel scrolls on its own inside the fixed step height; below
 * that the panels stack and the whole step scrolls.
 */
export function StepLayout({ left, right }: StepLayoutProps) {
  return (
    <div className="grid h-full grid-cols-1 overflow-y-auto md:grid-cols-2 md:grid-rows-[minmax(0,1fr)] md:overflow-hidden">
      <div className="flex flex-col gap-5 bg-white p-6 md:min-h-0 md:overflow-y-auto md:border-r md:border-[#F1F5F9]">
        {left}
      </div>
      <div className="flex flex-col gap-5 bg-[#FAFAFA] p-6 md:min-h-0 md:overflow-y-auto">
        {right}
      </div>
    </div>
  )
}
