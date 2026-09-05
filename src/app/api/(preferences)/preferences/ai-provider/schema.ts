import z from "zod";

export const aiProviderPreferencesBodySchema = z.object({
    ai_provider: z.string().min(1, "AI provider cannot be empty"),
    ai_model: z.string().min(1, "AI model cannot be empty"),
    ai_api_key: z.string().nullable(),
    ai_base_url: z.string().min(1, "AI base URL cannot be empty"),

})

export type AIProviderPreferencesBody = z.infer<typeof aiProviderPreferencesBodySchema>



export const aiProviderPreferencesValidator = {
    body: (inputs: unknown) => aiProviderPreferencesBodySchema.safeParse(inputs),

}