import { z } from "zod"

export const profilSchema = z.object({
  first_name: z.string().trim().min(1, "Le prénom est requis").max(100),
  last_name: z.string().trim().min(1, "Le nom est requis").max(100),
  professional_title: z.string().trim().max(200).optional().default(""),
})

export type ProfilFormValues = z.infer<typeof profilSchema>

export const PROFIL_DEFAULTS: ProfilFormValues = {
  first_name: "",
  last_name: "",
  professional_title: "",
}
