"use client"

import { useEffect, useState } from "react"
import { User, FileText, Cpu, Layers, Shield, Check, Zap, Key, EyeOff, Eye } from "lucide-react"
import { api } from "@/lib/api"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Card, CardHeader } from "@/components/ui/Card"
import { cn } from "@/lib/utils"
import type { User as UserType, AIProvider, CV } from "@/types"

const SETTINGS_NAV = [
  { id: "profile",    label: "Profil",                icon: User },
  { id: "cvs",        label: "Mes CV",                icon: FileText },
  { id: "ai",         label: "IA & Providers",        icon: Cpu },
  { id: "platforms",  label: "Plateformes favorites", icon: Layers },
  { id: "data",       label: "Données & Confidentialité", icon: Shield },
]

const AI_PROVIDERS: { id: AIProvider; label: string; models: string[]; color: string; local?: boolean }[] = [
  { id: "openai",      label: "OpenAI",      models: ["gpt-4o", "gpt-4-turbo", "gpt-3.5-turbo"], color: "#10B981" },
  { id: "anthropic",   label: "Anthropic",   models: ["claude-3-5-sonnet-20241022", "claude-3-haiku-20240307"], color: "#CC785C" },
  { id: "groq",        label: "Groq",        models: ["llama-3.1-70b-versatile", "mixtral-8x7b-32768"], color: "#F97316" },
  { id: "mistral",     label: "Mistral",     models: ["mistral-large-latest", "mistral-small-latest"], color: "#FF7000" },
  { id: "openrouter",  label: "OpenRouter",  models: ["openai/gpt-4o", "anthropic/claude-3.5-sonnet"], color: "#6366F1" },
  { id: "ollama",      label: "Ollama",      models: ["llama3.2", "mistral", "codellama"], color: "#1E293B", local: true },
]

const PLATFORMS = ["LinkedIn", "Welcome to the Jungle", "Indeed", "Apec", "Cadremploi", "Monster"]

