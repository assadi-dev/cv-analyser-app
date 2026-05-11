import { Search } from "lucide-react"

interface SearchInputProps {
  value: string
  onChange: (value: string) => void
}

export function SearchInput({ value, onChange }: SearchInputProps) {
  return (
    <div
      className="flex items-center gap-2 flex-1 h-[42px] px-3.5 rounded-[10px] border"
      style={{ background: "white", borderColor: "var(--color-border)" }}
    >
      <Search size={16} style={{ color: "var(--color-text-subtle)" }} />
      <input
        className="flex-1 text-[13px] outline-none bg-transparent placeholder:text-[var(--color-text-subtle)]"
        placeholder="Rechercher une entreprise, un poste..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{ color: "var(--color-text-secondary)" }}
      />
    </div>
  )
}
