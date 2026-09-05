"use client"

import { forwardRef, useEffect, useRef, useState, type ComponentPropsWithoutRef } from "react"
import { Check, ChevronDown } from "lucide-react"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

interface ComboboxProps extends Omit<ComponentPropsWithoutRef<"button">, "value" | "onChange" | "defaultValue"> {
  value: string
  onChange: (value: string) => void
  options: string[]
  placeholder?: string
  searchPlaceholder?: string
  emptyText?: string
}

/**
 * A searchable dropdown that also accepts a free-text value outside `options`
 * (e.g. a self-hosted Ollama model not in our static list) — unlike a plain
 * Select, the typed query itself is always a valid, submittable value.
 *
 * Forwards its ref/id/aria-* props to the trigger button so it can be used
 * inside a shadcn <FormControl> like any other form field.
 */
export const Combobox = forwardRef<HTMLButtonElement, ComboboxProps>(function Combobox(
  {
    value,
    onChange,
    options,
    placeholder = "Sélectionner...",
    searchPlaceholder = "Rechercher ou saisir une valeur...",
    emptyText = "Aucun résultat.",
    className,
    disabled,
    ...triggerProps
  },
  ref
) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState(value)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) setQuery(value)
  }, [open, value])

  const normalizedQuery = query.trim()
  const filtered = options.filter((o) => o.toLowerCase().includes(normalizedQuery.toLowerCase()))
  const hasExactMatch = options.some((o) => o.toLowerCase() === normalizedQuery.toLowerCase())

  function commit(next: string) {
    onChange(next)
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          ref={ref}
          type="button"
          disabled={disabled}
          className={cn(
            "h-10 w-full px-3 rounded-[8px] text-[13px] border outline-none flex items-center justify-between gap-2 text-left disabled:opacity-50 disabled:cursor-not-allowed",
            className
          )}
          style={{
            background: "var(--color-surface-muted)",
            borderColor: "var(--color-border)",
            color: value ? "var(--color-text-secondary)" : "var(--color-text-subtle)",
          }}
          {...triggerProps}
        >
          <span className="truncate">{value || placeholder}</span>
          <ChevronDown size={14} className="shrink-0" style={{ color: "var(--color-text-subtle)" }} />
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="w-[var(--radix-popover-trigger-width)] min-w-[240px] p-1.5 flex flex-col gap-1"
        onOpenAutoFocus={(e) => {
          e.preventDefault()
          inputRef.current?.focus()
        }}
      >
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && normalizedQuery) {
              e.preventDefault()
              commit(normalizedQuery)
            }
          }}
          placeholder={searchPlaceholder}
          className="h-8 px-2.5 rounded-[6px] text-[12px] border outline-none"
          style={{ borderColor: "var(--color-border)" }}
        />
        <div className="max-h-[220px] overflow-y-auto flex flex-col gap-0.5">
          {filtered.length === 0 && (
            <p className="text-[11px] px-2 py-1.5" style={{ color: "var(--color-text-subtle)" }}>{emptyText}</p>
          )}
          {filtered.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => commit(option)}
              className="flex items-center gap-2 h-8 px-2.5 rounded-[6px] text-[12px] text-left hover:bg-[var(--color-surface-muted)]"
              style={{ color: "var(--color-text-secondary)" }}
            >
              <Check size={12} className={option === value ? "opacity-100" : "opacity-0"} style={{ color: "var(--color-primary)" }} />
              <span className="truncate">{option}</span>
            </button>
          ))}
          {normalizedQuery && !hasExactMatch && (
            <button
              type="button"
              onClick={() => commit(normalizedQuery)}
              className="flex items-center gap-2 h-8 px-2.5 rounded-[6px] text-[12px] text-left hover:bg-[var(--color-surface-muted)] font-medium"
              style={{ color: "var(--color-primary)" }}
            >
              Utiliser « {normalizedQuery} »
            </button>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
})
