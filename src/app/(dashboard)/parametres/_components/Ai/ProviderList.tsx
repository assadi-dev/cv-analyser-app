import { AI_PROVIDERS } from "../../_lib/ai-providers.config"
import { ProviderListItem } from "./ProviderListItem"
import type { AIProvider } from "@/types"

interface ProviderListProps {
  selected: AIProvider
  onSelect: (provider: AIProvider) => void
}

export function ProviderList({ selected, onSelect }: ProviderListProps) {
  return (
    <div
      className="w-full md:w-[200px] shrink-0 flex md:flex-col gap-1 p-2 overflow-x-auto"
      style={{ background: "var(--color-surface-muted)", borderRight: "1px solid var(--color-border)" }}
    >
      {AI_PROVIDERS.map((provider) => (
        <ProviderListItem
          key={provider.id}
          provider={provider}
          active={selected === provider.id}
          onSelect={() => onSelect(provider.id)}
        />
      ))}
    </div>
  )
}
