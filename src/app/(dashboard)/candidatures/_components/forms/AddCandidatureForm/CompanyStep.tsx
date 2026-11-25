import { Separator } from "@/components/ui/separator"
import { StepLayout } from "./StepLayout"
import { CompanySection } from "./CompanySection"
import { JobSection } from "./JobSection"
import { SourceSection } from "./SourceSection"
import { StatusSection } from "./StatusSection"

/** Step 2 — who the company is, the role, where the offer came from. */
export function CompanyStep() {
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
          <SourceSection />
          <Separator className="bg-[#E2E8F0]" />
          <StatusSection />
        </>
      }
    />
  )
}
