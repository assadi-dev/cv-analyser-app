import { api } from "@/lib/api"
import type { AIProvider } from "@/types"
import type { AiProviderFormValues } from "../_lib/ai-provider.schema"

export interface UpdateAiProviderPayload {
  ai_provider: AIProvider
  ai_model: string
  ai_api_key: string | null
  ai_base_url: string | null
}

export interface UpdateAiProviderResponse {
  ai_provider: AIProvider
  ai_model: string
  ai_base_url: string | null
}

export interface AiProviderTestResult {
  success: boolean
  provider: string
  model: string
  message: string
  latency_ms: number | null
}

function toPayload(values: AiProviderFormValues): UpdateAiProviderPayload {
  return {
    ai_provider: values.ai_provider,
    ai_model: values.ai_model,
    ai_api_key: values.ai_api_key.trim() || null,
    ai_base_url: values.ai_base_url.trim() || null,
  }
}

export const updateAiProvider = (values: AiProviderFormValues): Promise<UpdateAiProviderResponse> =>
  api.put<UpdateAiProviderResponse>("/api/preferences/ai-provider", toPayload(values))

// Tests whatever provider config is currently saved server-side — not the unsaved form draft.
export const testAiProvider = (): Promise<AiProviderTestResult> =>
  api.post<AiProviderTestResult>("/api/preferences/ai-provider/test", {})
