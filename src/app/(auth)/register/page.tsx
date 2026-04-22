"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useQueryState } from "nuqs"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Eye, EyeOff, Mail, Lock, User, Briefcase,
  Globe, Linkedin, UserPlus, Check, Info,
} from "lucide-react"
import { signIn, signUp } from "@/lib/auth-client"
import { exchangeToken, api } from "@/lib/api"
import { Button } from "@/components/ui/Button"
import { cn } from "@/lib/utils"
import { registerSchema, passwordStrength, type RegisterFormValues } from "@/lib/schemas"
import { useState } from "react"

// ─── Password strength bar ────────────────────────────────────────────────────

function PasswordStrengthBar({ password }: { password: string }) {
  const strength = passwordStrength(password)
  if (!password) return null
  const labels = ["", "Faible", "Moyen", "Fort"]
  const colors = ["", "#EF4444", "#FBBF24", "#10B981"]
  return (
    <div className="flex items-center gap-2 mt-1">
      <div className="flex gap-1 flex-1">
        {[1, 2, 3].map((level) => (
          <div
            key={level}
            className="h-1 flex-1 rounded-full transition-all duration-300"
            style={{ background: strength >= level ? colors[strength] : "var(--color-border)" }}
          />
        ))}
      </div>
      <span className="text-[11px] font-medium shrink-0" style={{ color: colors[strength] }}>
        {labels[strength]}
      </span>
    </div>
  )
}

// ─── Field wrapper ────────────────────────────────────────────────────────────

