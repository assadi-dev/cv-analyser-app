"use client"

import { Cpu } from "lucide-react"
import { Card, CardHeader } from "@/components/ui/Card"
import { useProfil } from "../../_hooks/useProfil"
import { useUpdateAiProvider } from "../../_hooks/useUpdateAiProvider"
import { AiProviderForm } from "../forms/AiProviderForm"

export function AiProvidersSection() {
  const { profil, isLoading } = useProfil()
  const { mutate: updateAiProvider, isPending } = useUpdateAiProvider()

  return (
    <Card>
      <CardHeader icon={<Cpu size={15} style={{ color: "var(--color-primary)" }} />} title="IA & Providers"
        subtitle="Sélectionnez votre provider et renseignez la clé API" />
      {isLoading ? (
        <div className="h-40 rounded-[10px] animate-pulse" style={{ background: "var(--color-surface-muted)" }} />
      ) : (
        <AiProviderForm profil={profil} onSubmit={updateAiProvider} isPending={isPending} />
      )}
    </Card>
  )
}