export default function ParametresPage() {
  const [activeSection, setActiveSection] = useState("profile")
  const [user, setUser]         = useState<UserType | null>(null)
  const [cvs, setCVs]           = useState<CV[]>([])
  const [saving, setSaving]     = useState(false)

  // Profile form
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName]   = useState("")
  const [title, setTitle]         = useState("")

  // AI form
  const [selectedProvider, setSelectedProvider] = useState<AIProvider>("openai")
  const [selectedModel, setSelectedModel]       = useState("gpt-4o")
  const [apiKey, setApiKey]                     = useState("")
  const [showKey, setShowKey]                   = useState(false)
  const [testing, setTesting]                   = useState(false)
  const [testResult, setTestResult]             = useState<{ success: boolean; message: string } | null>(null)

  // Preferences
  const [atsThreshold, setAtsThreshold]       = useState(70)
  const [favPlatforms, setFavPlatforms]       = useState<string[]>(["LinkedIn", "Welcome to the Jungle"])

  useEffect(() => {
    api.get<UserType>("/api/v1/settings/me").then((u) => {
      setUser(u)
      setFirstName(u.first_name ?? "")
      setLastName(u.last_name ?? "")
      setTitle(u.professional_title ?? "")
      setSelectedProvider(u.ai_provider)
      setSelectedModel(u.ai_model)
      setAtsThreshold(u.ats_threshold)
    }).catch(console.error)
    api.get<CV[]>("/api/v1/cvs").then(setCVs).catch(console.error)
  }, [])

  async function saveProfile() {
    setSaving(true)
    await api.patch("/api/v1/settings/profile", { first_name: firstName, last_name: lastName, professional_title: title })
    setSaving(false)
  }

  async function testProvider() {
    setTesting(true)
    setTestResult(null)
    const res = await api.post<{ success: boolean; message: string }>("/api/v1/settings/ai-provider/test", {})
    setTestResult(res)
    setTesting(false)
  }

  async function saveAIProvider() {
    setSaving(true)
    await api.put("/api/v1/settings/ai-provider", {
      ai_provider: selectedProvider,
      ai_model: selectedModel,
      ai_api_key: apiKey || undefined,
    })
    setSaving(false)
  }

  return (
    <div className="flex h-full overflow-hidden">
      {/* ── Settings sub-nav ── */}
      <nav className="w-[220px] shrink-0 border-r p-4 flex flex-col gap-1" style={{ borderColor: "var(--color-border)", background: "white" }}>
        <span className="text-[9px] font-bold tracking-widest px-2 mb-1" style={{ color: "var(--color-text-subtle)" }}>PARAMÈTRES</span>
        {SETTINGS_NAV.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveSection(id)}
            className={cn(
              "flex items-center gap-2.5 h-[38px] rounded-[8px] px-3 text-[13px] text-left transition-colors",
              activeSection === id
                ? "bg-[var(--color-primary-light)] text-[var(--color-primary)] font-semibold"
                : "text-[var(--color-text-muted)] hover:bg-[var(--color-surface-muted)]"
            )}
          >
            <Icon size={15} />
            {label}
          </button>
        ))}
      </nav>

      {/* ── Content ── */}
      <div className="flex-1 overflow-y-auto p-8 flex flex-col gap-5">

        {/* Save button */}
        <div className="flex justify-end">
          <Button size="md" onClick={activeSection === "ai" ? saveAIProvider : saveProfile} loading={saving}>
            Sauvegarder
          </Button>
        </div>

        {/* ── Profile section ── */}
        {activeSection === "profile" && (
          <Card>
            <CardHeader icon={<User size={15} style={{ color: "var(--color-primary)" }} />} title="Profil personnel" />
            <div className="flex items-center gap-4 mb-5">
              <div className="w-16 h-16 rounded-full bg-gradient-primary-diagonal flex items-center justify-center shrink-0">
                <span className="text-white text-[26px] font-black">
                  {firstName[0]?.toUpperCase() ?? "U"}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <Button variant="secondary" size="sm">Changer la photo</Button>
                <span className="text-[11px]" style={{ color: "var(--color-text-subtle)" }}>JPG, PNG — max 2 Mo</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Prénom" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
              <Input label="Nom"    value={lastName}  onChange={(e) => setLastName(e.target.value)} />
            </div>
            <div className="mt-4">
              <Input label="Titre professionnel" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ex: Développeur Full Stack" />
            </div>
          </Card>
        )}

        {/* ── AI & Providers section ── */}
        {activeSection === "ai" && (
          <Card>
            <CardHeader icon={<Cpu size={15} style={{ color: "var(--color-primary)" }} />} title="IA & Providers"
              subtitle="Sélectionnez votre provider et renseignez la clé API" />

            <div className="flex gap-0 rounded-[10px] overflow-hidden border" style={{ borderColor: "var(--color-border)" }}>
              {/* Provider list */}
              <div className="w-[200px] shrink-0 flex flex-col gap-1 p-2"
                style={{ background: "var(--color-surface-muted)", borderRight: `1px solid var(--color-border)` }}>
                {AI_PROVIDERS.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => { setSelectedProvider(p.id); setSelectedModel(p.models[0] ?? "") }}
                    className={cn(
                      "flex items-center gap-2.5 h-[46px] px-3 rounded-[8px] text-[13px] transition-colors",
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
                {(() => {
                  const provider = AI_PROVIDERS.find((p) => p.id === selectedProvider)!
                  return (
                    <>
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
                        <Input
                          label="Clé API"
                          type={showKey ? "text" : "password"}
                          placeholder="sk-••••••••••••••••••••"
                          value={apiKey}
                          onChange={(e) => setApiKey(e.target.value)}
                          leftIcon={<Key size={14} />}
                          rightIcon={
                            <button type="button" onClick={() => setShowKey(!showKey)}>
                              {showKey ? <EyeOff size={14} /> : <Eye size={14} />}
                            </button>
                          }
                        />
                      )}

                      {/* Model */}
                      <div className="flex flex-col gap-1.5">
                        <span className="text-[12px] font-semibold" style={{ color: "var(--color-text-secondary)" }}>Modèle par défaut</span>
                        <select
                          value={selectedModel}
                          onChange={(e) => setSelectedModel(e.target.value)}
                          className="h-10 px-3 rounded-[8px] text-[13px] border outline-none"
                          style={{ background: "var(--color-surface-muted)", borderColor: "var(--color-border)", color: "var(--color-text-secondary)" }}
                        >
                          {provider.models.map((m) => <option key={m} value={m}>{m}</option>)}
                        </select>
                      </div>

                      {/* Test button */}
                      <div className="flex items-center gap-3">
                        <Button variant="secondary" onClick={testProvider} loading={testing}>
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
                    </>
                  )
                })()}
              </div>
            </div>
          </Card>
        )}

        {/* ── Platforms section ── */}
        {activeSection === "platforms" && (
          <Card>
            <CardHeader icon={<Layers size={15} style={{ color: "var(--color-primary)" }} />} title="Plateformes favorites"
              subtitle="Ces plateformes seront proposées en priorité lors de l'ajout d'une candidature" />
            <div className="grid grid-cols-4 gap-3">
              {PLATFORMS.map((platform) => {
                const active = favPlatforms.includes(platform)
                return (
                  <button
                    key={platform}
                    onClick={() => setFavPlatforms((prev) =>
                      active ? prev.filter((p) => p !== platform) : [...prev, platform]
                    )}
                    className={cn(
                      "flex items-center gap-2 h-11 px-3.5 rounded-[10px] text-[13px] transition-all border",
                      active
                        ? "border-[var(--color-info)] bg-[var(--color-info-light)] text-[var(--color-info-text)] font-semibold"
                        : "border-[var(--color-border)] bg-[var(--color-surface-muted)] text-[var(--color-text-muted)]"
                    )}
                  >
                    <span className="flex-1 text-left truncate">{platform}</span>
                    {active && <Check size={14} />}
                  </button>
                )
              })}
            </div>
          </Card>
        )}

        {/* ── Data section ── */}
        {activeSection === "data" && (
          <Card>
            <CardHeader icon={<Shield size={15} style={{ color: "var(--color-danger)" }} />}
              iconBg="var(--color-danger-light)" title="Données & Confidentialité"
              subtitle="Gérez vos données personnelles et les informations stockées" />
            <div className="flex flex-col gap-3">
              {[
                { label: "Exporter mes données", sub: "Télécharger toutes vos analyses et candidatures — JSON ou CSV", actions: ["JSON", "CSV"], danger: false },
                { label: "Supprimer toutes les analyses", sub: "Efface l'historique des analyses IA sans toucher aux candidatures", actions: ["Supprimer"], danger: true },
                { label: "Réinitialiser l'application", sub: "Supprime toutes les données, analyses, candidatures et préférences. Irréversible.", actions: ["Réinitialiser"], danger: true },
              ].map((row) => (
                <div key={row.label}
                  className="flex items-center gap-3 h-14 px-4 rounded-[10px] border"
                  style={{
                    background: row.danger ? "var(--color-danger-light)" : "var(--color-surface-muted)",
                    borderColor: row.danger ? "#FECACA" : "var(--color-border)",
                  }}>
                  <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                    <span className="text-[13px] font-semibold" style={{ color: row.danger ? "var(--color-danger-text)" : "var(--color-text-secondary)" }}>{row.label}</span>
                    <span className="text-[11px]" style={{ color: row.danger ? "#F87171" : "var(--color-text-subtle)" }}>{row.sub}</span>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    {row.actions.map((action) => (
                      <Button key={action} variant={row.danger ? "danger" : "secondary"} size="sm">
                        {action}
                      </Button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}
