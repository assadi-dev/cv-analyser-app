import { Search } from "lucide-react"

export function CandidaturesEmptyState() {
  return (
    <div
      className="flex flex-col items-center justify-center py-12 gap-2"
      style={{ color: "var(--color-text-subtle)" }}
    >
      <Search size={32} className="opacity-30" />
      <p className="text-[13px]">Aucune candidature trouvée</p>
    </div>
  )
}
