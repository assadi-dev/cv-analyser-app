import { ArrowUpDown, SlidersHorizontal } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { SearchInput } from "./SearchInput"

interface FilterBarProps {
  search: string
  onSearchChange: (value: string) => void
}

export function FilterBar({ search, onSearchChange }: FilterBarProps) {
  return (
    <div className="flex items-center gap-3">
      <SearchInput value={search} onChange={onSearchChange} />
      <Button variant="ghost" size="md">
        <ArrowUpDown size={14} /> Trier par date
      </Button>
      <Button variant="ghost" size="md">
        <SlidersHorizontal size={14} /> Filtres
      </Button>
    </div>
  )
}
