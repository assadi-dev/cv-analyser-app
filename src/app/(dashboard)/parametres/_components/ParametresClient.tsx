"use client"

import { useCallback, useState } from "react"
import { api } from "@/lib/api"
import { logError } from "@/lib/logger"
import { useToast } from "@/hooks/useToast"
import { useModal } from "@/hooks/useModal"
import type { AIProvider } from "@/types"
import { useParametresSection } from "../_hooks/useParametresSection"
import { useDeleteAccount } from "../_hooks/useDeleteAccount"
import { SettingsNav } from "./SettingsNav"
import { ProfilSection } from "./Profil/ProfilSection"
import { CvsSection } from "./CvsSection"
import { AiProvidersSection, type AIProviderTestResult } from "./AiProvidersSection"
import { PlatformsSection } from "./PlatformsSection"
import { DataSection } from "./DataSection"
import { DeleteAccountModal } from "./modals/DeleteAccountModal"

export function ParametresClient() {
  const { section, setSection } = useParametresSection()
  const toast = useToast()
  const deleteModal = useModal()
  const { mutate: deleteAccount, isPending: isDeleting } = useDeleteAccount()

  // AI provider — pending its own dedicated hooks/API pass.
  const [selectedProvider, setSelectedProvider] = useState<AIProvider>("openai")
  const [selectedModel, setSelectedModel] = useState("gpt-4o")
  const [apiKey, setApiKey] = useState("")
  const [showKey, setShowKey] = useState(false)
  const [testing, setTesting] = useState(false)
  const [savingAI, setSavingAI] = useState(false)
  const [testResult, setTestResult] = useState<AIProviderTestResult | null>(null)

  // Favorite platforms — local preference, no backend field yet.
  const [favPlatforms, setFavPlatforms] = useState<string[]>(["LinkedIn", "Welcome to the Jungle"])

  const testProvider = useCallback(async () => {
    setTesting(true)
    setTestResult(null)
    try {
      const res = await api.post<AIProviderTestResult>("/api/account/ai-provider/test", {})
      setTestResult(res)
    } catch (error) {
      logError(error, "testProvider")
      toast.error("Impossible de tester la connexion")
    } finally {
      setTesting(false)
    }
  }, [toast])

  const saveAIProvider = useCallback(async () => {
    setSavingAI(true)
    try {
      await api.put("/api/v1/settings/ai-provider", {
        ai_provider: selectedProvider,
        ai_model: selectedModel,
        ai_api_key: apiKey || undefined,
      })
      toast.success("Provider IA mis à jour")
    } catch (error) {
      logError(error, "saveAIProvider")
      toast.error("Impossible de sauvegarder le provider IA")
    } finally {
      setSavingAI(false)
    }
  }, [selectedProvider, selectedModel, apiKey, toast])

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
        {section === "ai" && (
          <AiProvidersSection
            selectedProvider={selectedProvider}
            selectedModel={selectedModel}
            apiKey={apiKey}
            showKey={showKey}
            testing={testing}
            saving={savingAI}
            testResult={testResult}
            onSelectProvider={setSelectedProvider}
            onSelectModel={setSelectedModel}
            onApiKeyChange={setApiKey}
            onToggleShowKey={() => setShowKey((v) => !v)}
            onTest={testProvider}
            onSave={saveAIProvider}
          />
        )}
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
