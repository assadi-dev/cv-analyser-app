import { z } from "zod"

export const contactSchema = z.object({
  name:         z.string().min(1, "Nom requis"),
  contact_type: z.enum(["email", "phone"]),
  value:        z.string().min(1, "Valeur requise"),
})

export const addCandidatureSchema = z.object({
  company_name:    z.string().min(1, "Nom de l'entreprise requis"),
  company_city:    z.string().optional().default(""),
  job_title:       z.string().min(1, "Intitulé du poste requis"),
  contract_type:   z.enum(["CDI", "CDD", "Freelance", "Stage", "Alternance"]),
  work_mode:       z.enum(["remote", "hybrid", "on-site"]),
  source_platform: z.string().optional().default("LinkedIn"),
  source_name:     z.string().optional().default(""),
  source_url:      z.string().optional().default(""),
  status:          z.enum(["to_send", "sent", "interview", "rejected", "accepted"]),
  contacts:        z.array(contactSchema).default([]),
  job_description: z.string().optional().default(""),
  cv_id:           z.string().optional().default(""),
  // Lives in the form rather than in the dropzone's local state: the CV step
  // unmounts when the user moves on, and going back must still show the file.
  cv_file:         z
    .custom<File | null>((value) => value === null || (typeof File !== "undefined" && value instanceof File))
    .nullable()
    .default(null),
  notes:           z.string().optional().default(""),
})

export type AddCandidatureFormValues = z.infer<typeof addCandidatureSchema>

export const ADD_CANDIDATURE_DEFAULTS: AddCandidatureFormValues = {
  company_name:    "",
  company_city:    "",
  job_title:       "",
  contract_type:   "CDI",
  work_mode:       "remote",
  source_platform: "LinkedIn",
  source_name:     "",
  source_url:      "",
  status:          "to_send",
  contacts:        [],
  job_description: "",
  cv_id:           "",
  cv_file:         null,
  notes:           "",
}
