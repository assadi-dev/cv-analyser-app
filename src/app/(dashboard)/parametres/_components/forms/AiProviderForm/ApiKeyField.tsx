"use client"

import { useState } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import { Key, Eye, EyeOff } from "lucide-react"
import { Input } from "@/components/ui/input"
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import type { AiProviderFormValues } from "../../../_lib/ai-provider.schema"

const LABEL_CLS = "text-[12px] font-semibold"
const LABEL_STYLE = { color: "var(--color-text-secondary)" }

export function ApiKeyField() {
  const [showKey, setShowKey] = useState(false)
  const form = useFormContext<AiProviderFormValues>()
  const isOllama = useWatch({ control: form.control, name: "ai_provider" }) === "ollama"

  return (
    <FormField
      control={form.control}
      name="ai_api_key"
      render={({ field }) => (
        <FormItem>
          <FormLabel className={LABEL_CLS} style={LABEL_STYLE}>
            Clé API{isOllama ? " (Ollama Cloud)" : ""}
          </FormLabel>
          <FormControl>
            <div className="relative">
              <Key size={14} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "var(--color-text-subtle)" }} />
              <Input
                type={showKey ? "text" : "password"}
                placeholder={isOllama ? "Laisser vide pour un serveur local" : "sk-••••••••••••••••••••"}
                className="pl-9 pr-9"
                {...field}
              />
              <button
                type="button"
                onClick={() => setShowKey((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
                style={{ color: "var(--color-text-subtle)" }}
              >
                {showKey ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </FormControl>
          <p className="text-[11px]" style={{ color: "var(--color-text-subtle)" }}>
            {isOllama
              ? "Requise uniquement pour Ollama Cloud — laissez vide pour un serveur local. Comme les autres clés, elle doit être ressaisie à chaque enregistrement."
              : "Doit être ressaisie à chaque enregistrement, même pour changer uniquement le modèle."}
          </p>
          <FormMessage className="text-[11px]" />
        </FormItem>
      )}
    />
  )
}
