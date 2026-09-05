import { z } from "zod"
import { getAIProvider } from "./ai-providers.config"

export const aiProviderSchema = z
  .object({
    ai_provider: z.enum(["openai", "anthropic", "groq", "mistral", "openrouter", "ollama"]),
    ai_model: z.string().min(1, "Le modèle est requis"),
    // Never prefilled from the server (only an encrypted blob comes back) — required
    // again on every save unless the provider is Ollama, mirroring the backend rule.
    ai_api_key: z.string().optional().default(""),
    ai_base_url: z.string().optional().default(""),
  })
  .refine((data) => data.ai_provider === "ollama" || data.ai_api_key.trim().length > 0, {
    message: "La clé API est requise pour ce provider",
    path: ["ai_api_key"],
  })

export type AiProviderFormValues = z.infer<typeof aiProviderSchema>

export function getAiProviderDefaults(overrides?: {
  ai_provider?: AiProviderFormValues["ai_provider"]
  ai_model?: string
  ai_base_url?: string | null
}): AiProviderFormValues {
  const provider = getAIProvider(overrides?.ai_provider ?? "openai")
  return {
    ai_provider: provider.id,
    ai_model: overrides?.ai_model || provider.models[0] || "",
    ai_api_key: "",
    ai_base_url: (provider.local ? overrides?.ai_base_url || provider.defaultBaseUrl : "") ?? "",
  }
}