function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return (
    <p className="flex items-center gap-1 text-[11px] mt-1" style={{ color: "var(--color-danger-text)" }}>
      <Info size={11} className="shrink-0" /> {message}
    </p>
  )
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function RegisterPage() {
  const router = useRouter()

  /**
   * nuqs — URL search params.
   * - redirectTo: where to go after successful registration
   * - error:      server error message surfaced in the URL (useful for OAuth errors)
   */
  const [redirectTo]    = useQueryState("redirectTo", { defaultValue: "/analyser" })
  const [urlError]      = useQueryState("error")

  const [showPwd, setShowPwd]         = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [serverError, setServerError] = useState<string | null>(urlError)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName:         "",
      lastName:          "",
      email:             "",
      professionalTitle: "",
      password:          "",
      confirmPassword:   "",
      acceptTerms:       false,
    },
  })

  const password      = watch("password")
  const confirmPwd    = watch("confirmPassword")
  const acceptTerms   = watch("acceptTerms")

  async function onSubmit(values: RegisterFormValues) {
    setServerError(null)

    try {
      // 1 — Create account via better-auth
      const result = await signUp.email({
        email:    values.email.trim(),
        password: values.password,
        name:     `${values.firstName.trim()} ${values.lastName.trim()}`,
      })

      if (result.error) {
        throw new Error(result.error.message ?? "Inscription échouée")
      }

      // 2 — Token exchange with FastAPI (one-time bridge)
      const sessionToken = (result.data as any)?.session?.token ?? ""
      if (sessionToken) {
        await exchangeToken(sessionToken)
      }

      // 3 — Sync extended profile to FastAPI
      await api.patch("/api/v1/settings/profile", {
        first_name:         values.firstName.trim(),
        last_name:          values.lastName.trim(),
        professional_title: values.professionalTitle?.trim() || null,
      })

      router.push(redirectTo)
    } catch (err) {
      const msg = (err as Error).message ?? "Une erreur est survenue"
      setServerError(
        msg.toLowerCase().includes("already") || msg.toLowerCase().includes("email")
          ? "Un compte existe déjà avec cette adresse email."
          : msg,
      )
    }
  }

  async function handleOAuth(provider: "google" | "linkedin") {
    await signIn.social({ provider, callbackURL: redirectTo })
  }

  const STEPS = [
    "Créez votre compte en quelques secondes",
    "Uploadez votre CV (PDF, DOCX)",
    "Analysez et obtenez votre score IA",
  ]

  return (
    <div className="flex h-screen overflow-hidden">

      {/* ── Left branding panel ── */}
      <div
        className="hidden lg:flex flex-col w-[580px] shrink-0 p-14 overflow-hidden"
        style={{ background: "linear-gradient(160deg, #0A0618 0%, #1E0A4A 50%, #0D1B3E 100%)" }}
      >
        <div className="flex items-center gap-2.5">
          <div className="w-[38px] h-[38px] rounded-[10px] flex items-center justify-center bg-gradient-primary-diagonal shrink-0">
            <span className="text-white font-black text-lg">M</span>
          </div>
          <span className="text-white text-[18px] font-black">MatchCV</span>
        </div>

        <div className="flex-1 flex flex-col justify-center gap-5">
          <span
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[12px] font-medium w-fit"
            style={{ background: "rgba(255,255,255,0.10)", color: "#C4B5FD" }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#A78BFA]" />
            Rejoignez MatchCV gratuitement
          </span>

          <h2 className="text-[32px] font-black text-white leading-tight">
            Votre recherche d&apos;emploi commence ici.
          </h2>

          <p className="text-[14px] leading-relaxed" style={{ color: "#94A3B8" }}>
            Créez votre espace en 30 secondes et analysez votre premier CV immédiatement.
          </p>

          <div className="flex flex-col gap-3.5 pt-2">
            {STEPS.map((step, i) => (
              <div key={i} className="flex items-center gap-3">
                <div
                  className={cn(
                    "w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-[12px] font-bold",
                    i === 0 ? "bg-gradient-primary-diagonal text-white" : "text-[#64748B]",
                  )}
                  style={i !== 0 ? { background: "rgba(255,255,255,0.08)" } : {}}
                >
                  {i === 0 ? <Check size={13} /> : i + 1}
                </div>
                <span className="text-[13px]" style={{ color: i === 0 ? "#CBD5E1" : "#64748B" }}>
                  {step}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div
          className="flex items-center gap-3 p-4 rounded-[14px]"
          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
        >
          <div className="w-9 h-9 rounded-full bg-gradient-primary-diagonal flex items-center justify-center shrink-0">
            <span className="text-white font-bold text-[15px]">K</span>
          </div>
          <div>
            <p className="text-[12px] leading-relaxed" style={{ color: "#CBD5E1" }}>
              &quot;J&apos;ai eu mon premier entretien 4 jours après avoir utilisé MatchCV. Indispensable.&quot;
            </p>
            <p className="text-[11px] mt-1" style={{ color: "#64748B" }}>
              Karim B. — Ingénieur recruté chez Airbus
            </p>
          </div>
        </div>
      </div>

      {/* ── Right form panel ── */}
      <div className="flex-1 overflow-y-auto flex items-start lg:items-center justify-center px-8 py-10 bg-white">
        <div className="w-full max-w-[460px] flex flex-col gap-5">

          <div>
            <h1 className="text-[28px] font-black" style={{ color: "var(--color-text-primary)" }}>
              Créer un compte
            </h1>
            <p className="text-[14px] mt-1" style={{ color: "var(--color-text-muted)" }}>
              Rejoignez MatchCV et optimisez chaque candidature
            </p>
          </div>

          {/* Social */}
          <div className="flex gap-2.5">
            <Button variant="ghost" className="flex-1 h-11" onClick={() => handleOAuth("google")}>
              <Globe size={17} /> Google
            </Button>
            <Button variant="ghost" className="flex-1 h-11" onClick={() => handleOAuth("linkedin")}>
              <Linkedin size={17} /> LinkedIn
            </Button>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px" style={{ background: "var(--color-border)" }} />
            <span className="text-[12px]" style={{ color: "var(--color-text-subtle)" }}>ou avec votre email</span>
            <div className="flex-1 h-px" style={{ background: "var(--color-border)" }} />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>

            {/* First name + Last name */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[12px] font-semibold mb-1.5" style={{ color: "var(--color-text-secondary)" }}>
                  Prénom
                </label>
                <div className="relative flex items-center">
                  <User size={14} className="absolute left-3 pointer-events-none" style={{ color: "var(--color-text-subtle)" }} />
                  <input
                    {...register("firstName")}
                    type="text"
                    placeholder="Votre prénom"
                    autoComplete="given-name"
                    className={cn(
                      "w-full h-[42px] pl-9 pr-3 rounded-[8px] text-[12px] outline-none transition-all border",
                      "bg-[var(--color-surface-muted)] focus:bg-white focus:border-[var(--color-primary)]",
                      "placeholder:text-[var(--color-text-subtle)]",
                      errors.firstName ? "border-[var(--color-danger)]" : "border-[var(--color-border)]",
                    )}
                    style={{ color: "var(--color-text-secondary)" }}
                  />
                </div>
                <FieldError message={errors.firstName?.message} />
              </div>

              <div>
                <label className="block text-[12px] font-semibold mb-1.5" style={{ color: "var(--color-text-secondary)" }}>
                  Nom
                </label>
                <div className="relative flex items-center">
                  <User size={14} className="absolute left-3 pointer-events-none" style={{ color: "var(--color-text-subtle)" }} />
                  <input
                    {...register("lastName")}
                    type="text"
                    placeholder="Votre nom"
                    autoComplete="family-name"
                    className={cn(
                      "w-full h-[42px] pl-9 pr-3 rounded-[8px] text-[12px] outline-none transition-all border",
                      "bg-[var(--color-surface-muted)] focus:bg-white focus:border-[var(--color-primary)]",
                      "placeholder:text-[var(--color-text-subtle)]",
                      errors.lastName ? "border-[var(--color-danger)]" : "border-[var(--color-border)]",
                    )}
                    style={{ color: "var(--color-text-secondary)" }}
                  />
                </div>
                <FieldError message={errors.lastName?.message} />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-[12px] font-semibold mb-1.5" style={{ color: "var(--color-text-secondary)" }}>
                Adresse email
              </label>
              <div className="relative flex items-center">
                <Mail size={14} className="absolute left-3 pointer-events-none" style={{ color: "var(--color-text-subtle)" }} />
                <input
                  {...register("email")}
                  type="email"
                  placeholder="vous@exemple.com"
                  autoComplete="email"
                  className={cn(
                    "w-full h-[42px] pl-9 pr-3 rounded-[8px] text-[12px] outline-none transition-all border",
                    "bg-[var(--color-surface-muted)] focus:bg-white focus:border-[var(--color-primary)]",
                    "placeholder:text-[var(--color-text-subtle)]",
                    errors.email ? "border-[var(--color-danger)]" : "border-[var(--color-border)]",
                  )}
                  style={{ color: "var(--color-text-secondary)" }}
                />
              </div>
              <FieldError message={errors.email?.message} />
            </div>

            {/* Professional title — optional */}
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <label className="text-[12px] font-semibold" style={{ color: "var(--color-text-secondary)" }}>
                  Titre professionnel
                </label>
                <span
                  className="text-[10px] px-1.5 py-0.5 rounded-[6px]"
                  style={{ background: "var(--color-surface-muted)", color: "var(--color-text-subtle)" }}
                >
                  optionnel
                </span>
              </div>
              <div className="relative flex items-center">
                <Briefcase size={14} className="absolute left-3 pointer-events-none" style={{ color: "var(--color-text-subtle)" }} />
                <input
                  {...register("professionalTitle")}
                  type="text"
                  placeholder="Ex: Développeur Full Stack"
                  autoComplete="organization-title"
                  className={cn(
                    "w-full h-[42px] pl-9 pr-3 rounded-[8px] text-[12px] outline-none transition-all border",
                    "border-[var(--color-border)] bg-[var(--color-surface-muted)] focus:bg-white focus:border-[var(--color-primary)]",
                    "placeholder:text-[var(--color-text-subtle)]",
                  )}
                  style={{ color: "var(--color-text-secondary)" }}
                />
              </div>
            </div>

            {/* Password + Confirm */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[12px] font-semibold mb-1.5" style={{ color: "var(--color-text-secondary)" }}>
                  Mot de passe
                </label>
                <div className="relative flex items-center">
                  <Lock size={14} className="absolute left-3 pointer-events-none" style={{ color: "var(--color-text-subtle)" }} />
                  <input
                    {...register("password")}
                    type={showPwd ? "text" : "password"}
                    placeholder="••••••••"
                    autoComplete="new-password"
                    className={cn(
                      "w-full h-[42px] pl-9 pr-9 rounded-[8px] text-[12px] outline-none transition-all border",
                      "bg-[var(--color-surface-muted)] focus:bg-white focus:border-[var(--color-primary)]",
                      "placeholder:text-[var(--color-text-subtle)]",
                      errors.password ? "border-[var(--color-danger)]" : "border-[var(--color-border)]",
                    )}
                    style={{ color: "var(--color-text-secondary)" }}
                  />
                  <button
                    type="button"
                    className="absolute right-3"
                    onClick={() => setShowPwd(!showPwd)}
                    style={{ color: "var(--color-text-subtle)" }}
                  >
                    {showPwd ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
                <PasswordStrengthBar password={password} />
                <FieldError message={errors.password?.message} />
              </div>

              <div>
                <label className="block text-[12px] font-semibold mb-1.5" style={{ color: "var(--color-text-secondary)" }}>
                  Confirmer
                </label>
                <div className="relative flex items-center">
                  <Lock size={14} className="absolute left-3 pointer-events-none" style={{ color: "var(--color-text-subtle)" }} />
                  <input
                    {...register("confirmPassword")}
                    type={showConfirm ? "text" : "password"}
                    placeholder="••••••••"
                    autoComplete="new-password"
                    className={cn(
                      "w-full h-[42px] pl-9 pr-9 rounded-[8px] text-[12px] outline-none transition-all border",
                      "bg-[var(--color-surface-muted)] focus:bg-white focus:border-[var(--color-primary)]",
                      "placeholder:text-[var(--color-text-subtle)]",
                      errors.confirmPassword
                        ? "border-[var(--color-danger)]"
                        : confirmPwd && confirmPwd === password
                          ? "border-[var(--color-success)]"
                          : "border-[var(--color-border)]",
                    )}
                    style={{ color: "var(--color-text-secondary)" }}
                  />
                  <button
                    type="button"
                    className="absolute right-3"
                    onClick={() => setShowConfirm(!showConfirm)}
                    style={{ color: "var(--color-text-subtle)" }}
                  >
                    {showConfirm ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
                {confirmPwd && confirmPwd === password && (
                  <p className="flex items-center gap-1 text-[11px] mt-1" style={{ color: "var(--color-success-text)" }}>
                    <Check size={11} /> Identiques
                  </p>
                )}
                <FieldError message={errors.confirmPassword?.message} />
              </div>
            </div>

            {/* Password hint */}
            <p className="flex items-center gap-1.5 text-[11px] -mt-2" style={{ color: "var(--color-text-subtle)" }}>
              <Info size={11} />
              8 caractères minimum, une majuscule et un chiffre
            </p>

            {/* Terms */}
            <div>
              <label className="flex items-start gap-3 cursor-pointer">
                <div
                  className={cn(
                    "w-[18px] h-[18px] rounded-[5px] mt-0.5 shrink-0 flex items-center justify-center transition-colors border",
                    acceptTerms
                      ? "bg-[var(--color-primary)] border-[var(--color-primary)]"
                      : "border-[var(--color-border)] bg-[var(--color-surface-muted)]",
                  )}
                  onClick={() => setValue("acceptTerms", !acceptTerms, { shouldValidate: true })}
                >
                  {acceptTerms && <Check size={11} className="text-white" />}
                </div>
                <span className="text-[12px] leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
                  J&apos;accepte les{" "}
                  <span className="font-semibold" style={{ color: "var(--color-primary)" }}>Conditions d&apos;utilisation</span>
                  {" "}et la{" "}
                  <span className="font-semibold" style={{ color: "var(--color-primary)" }}>Politique de confidentialité</span>
                </span>
              </label>
              <FieldError message={errors.acceptTerms?.message} />
            </div>

            {/* Server error */}
            {serverError && (
              <div
                className="flex items-center gap-2 px-3 py-2.5 rounded-[8px] text-[12px]"
                style={{ background: "var(--color-danger-light)", color: "var(--color-danger-text)" }}
              >
                <Info size={14} className="shrink-0" />
                {serverError}
              </div>
            )}

            <Button type="submit" size="lg" loading={isSubmitting} className="w-full mt-1">
              <UserPlus size={18} /> Créer mon compte
            </Button>
          </form>

          <p className="text-center text-[13px]" style={{ color: "var(--color-text-muted)" }}>
            Vous avez déjà un compte ?{" "}
            <Link href="/login" className="font-bold hover:underline" style={{ color: "var(--color-primary)" }}>
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
