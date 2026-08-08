"use client"

import { useAnalyse } from "../_hooks/useAnalyse"
import { useChatPanel } from "../_hooks/useChatPanel"
import { useCvUpload } from "../_hooks/useCvUpload"
import { useJobDescription } from "../_hooks/useJobDescription"
import { ChatBot } from "./ChatBot/ChatBot"
import { ChatPanel, ChatPopover } from "./ChatBot/ChatPanel.tsx"
import { CvUploadCard } from "./CvUploadCard"
import { JobDescriptionCard } from "./JobDescriptionCard"
import { RecommendationsCard } from "./RecommendationsCard/RecommendationsCard"
import { ResultsCard } from "./ResultsCard/ResultsCard"

export function AnalyserClient() {
  const { cvFile, selectCv } = useCvUpload()
  const { jobDescription, setJobDescription } = useJobDescription()
  const { result, isStreaming, canAnalyse, progress, currentStep, analyse } = useAnalyse({
    cvFile,
    jobDescription,
  })
  const { isOpen, toggle, close } = useChatPanel()

  return (
    <div className="relative flex flex-col lg:flex-row gap-5 p-4 sm:p-8 lg:h-full">
      {/* ── Colonne gauche — saisie ── */}
      <div className="flex flex-col gap-4 w-full lg:w-[500px] lg:shrink-0">
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
      <div className="flex flex-col gap-4 flex-1 min-w-0">
        <ResultsCard result={result} />
        <RecommendationsCard recommendations={result?.recommandations ?? []} />
      </div>

      {isOpen ? <ChatPanel /> : <ChatBot isOpen={isOpen} toggle={toggle} close={close} />}
    </div>
  )
}
