"use client"

import { Button } from "@/components/ui/Button"

interface ProfilAvatarProps {
  firstName: string
}

export function ProfilAvatar({ firstName }: ProfilAvatarProps) {
  return (
    <div className="flex items-center gap-4 mb-5">
      <div className="w-16 h-16 rounded-full bg-gradient-primary-diagonal flex items-center justify-center shrink-0">
        <span className="text-white text-[26px] font-black">
          {firstName[0]?.toUpperCase() ?? "U"}
        </span>
      </div>
      <div className="flex flex-col gap-1">
        <Button variant="secondary" size="sm" type="button">
          Changer la photo
        </Button>
        <span className="text-[11px]" style={{ color: "var(--color-text-subtle)" }}>
          JPG, PNG — max 2 Mo
        </span>
      </div>
    </div>
  )
}
