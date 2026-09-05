"use client"

import { Cpu, Check, Zap, Key, EyeOff, Eye } from "lucide-react"
import { Card, CardHeader } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { AI_PROVIDERS } from "../_lib/ai-providers.config"
import type { AIProvider } from "@/types"

export interface AIProviderTestResult {
  success: boolean
  message: string
}

interface AiProvidersSectionProps {
  selectedProvider: AIProvider
  selectedModel: string
  apiKey: string
  showKey: boolean
  testing: boolean
  saving: boolean
  testResult: AIProviderTestResult | null
  onSelectProvider: (provider: AIProvider) => void
  onSelectModel: (model: string) => void
  onApiKeyChange: (value: string) => void
  onToggleShowKey: () => void
  onTest: () => void
  onSave: () => void
}

export function AiProvidersSection({
  selectedProvider,
  selectedModel,
  apiKey,
  showKey,
  testing,
  saving,
  testResult,
  onSelectProvider,
  onSelectModel,
  onApiKeyChange,
  onToggleShowKey,
  onTest,
  onSave,
}: AiProvidersSectionProps) {
  const provider = AI_PROVIDERS.find((p) => p.id === selectedProvider) ?? AI_PROVIDERS[0]

  return (
    <Card>
      <CardHeader icon={<Cpu size={15} style={{ color: "var(--color-primary)" }} />} title="IA & Providers"
        subtitle="Sélectionnez votre provider et renseignez la clé API" />

      <div className="flex flex-col md:flex-row gap-0 rounded-[10px] overflow-hidden border" style={{ borderColor: "var(--color-border)" }}>
        {/* Provider list */}
        <div className="w-full md:w-[200px] shrink-0 flex md:flex-col gap-1 p-2 overflow-x-auto"
          style={{ background: "var(--color-surface-muted)", borderRight: `1px solid var(--color-border)` }}>
          {AI_PROVIDERS.map((p) => (
            <button
              key={p.id}
              onClick={() => { onSelectProvider(p.id); onSelectModel(p.models[0] ?? "") }}
              className={cn(
                "flex items-center gap-2.5 h-[46px] px-3 rounded-[8px] text-[13px] transition-colors shrink-0 whitespace-nowrap",
                selectedProvider === p.id
                  ? "bg-[var(--color-primary)] text-white font-semibold"
                  : "text-[var(--color-text-secondary)] hover:bg-white"
              )}
            >
              <div className="w-[26px] h-[26px] rounded-[6px] flex items-center justify-center shrink-0 text-[10px] font-black text-white"
                style={{ background: p.color }}>
                {p.label.slice(0, 2)}
              </div>
              <span className="flex-1 text-left">{p.label}</span>
              {p.local && (
                <span className="text-[9px] px-1.5 py-0.5 rounded-[4px]"
                  style={{ background: selectedProvider === p.id ? "rgba(255,255,255,0.2)" : "var(--color-surface-muted)", color: selectedProvider === p.id ? "white" : "var(--color-text-subtle)" }}>
                  Local
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Provider config */}
        <div className="flex-1 p-6 flex flex-col gap-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[10px] flex items-center justify-center text-[14px] font-black text-white"
              style={{ background: provider.color }}>
              {provider.label.slice(0, 2)}
            </div>
            <div>
              <p className="text-[16px] font-bold" style={{ color: "var(--color-text-primary)" }}>{provider.label}</p>
              <p className="text-[12px]" style={{ color: "var(--color-text-muted)" }}>
                {provider.models.join(" · ")}
              </p>
            </div>
            {testResult && (
              <span className={cn("ml-auto flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold",
                testResult.success ? "bg-[var(--color-success-light)] text-[var(--color-success-text)]" : "bg-[var(--color-danger-light)] text-[var(--color-danger-text)]"
              )}>
                {testResult.success ? <><Check size={11} /> Active</> : "Erreur"}
              </span>
            )}
          </div>

          <div className="h-px" style={{ background: "var(--color-border)" }} />

          {/* API Key */}
          {!provider.local && (
            <div className="flex flex-col gap-1.5">
              <span className="text-[12px] font-semibold" style={{ color: "var(--color-text-secondary)" }}>Clé API</span>
              <div className="relative">
                <Key size={14} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "var(--color-text-subtle)" }} />
                <Input
                  type={showKey ? "text" : "password"}
                  placeholder="sk-••••••••••••••••••••"
                  value={apiKey}
                  onChange={(e) => onApiKeyChange(e.target.value)}
                  className="pl-9 pr-9"
                />
                <button
                  type="button"
                  onClick={onToggleShowKey}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: "var(--color-text-subtle)" }}
                >
                  {showKey ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>
          )}

          {/* Model */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[12px] font-semibold" style={{ color: "var(--color-text-secondary)" }}>Modèle par défaut</span>
            <select
              value={selectedModel}
              onChange={(e) => onSelectModel(e.target.value)}
              className="h-10 px-3 rounded-[8px] text-[13px] border outline-none"
              style={{ background: "var(--color-surface-muted)", borderColor: "var(--color-border)", color: "var(--color-text-secondary)" }}
            >
              {provider.models.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>

          {/* Test button */}
          <div className="flex items-center gap-3">
            <Button variant="secondary" onClick={onTest} loading={testing} type="button">
              <Zap size={14} /> Tester la connexion
            </Button>
            {testResult && (
              <span className="text-[12px]" style={{ color: testResult.success ? "var(--color-success-text)" : "var(--color-danger-text)" }}>
                {testResult.message}
              </span>
            )}
          </div>

          {/* Ollama note */}
          {provider.local && (
            <div className="flex items-center gap-2 p-3 rounded-[8px]" style={{ background: "var(--color-surface-muted)" }}>
              <span className="text-[11px]" style={{ color: "var(--color-text-muted)" }}>
                Pour Ollama : aucune clé requise — renseignez uniquement l&apos;URL locale (ex: http://localhost:11434)
              </span>
            </div>
          )}

          <div className="flex justify-end">
            <Button size="md" onClick={onSave} loading={saving} type="button">
              Sauvegarder
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}
