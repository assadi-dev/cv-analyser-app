import z from "zod";

export const CvSchema = z.object({
    id: z.string(),
    name: z.string(),
    file_size_kb: z.number(),
    mime_type: z.string(),
    is_default: z.boolean(),
    created_at: z.string(),
    updated_at: z.string()
})
