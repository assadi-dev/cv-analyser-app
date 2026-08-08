/**
 * Zod schemas for all application forms.
 *
 * Single source of truth for validation rules —
 * shared between React Hook Form resolvers and unit tests.
 */

import { z } from "zod"

// ─── Reusable field schemas ───────────────────────────────────────────────────

const emailSchema = z
  .string()
  .min(1, "L'adresse email est requise")
  .email("Adresse email invalide")

const passwordSchema = z
  .string()
  .min(1, "Le mot de passe est requis")
  .min(8, "8 caractères minimum")
  .regex(/[A-Z]/, "Au moins une majuscule requise")
  .regex(/\d/, "Au moins un chiffre requis")

// ─── Register ────────────────────────────────────────────────────────────────

export const registerSchema = z
  .object({
    firstName: z
      .string()
      .min(1, "Le prénom est requis")
      .min(2, "Le prénom doit contenir au moins 2 caractères")
      .max(50, "Le prénom ne peut pas dépasser 50 caractères"),

    lastName: z
      .string()
      .min(1, "Le nom est requis")
      .min(2, "Le nom doit contenir au moins 2 caractères")
      .max(50, "Le nom ne peut pas dépasser 50 caractères"),

    email: emailSchema,

    professionalTitle: z
      .string()
      .max(100, "Le titre ne peut pas dépasser 100 caractères")
      .optional()
      .or(z.literal("")),

    password: passwordSchema,

    confirmPassword: z.string().min(1, "La confirmation est requise"),

    acceptTerms: z
      .boolean()
      .refine((val) => val === true, {
        message: "Vous devez accepter les conditions d'utilisation",
      }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  })

export type RegisterFormValues = z.infer<typeof registerSchema>

// ─── Login ───────────────────────────────────────────────────────────────────

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Le mot de passe est requis"),
  rememberMe: z.boolean().default(false),
})

export type LoginFormValues = z.infer<typeof loginSchema>

// ─── Password strength helper ─────────────────────────────────────────────────

export function passwordStrength(password: string): 0 | 1 | 2 | 3 {
  if (!password) return 0
  let score = 0
  if (password.length >= 8) score++
  if (/[A-Z]/.test(password)) score++
  if (/\d/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++
  if (score <= 1) return 1
  if (score === 2) return 1
  if (score === 3) return 2
  return 3
}
