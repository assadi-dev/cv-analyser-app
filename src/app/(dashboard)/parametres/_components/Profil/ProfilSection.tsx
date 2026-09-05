"use client"

import { User } from "lucide-react"
import { Card, CardHeader } from "@/components/ui/Card"
import { useProfil } from "../../_hooks/useProfil"
import { useUpdateProfil } from "../../_hooks/useUpdateProfil"
import { ProfilForm } from "../forms/ProfilForm"

export function ProfilSection() {
  const { profil, isLoading } = useProfil()
  const { mutate: updateProfil, isPending } = useUpdateProfil()

  return (
    <Card>
      <CardHeader icon={<User size={15} style={{ color: "var(--color-primary)" }} />} title="Profil personnel" />
      {isLoading ? (
        <div className="h-40 rounded-[10px] animate-pulse" style={{ background: "var(--color-surface-muted)" }} />
      ) : (
        <ProfilForm profil={profil} onSubmit={updateProfil} isPending={isPending} />
      )}
    </Card>
  )
}
