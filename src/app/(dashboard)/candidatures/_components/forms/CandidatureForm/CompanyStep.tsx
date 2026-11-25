import { Separator } from "@/components/ui/separator"
import type { CandidatureStepProps } from "./CandidatureStepProps"
import { StepLayout } from "./StepLayout"
import { CompanySection } from "./CompanySection"
import { JobSection } from "./JobSection"
import { SourceSection } from "./SourceSection"
import { StatusSection } from "./StatusSection"

/** Step "Entreprise" — who the company is, the role, where the offer came from. */
export function CompanyStep({ mode }: CandidatureStepProps) {
  return (
    <StepLayout
      left={
        <>
          <CompanySection />
          <Separator className="bg-[#E2E8F0]" />
          <JobSection />
        </>
      }
      right={
        <>
          {/* The API never returns the offer name, so an edit form could only
              show it empty — and invite overwriting it blind. */}
          <SourceSection showOfferName={mode === "create"} />
          <Separator className="bg-[#E2E8F0]" />
          <StatusSection label={mode === "create" ? "Statut initial" : "Statut"} />
        </>
      }
    />
  )
}
