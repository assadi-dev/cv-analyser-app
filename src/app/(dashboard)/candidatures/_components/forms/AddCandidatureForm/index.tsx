"use client"

import { useForm, FormProvider } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  addCandidatureSchema,
  ADD_CANDIDATURE_DEFAULTS,
  type AddCandidatureFormValues,
} from "../../../_lib/add-candidature.schema"
import { CompanySection } from "./CompanySection"
import { JobSection } from "./JobSection"
import { SourceSection } from "./SourceSection"
import { StatusSection } from "./StatusSection"
import { ContactsSection } from "./ContactsSection"
import { JobDescriptionSection } from "./JobDescriptionSection"
import { CVSection } from "./CVSection"
import { NotesSection } from "./NotesSection"

interface AddCandidatureFormProps {
  formId: string
  onSubmit: (values: AddCandidatureFormValues) => void
}

export function AddCandidatureForm({ formId, onSubmit }: AddCandidatureFormProps) {
  const form = useForm<AddCandidatureFormValues>({
    resolver: zodResolver(addCandidatureSchema),
    defaultValues: ADD_CANDIDATURE_DEFAULTS,
  })

  return (
    <FormProvider {...form}>
      <form
        id={formId}
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex min-h-0"
      >
        {/* Left panel — company, job, source, status, contacts */}
        <div className="w-[400px] shrink-0 flex flex-col gap-4 p-6 bg-white border-r border-[#F1F5F9] overflow-y-auto">
          <CompanySection />
          <div className="h-px bg-[#F1F5F9]" />
          <JobSection />
          <div className="h-px bg-[#F1F5F9]" />
          <SourceSection />
          <div className="h-px bg-[#F1F5F9]" />
          <StatusSection />
          <div className="h-px bg-[#F1F5F9]" />
          <ContactsSection />
        </div>

        {/* Right panel — job description, CV, notes */}
        <div className="flex-1 flex flex-col gap-4 p-6 bg-[#FAFAFA] overflow-y-auto">
          <JobDescriptionSection />
          <CVSection />
          <NotesSection />
        </div>
      </form>
    </FormProvider>
  )
}
