"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form } from "@/components/ui/form"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
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
    <Form {...form}>
      <form
        id={formId}
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex min-h-0 h-full"
      >
        {/* Left panel */}
        <ScrollArea className="w-[400px] shrink-0 h-full border-r border-[#F1F5F9]">
          <div className="flex flex-col gap-5 p-6 bg-white">
            <CompanySection />
            <Separator className="bg-[#F1F5F9]" />
            <JobSection />
            <Separator className="bg-[#F1F5F9]" />
            <SourceSection />
            <Separator className="bg-[#F1F5F9]" />
            <StatusSection />
            <Separator className="bg-[#F1F5F9]" />
            <ContactsSection />
          </div>
        </ScrollArea>

        {/* Right panel */}
        <ScrollArea className="flex-1 h-full bg-[#FAFAFA]">
          <div className="flex flex-col gap-5 p-6">
            <JobDescriptionSection />
            <CVSection />
            <NotesSection />
          </div>
        </ScrollArea>
      </form>
    </Form>
  )
}
