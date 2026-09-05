import z from "zod";

export const aiProviderPreferencesBodySchema = z.object({
    ai_provider: z.enum(["openai", "anthropic", "groq", "mistral", "openrouter", "ollama"]),
    ai_model: z.string().min(1, "AI model cannot be empty"),
    ai_api_key: z.string().nullable(),
    // Only meaningful for Ollama server-side — every other provider ignores it.
    ai_base_url: z.string().nullable().optional(),
})

export type AIProviderPreferencesBody = z.infer<typeof aiProviderPreferencesBodySchema>



export const aiProviderPreferencesValidator = {
    body: (inputs: unknown) => aiProviderPreferencesBodySchema.safeParse(inputs),

}