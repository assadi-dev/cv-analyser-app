"use client"

import { useState } from "react"
import { FileText, Briefcase, Zap, CloudUpload, Target, CheckCircle, AlertTriangle, Lightbulb, Send, MessageCircle } from "lucide-react"
import { useSSE } from "@/hooks/useSSE"
import { useAnalyseStore } from "@/store/analyse.store"
import { Button } from "@/components/ui/Button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardHeader } from "@/components/ui/Card"
import { Badge, ScoreBadge } from "@/components/ui/Badge"
import { cn, scoreColor } from "@/lib/utils"
import { api } from "@/lib/api"
import type { SSEEvent, SSEResultEvent, ChatMessage } from "@/types"
import { Input } from "@/components/ui/input"
import { ChatBot } from "./_components/ChatBot"

const STEP_LABELS: Record<string, string> = {
  parsing: "Analyse des documents...",
  ats: "Calcul du score ATS...",
  scoring: "Évaluation sémantique...",
  recommendations: "Génération des recommandations...",
}

export default function AnalyserPage() {
  const [cvFile, setCvFile] = useState<File | null>(null)
  const [jobText, setJobText] = useState("")
  const [chatInput, setChatInput] = useState("")
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [chatLoading, setChatLoading] = useState(false)

  const { liveResult, savedAnalyseId, setLiveResult, setSavedAnalyseId } = useAnalyseStore()

  function handleEvent(event: SSEEvent) {
    if (event.type === "result") {
      setLiveResult(event as SSEResultEvent)
    } else if (event.type === "done") {
      setSavedAnalyseId(event.analyse_id)
    }
  }

  const { state: sseState, start, reset } = useSSE(handleEvent)
  const isStreaming = sseState.status === "streaming" || sseState.status === "connecting"

  function handleAnalyse() {
    if (!cvFile || !jobText.trim()) return
    setLiveResult(null as any)
    reset()

    // TODO: attach a real candidature_id — for now use a placeholder
    start("/api/ia/analyse-stream", {
      job_description: jobText,
      cv_file: cvFile,
    })
  }

  async function handleChat(e: React.FormEvent) {
    e.preventDefault()
    if (!chatInput.trim() || !savedAnalyseId) return

    const userMsg: ChatMessage = { role: "user", content: chatInput }
    setChatMessages((prev) => [...prev, userMsg])
    setChatInput("")
    setChatLoading(true)

    try {
      const res = await api.post<{ message: string }>("/api/v1/analyses/chat", {
        analyse_id: savedAnalyseId,
        message: chatInput,
      })
      setChatMessages((prev) => [...prev, { role: "assistant", content: res.message }])
    } catch {
      setChatMessages((prev) => [...prev, { role: "assistant", content: "Désolé, une erreur est survenue." }])
    } finally {
      setChatLoading(false)
    }
  }

  const result = liveResult

  return (
    <div className="h-full flex gap-5 p-8 relative">
      {/* ── Left column — inputs ── */}
      <div className="flex flex-col gap-4 w-[500px]">

        {/* CV Card */}
        <Card>
          <CardHeader
            icon={<FileText size={15} style={{ color: "var(--color-primary)" }} />}
            title="CV du Candidat"
            action={<Badge variant="purple">PDF</Badge>}
          />
          <Input
            type="file"
            accept=".pdf"
            onChange={(e) => setCvFile(e.target.files?.[0] ?? null)}
            className="min-h-[120px]"
          />
        </Card>

        {/* Job Card */}
        <Card className="flex-1 flex flex-col gap-4 justify-between">
          <CardHeader
            icon={<Briefcase size={15} style={{ color: "#8B5CF6" }} />}
            title="Fiche de Poste"
          />
          <Textarea
            placeholder="Collez la description du poste (missions, compétences requises, expérience)..."
            value={jobText}
            onChange={(e) => setJobText(e.target.value)}
            className="flex-1"
          />
          {/* Analyse button */}
          <Button
            size="lg"
            className="w-full"
            onClick={handleAnalyse}
            loading={isStreaming}
            disabled={!cvFile || !jobText.trim() || isStreaming}
          >
            <Zap size={20} />
            {isStreaming ? (STEP_LABELS[sseState.currentStep ?? ""] ?? "Analyse en cours...") : "Analyser la compatibilité"}
          </Button>

          {/* Progress bar */}
          {isStreaming && (
            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-[11px]" style={{ color: "var(--color-text-subtle)" }}>
                <span className="animate-pulse-soft">{STEP_LABELS[sseState.currentStep ?? ""] ?? "Initialisation..."}</span>
                <span>{sseState.progress}%</span>
              </div>
              <div className="h-1.5 rounded-full w-full" style={{ background: "var(--color-border)" }}>
                <div
                  className="h-full rounded-full bg-gradient-primary transition-all duration-500"
                  style={{ width: `${sseState.progress}%` }}
                />
              </div>
            </div>
          )}
        </Card>


      </div>

      {/* ── Right column — results ── */}
      <div className="flex flex-col gap-4 flex-1 min-w-0 relative">

        {/* Scores */}
        <Card>
          <CardHeader
            icon={<Target size={15} style={{ color: "var(--color-success-text)" }} />}
            iconBg="var(--color-success-light)"
            title="Résultats de l'analyse"
          />

          {result ? (
            <>
              {/* Global score */}
              <div className="flex items-center gap-4 p-4 rounded-[10px] mb-4" style={{ background: "var(--color-surface-muted)" }}>
                <div className="w-[72px] h-[72px] rounded-full flex items-center justify-center shrink-0 bg-gradient-primary shadow-[var(--shadow-primary)]">
                  <span className="text-white text-[18px] font-black">{result.score_global}%</span>
                </div>
                <div>
                  <p className="text-[12px]" style={{ color: "var(--color-text-muted)" }}>Score Global de Matching</p>
                  <p className="text-[15px] font-bold" style={{ color: result.score_global >= 80 ? "var(--color-success-text)" : result.score_global >= 60 ? "var(--color-warning-text)" : "var(--color-danger-text)" }}>
                    {result.score_global >= 80 ? "Excellent match !" : result.score_global >= 60 ? "Bon profil" : "Profil à améliorer"}
                  </p>
                  <p className="text-[11px]" style={{ color: "var(--color-text-subtle)" }}>
                    ATS: {result.score_ats}% · Compétences: {result.score_competences}% · Exp.: {result.score_experience}%
                  </p>
                </div>
              </div>

              {/* Mini score grid */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                {[
                  { label: "Score ATS", value: result.score_ats },
                  { label: "Compétences", value: result.score_competences },
                  { label: "Expérience", value: result.score_experience },
                ].map((s) => (
                  <div key={s.label} className="flex flex-col gap-1.5 p-3 rounded-[10px]" style={{ background: "var(--color-surface-muted)" }}>
                    <span className="text-[11px]" style={{ color: "var(--color-text-subtle)" }}>{s.label}</span>
                    <span className={cn("text-[22px] font-black",
                      s.value >= 80 ? "text-[var(--color-success-text)]" : s.value >= 60 ? "text-[var(--color-warning-text)]" : "text-[var(--color-danger-text)]"
                    )}>{s.value}</span>
                    <div className="h-1.5 rounded-full" style={{ background: "var(--color-border)" }}>
                      <div className="h-full rounded-full bg-gradient-primary" style={{ width: `${s.value}%` }} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Missing keywords */}
              {result.keywords_missing.length > 0 && (
                <div className="flex flex-col gap-2">
                  <span className="text-[12px] font-semibold" style={{ color: "var(--color-text-muted)" }}>
                    Mots-clés manquants
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {result.keywords_missing.slice(0, 10).map((kw) => (
                      <span key={kw} className="px-2.5 py-1 rounded-full text-[11px] font-semibold"
                        style={{ background: "var(--color-danger-light)", color: "var(--color-danger-text)" }}>
                        {kw}
                      </span>
                    ))}
                    {result.keywords_found.slice(0, 5).map((kw) => (
                      <span key={kw} className="px-2.5 py-1 rounded-full text-[11px] font-semibold"
                        style={{ background: "var(--color-success-light)", color: "var(--color-success-text)" }}>
                        {kw} ✓
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 gap-2" style={{ color: "var(--color-text-subtle)" }}>
              <Target size={32} className="opacity-30" />
              <p className="text-[13px]">Lancez une analyse pour voir les résultats</p>
            </div>
          )}
        </Card>

        {/* Recommendations */}
        {result?.recommandations && result.recommandations.length > 0 && (
          <Card>
            <CardHeader
              icon={<Lightbulb size={15} style={{ color: "var(--color-primary)" }} />}
              title="Recommandations IA"
              action={<Badge variant="purple">{result.recommandations.length} conseils</Badge>}
            />
            <div className="flex flex-col gap-2.5">
              {result.recommandations.map((reco, i) => {
                const colorMap = {
                  warning: { bg: "var(--color-warning-light)", border: "#FED7AA", text: "var(--color-warning-text)", Icon: AlertTriangle },
                  success: { bg: "var(--color-success-light)", border: "#BBF7D0", text: "var(--color-success-text)", Icon: CheckCircle },
                  info: { bg: "var(--color-primary-light)", border: "#C7D2FE", text: "var(--color-primary)", Icon: Lightbulb },
                }
                const style = colorMap[reco.type as keyof typeof colorMap] ?? colorMap.info
                return (
                  <div key={i} className="flex gap-2.5 p-3 rounded-[10px] items-start"
                    style={{ background: style.bg, border: `1px solid ${style.border}` }}>
                    <style.Icon size={15} className="shrink-0 mt-0.5" style={{ color: style.text }} />
                    <p className="text-[12px] leading-relaxed" style={{ color: style.text }}>
                      <strong>{reco.title}</strong> — {reco.description}
                    </p>
                  </div>
                )
              })}
            </div>
          </Card>
        )}

        {/* Chat */}

      </div>
    </div>
  )
}
