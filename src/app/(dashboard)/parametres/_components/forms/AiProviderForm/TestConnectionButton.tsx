"use client"

import { useFormContext } from "react-hook-form"
import { Zap } from "lucide-react"
import { Button } from "@/components/ui/Button"
import type { AiProviderTestResult } from "../../../_api/ai-provider.api"
import type { AiProviderFormValues } from "../../../_lib/ai-provider.schema"

interface TestConnectionButtonProps {
  onTest: () => void
  isPending: boolean
  result: AiProviderTestResult | undefined
}

export function TestConnectionButton({ onTest, isPending, result }: TestConnectionButtonProps) {
  const { formState } = useFormContext<AiProviderFormValues>()
  const disabled = formState.isDirty

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-3">
        <Button variant="secondary" type="button" onClick={onTest} loading={isPending} disabled={disabled}>
          <Zap size={14} /> Tester la connexion
        </Button>
        {result && (
          <span className="text-[12px]" style={{ color: result.success ? "var(--color-success-text)" : "var(--color-danger-text)" }}>
            {result.message}
          </span>
        )}
      </div>
      {disabled && (
        <span className="text-[11px]" style={{ color: "var(--color-text-subtle)" }}>
          Enregistrez vos modifications avant de tester la connexion.
        </span>
      )}
    </div>
  )
}
