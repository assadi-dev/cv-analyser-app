"use client"

import { useCallback, useState } from "react"
import { useModal } from "@/hooks/useModal"
import { useParametresSection } from "../_hooks/useParametresSection"
import { useDeleteAccount } from "../_hooks/useDeleteAccount"
import { SettingsNav } from "./SettingsNav"
import { ProfilSection } from "./Profil/ProfilSection"
import { CvsSection } from "./CvsSection"
import { AiProvidersSection } from "./Ai/AiProvidersSection"
import { PlatformsSection } from "./PlatformsSection"
import { DataSection } from "./DataSection"
import { DeleteAccountModal } from "./modals/DeleteAccountModal"

export function ParametresClient() {
  const { section, setSection } = useParametresSection()
  const deleteModal = useModal()
  const { mutate: deleteAccount, isPending: isDeleting } = useDeleteAccount()

  // Favorite platforms — local preference, no backend field yet.
  const [favPlatforms, setFavPlatforms] = useState<string[]>(["LinkedIn", "Welcome to the Jungle"])

  const togglePlatform = useCallback((platform: string) => {
    setFavPlatforms((prev) =>
      prev.includes(platform) ? prev.filter((p) => p !== platform) : [...prev, platform]
    )
  }, [])

  const handleDeleteConfirm = useCallback(() => {
    deleteAccount(undefined, { onSuccess: deleteModal.close })
  }, [deleteAccount, deleteModal.close])

  return (
    <div className="flex flex-col md:flex-row h-full overflow-hidden">
      <SettingsNav active={section} onChange={setSection} />

      <div className="flex-1 overflow-y-auto p-4 sm:p-8 flex flex-col gap-5">
        {section === "profile" && <ProfilSection />}
        {section === "cvs" && <CvsSection />}
        {section === "ai" && <AiProvidersSection />}
        {section === "platforms" && (
          <PlatformsSection favPlatforms={favPlatforms} onToggle={togglePlatform} />
        )}
        {section === "data" && (
          <DataSection onDeleteAccountRequest={deleteModal.open} />
        )}
      </div>

      <DeleteAccountModal
        isOpen={deleteModal.isOpen}
        onClose={deleteModal.close}
        onConfirm={handleDeleteConfirm}
        isPending={isDeleting}
      />
    </div>
  )
}
