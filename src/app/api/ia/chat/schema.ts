import z from "zod";

/**
 * Mirrors ChatStreamRequest on the API side.
 *
 * Three valid shapes, enforced by the refine below:
 *  - conversation_id + question       → resume an existing thread
 *  - analyse_id + question            → new thread grounded on a stored analysis
 *  - cv_text + job_description + question → new thread with no analysis
 */
export const chatStreamSchema = z
    .object({
        question: z.string().min(1, "Question is required"),
        // Optional: a first message has no conversation yet — the API creates
        // it and returns its id in the first SSE frame.
        conversation_id: z.string().uuid().optional(),
        analyse_id: z.string().uuid().optional(),
        cv_text: z.string().optional(),
        job_description: z.string().optional(),
        score_global: z.number().int().min(0).max(100).optional(),
        // "recommandations", not "recommendations": the API kept the French
        // spelling of the Analyse model. A misspelled key is silently dropped.
        recommandations: z.array(z.any()).optional(),
    })
    .refine(
        (data) =>
            Boolean(data.conversation_id) ||
            Boolean(data.analyse_id) ||
            Boolean(data.cv_text && data.job_description),
        {
            message:
                "Provide conversation_id, or analyse_id, or both cv_text and job_description",
            path: ["conversation_id"],
        },
    )

export type ChatStreamSchemaInfer = z.infer<typeof chatStreamSchema>


export const chatStreamDecoder = {
    temporary_chat_stream_input: (inputs: unknown) => chatStreamSchema.safeParse(inputs),

}
