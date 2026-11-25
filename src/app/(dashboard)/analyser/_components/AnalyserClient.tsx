"use client"

import { useEffect, useRef } from "react"
import { useAnalyse } from "../_hooks/useAnalyse"
import { useAnalyseCandidature } from "../_hooks/useAnalyseCandidature"
import { useChatPanel } from "../_hooks/useChatPanel"
import { useCvUpload } from "../_hooks/useCvUpload"
import { useJobDescription } from "../_hooks/useJobDescription"
import { ChatBot } from "./ChatBot/ChatBot"
import { ChatPanel } from "./ChatBot/ChatPanel"

import { CandidatureContextBanner } from "./CandidatureContextBanner"
import { CvUploadCard } from "./CvUploadCard"
import { JobDescriptionCard } from "./JobDescriptionCard"
import { RecommendationsCard } from "./RecommendationsCard/RecommendationsCard"
import { ResultsCard } from "./ResultsCard/ResultsCard"

interface AnalyserClientProps {
  /** The candidature the page was opened from, if any. */
  candidatureId?: string
}

export function AnalyserClient({ candidatureId }: AnalyserClientProps) {
  const { cvFile, selectCv } = useCvUpload()
  const { jobDescription, setJobDescription } = useJobDescription()
  const {
    candidature,
    jobDescription: candidatureJobDescription,
    isLoading: isCandidatureLoading,
    isError: isCandidatureError,
  } = useAnalyseCandidature(candidatureId)

  // Pre-fill once, when the offer arrives: a later refetch must not overwrite
  // what the user has edited since.
  const hasPrefilled = useRef(false)
  useEffect(() => {
    if (hasPrefilled.current || !candidatureJobDescription) return
    hasPrefilled.current = true
    setJobDescription(candidatureJobDescription)
  }, [candidatureJobDescription, setJobDescription])
  const { result, isStreaming, canAnalyse, progress, currentStep, analyse } = useAnalyse({
    cvFile,
    jobDescription,
    // Only an id the API confirmed is sent: a wrong one would fail the whole
    // analysis with a 404 instead of just leaving it unattached.
    candidatureId: candidature?.id,
  })
  const { isOpen, toggle, close } = useChatPanel()

  return (
    <div className="relative flex flex-col lg:flex-row  sm:p-8 lg:h-full">
      {/* ── Colonne gauche — saisie ── */}
      <div className="flex flex-col gap-4 w-full lg:w-[500px] lg:shrink-0">
        {candidatureId && (
          <CandidatureContextBanner
            candidature={candidature}
            isLoading={isCandidatureLoading}
            isError={isCandidatureError}
            isJobDescriptionPrefilled={Boolean(candidatureJobDescription)}
          />
        )}

        <CvUploadCard onSelect={selectCv} cvFile={cvFile} />

        <JobDescriptionCard
          value={jobDescription}
          onChange={setJobDescription}
          onAnalyse={analyse}
          canAnalyse={canAnalyse}
          isStreaming={isStreaming}
          progress={progress}
          currentStep={currentStep}
        />
      </div>

      {/* ── Colonne droite — résultats ── */}
      <div className="flex flex-col gap-4  px-4 flex-1 min-w-0 overflow-y-auto">
        <ResultsCard result={result} />
        <RecommendationsCard recommendations={result?.recommandations ?? []} />
      </div>

      {isOpen ? <ChatPanel result={result} recommendations={result?.recommandations ?? []} /> : <ChatBot isOpen={isOpen} toggle={toggle} close={close} />}
    </div>
  )
}
