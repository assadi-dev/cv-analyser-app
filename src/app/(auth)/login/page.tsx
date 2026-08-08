"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useQueryState } from "nuqs"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Eye, EyeOff, Mail, Lock, Globe, Linkedin, Zap, Info } from "lucide-react"
import { signIn } from "@/lib/auth-client"
import { exchangeToken } from "@/lib/api"
import { Button } from "@/components/ui/Button"
import { cn } from "@/lib/utils"
import { loginSchema, type LoginFormValues } from "@/lib/schemas"
import { sendEncryptedCredentials } from "@/lib/security"
import { Checkbox } from "@/components/ui/checkbox"

export default function LoginPage() {
  const router = useRouter()
  const [showPwd, setShowPwd] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  /**
   * nuqs — URL search params.
   * - redirectTo: destination after successful login (e.g. ?redirectTo=/candidatures)
   * - error:      OAuth or session error message passed in the URL
   */
  const [redirectTo] = useQueryState("redirectTo", { defaultValue: "/analyser" })
  const [urlError] = useQueryState("error")

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "", rememberMe: false },
  })

  async function onSubmit(values: LoginFormValues) {
    setServerError(null)

    try {
      const result = await signIn.email({
        email: values.email.trim(),
        password: values.password,
        rememberMe: values.rememberMe,

      })

      if (result.error) throw new Error(result.error.message)


      router.push(redirectTo as any)
    } catch (err) {
      const msg = (err as Error).message ?? "Connexion échouée"
      setServerError(
        msg.toLowerCase().includes("invalid") || msg.toLowerCase().includes("credentials")
          ? "Email ou mot de passe incorrect."
          : msg,
      )
    }
  }

  async function handleOAuth(provider: "google" | "linkedin") {
    await signIn.social({ provider, callbackURL: redirectTo })
  }

  // Show URL-level error (e.g. OAuth failure redirected with ?error=...)
  const displayError = serverError ?? urlError

  return (
    <div className="flex h-screen">

      {/* ── Left panel — branding ── */}
      <div
        className="hidden lg:flex flex-col w-[620px] shrink-0 p-14 relative overflow-hidden"
        style={{ background: "linear-gradient(160deg, #0A0618 0%, #1E0A4A 50%, #0D1B3E 100%)" }}
      >
        <div className="flex items-center gap-2.5">
          <div className="w-[38px] h-[38px] rounded-[10px] flex items-center justify-center bg-gradient-primary-diagonal shrink-0">
            <span className="text-white font-black text-lg">M</span>
          </div>
          <span className="text-white text-[18px] font-black">MatchCV</span>
        </div>

        <div className="flex-1 flex flex-col justify-center gap-6">
          <span
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[12px] font-medium w-fit"
            style={{ background: "rgba(255,255,255,0.10)", color: "#C4B5FD" }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#A78BFA]" />
            Votre assistant personnel de candidature
          </span>

          <h2 className="text-[34px] font-black text-white leading-tight">
            Chaque candidature mérite une préparation sérieuse.
          </h2>

          <p className="text-[14px] leading-relaxed" style={{ color: "#94A3B8" }}>
            Analysez vos CV face aux offres qui vous intéressent, identifiez vos points faibles
            et améliorez vos chances avant même d&apos;envoyer votre candidature.
          </p>

          <div className="flex gap-0 pt-2">
            {[
              { value: "Score ATS", label: "par offre analysée" },
              { value: "Écarts", label: "identifiés en un clin d'œil" },
              { value: "Conseils", label: "IA personnalisés" },
            ].map((stat, i) => (
              <div key={stat.value} className="flex gap-0 items-center">
                {i > 0 && <div className="w-px h-10 mx-5" style={{ background: "rgba(255,255,255,0.1)" }} />}
                <div className="flex flex-col gap-1">
                  <span className="text-[22px] font-black text-white">{stat.value}</span>
                  <span className="text-[12px]" style={{ color: "#64748B" }}>{stat.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div
          className="rounded-[14px] p-5 flex flex-col gap-3"
          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
        >
          <p className="text-[13px] leading-relaxed" style={{ color: "#CBD5E1" }}>
            &quot;J&apos;utilise cet outil avant chaque candidature. En 5 minutes je sais exactement ce que je dois ajuster.&quot;
          </p>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-gradient-primary-diagonal" />
            <div>
              <div className="text-[12px] font-semibold text-white">Note personnelle</div>
              <div className="text-[11px]" style={{ color: "#64748B" }}>Ajoutée après ma 1ère analyse</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Right panel — form ── */}
      <div className="flex-1 flex items-center justify-center px-8 bg-white">
        <div className="w-full max-w-[420px] flex flex-col gap-8">

          <div>
            <h1 className="text-[30px] font-black" style={{ color: "var(--color-text-primary)" }}>
              Bon retour !
            </h1>
            <p className="text-[14px] mt-1" style={{ color: "var(--color-text-muted)" }}>
              Connectez-vous pour accéder à votre espace MatchCV
            </p>
          </div>

          {/* Social */}
          <div className="flex gap-3">
            <Button variant="ghost" className="flex-1" onClick={() => handleOAuth("google")}>
              <Globe size={18} /> Google
            </Button>
            <Button variant="ghost" className="flex-1" onClick={() => handleOAuth("linkedin")}>
              <Linkedin size={18} /> LinkedIn
            </Button>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px" style={{ background: "var(--color-border)" }} />
            <span className="text-[12px]" style={{ color: "var(--color-text-subtle)" }}>ou avec votre email</span>
            <div className="flex-1 h-px" style={{ background: "var(--color-border)" }} />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>

            <div>
              <label className="block text-[13px] font-semibold mb-1.5" style={{ color: "var(--color-text-secondary)" }}>
                Adresse email
              </label>
              <div className="relative flex items-center">
                <Mail size={15} className="absolute left-3 pointer-events-none" style={{ color: "var(--color-text-subtle)" }} />
                <input
                  {...register("email")}
                  type="email"
                  placeholder="vous@exemple.com"
                  autoComplete="email"
                  className={cn(
                    "w-full h-[46px] pl-10 pr-3 rounded-[8px] text-[13px] outline-none transition-all border",
                    "bg-[var(--color-surface-muted)] focus:bg-white focus:border-[var(--color-primary)]",
                    "placeholder:text-[var(--color-text-subtle)]",
                    errors.email ? "border-[var(--color-danger)]" : "border-[var(--color-border)]",
                  )}
                  style={{ color: "var(--color-text-secondary)" }}
                />
              </div>
              {errors.email && (
                <p className="flex items-center gap-1 text-[11px] mt-1" style={{ color: "var(--color-danger-text)" }}>
                  <Info size={11} /> {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[13px] font-semibold" style={{ color: "var(--color-text-secondary)" }}>
                  Mot de passe
                </label>
                <button type="button" className="text-[12px] hover:underline" style={{ color: "var(--color-primary)" }}>
                  Mot de passe oublié ?
                </button>
              </div>
              <div className="relative flex items-center">
                <Lock size={15} className="absolute left-3 pointer-events-none" style={{ color: "var(--color-text-subtle)" }} />
                <input
                  {...register("password")}
                  type={showPwd ? "text" : "password"}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className={cn(
                    "w-full h-[46px] pl-10 pr-10 rounded-[8px] text-[13px] outline-none transition-all border",
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
                  {showPwd ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {errors.password && (
                <p className="flex items-center gap-1 text-[11px] mt-1" style={{ color: "var(--color-danger-text)" }}>
                  <Info size={11} /> {errors.password.message}
                </p>
              )}
            </div>

            {/* Error */}
            {displayError && (
              <div
                className="flex items-center gap-2 px-3 py-2.5 rounded-[8px] text-[12px]"
                style={{ background: "var(--color-danger-light)", color: "var(--color-danger-text)" }}
              >
                <Info size={14} className="shrink-0" />
                {displayError}
              </div>
            )}

            {/* Remember me */}
            <label className="flex items-center gap-2">
              <Checkbox
                {...register("rememberMe")}


              />
              <span className="text-sm text-gray-600">Se souvenir de moi</span>
            </label>

            <Button type="submit" size="lg" loading={isSubmitting} className="w-full mt-1">
              <Zap size={18} /> Se connecter
            </Button>
          </form>

          <p className="text-center text-[13px]" style={{ color: "var(--color-text-muted)" }}>
            Pas encore de compte ?{" "}
            <Link href="/register" className="font-bold hover:underline" style={{ color: "var(--color-primary)" }}>
              Créer un compte
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
