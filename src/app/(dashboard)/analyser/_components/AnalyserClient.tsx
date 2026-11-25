"use client"

import { useCallback, useEffect, useRef } from "react"
import { useAnalyse } from "../_hooks/useAnalyse"
import { useAnalyseStore } from "@/store/analyse.store"
import { AddCandidatureModal } from "@/app/(dashboard)/candidatures/_components/modals/AddCandidatureModal"
import { useAddToCandidatures } from "../_hooks/useAddToCandidatures"
import { useAnalyseCandidature } from "../_hooks/useAnalyseCandidature"
import { useChatPanel } from "../_hooks/useChatPanel"
import { useCvUpload } from "../_hooks/useCvUpload"
import { useJobDescription } from "../_hooks/useJobDescription"
import { useStoredCvSelection } from "../_hooks/useStoredCvSelection"
import { ChatBot } from "./ChatBot/ChatBot"
import { ChatPanel } from "./ChatBot/ChatPanel"

import { CandidatureContextBanner } from "./CandidatureContextBanner"
import { CvUploadCard } from "./CvUploadCard"
import { JobDescriptionCard } from "./JobDescriptionCard"
import { RecommendationsCard } from "./RecommendationsCard/RecommendationsCard"
import { ResultsCard } from "./ResultsCard/ResultsCard"
import { AddToCandidaturesConfirmModal } from "./modals/AddToCandidaturesConfirmModal"

interface AnalyserClientProps {
  /** The candidature the page was opened from, if any. */
  candidatureId?: string
}

export function AnalyserClient({ candidatureId }: AnalyserClientProps) {
  const { cvFile, selectCv } = useCvUpload()
  const { jobDescription, setJobDescription } = useJobDescription()
  const {
    candidature,
    linkedCv,
    jobDescription: candidatureJobDescription,
    isLoading: isCandidatureLoading,
    isError: isCandidatureError,
  } = useAnalyseCandidature(candidatureId)
  const { cvs: storedCvs, selectedCvId, selectStoredCv } = useStoredCvSelection(linkedCv?.id)

  // A stored CV and an uploaded file exclude each other: picking one drops the other.
  const handleSelectStoredCv = useCallback(
    (id: string) => {
      selectStoredCv(id)
      selectCv(null)
    },
    [selectStoredCv, selectCv]
  )

  // Pre-fill once, when the offer arrives: a later refetch must not overwrite
  // what the user has edited since.
  const hasPrefilled = useRef(false)
  useEffect(() => {
    if (hasPrefilled.current || !candidatureJobDescription) return
    hasPrefilled.current = true
    setJobDescription(candidatureJobDescription)
  }, [candidatureJobDescription, setJobDescription])
  const {
    result,
    isStreaming,
    canAnalyse,
    isLinkedCvUnreadable,
    progress,
    currentStep,
    analyse,
  } = useAnalyse({
    cvFile,
    jobDescription,
    // Only an id the API confirmed is sent: a wrong one would fail the whole
    // analysis with a 404 instead of just leaving it unattached.
    candidatureId: candidature?.id,
    // The stored CV picked in the select, which starts as the candidature's own.
    linkedCvId: selectedCvId,
  })
  const { isOpen, toggle, close } = useChatPanel()

  // The CV the analysis ran on: the stored one picked (or linked to the
  // candidature), or the one saved with an analysis that was reopened. An
  // uploaded file has no stored id to carry over.
  const analysedCvId = useAnalyseStore((s) => s.currentAnalyse?.cv_id)
  const addToCandidatures = useAddToCandidatures({
    jobDescription,
    cvId: (cvFile ? undefined : selectedCvId) ?? analysedCvId,
  })

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

        <CvUploadCard
          onSelect={selectCv}
          cvFile={cvFile}
          linkedCv={linkedCv}
          isLinkedCvUnreadable={isLinkedCvUnreadable}
          storedCvs={storedCvs}
          selectedCvId={selectedCvId}
          onSelectStoredCv={handleSelectStoredCv}
        />

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
        <ResultsCard
          result={result}
          // An analysis launched from a candidature is already attached to it.
          onAddToCandidatures={candidatureId ? undefined : addToCandidatures.start}
        />
        <RecommendationsCard recommendations={result?.recommandations ?? []} />
      </div>

      <AddToCandidaturesConfirmModal
        isOpen={addToCandidatures.isConfirmOpen}
        onClose={addToCandidatures.close}
        onConfirm={addToCandidatures.confirm}
      />

      <AddCandidatureModal
        isOpen={addToCandidatures.isFormOpen}
        onClose={addToCandidatures.close}
        onSubmit={addToCandidatures.submit}
        isPending={addToCandidatures.isPending}
        initialValues={addToCandidatures.initialValues}
      />

      {isOpen ? <ChatPanel result={result} recommendations={result?.recommandations ?? []} /> : <ChatBot isOpen={isOpen} toggle={toggle} close={close} />}
    </div>
  )
}
