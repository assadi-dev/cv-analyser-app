import z from "zod";

export const chatStreamSchema = z.object({
    question: z.string().min(1, "Question is required"),
    conversation_id: z.string().min(1, "Conversation ID is required"),
    cv_text: z.string().optional(),
    job_description: z.string().optional(),
    score_global: z.number().optional(),
    recommendations: z.array(z.any()).optional(),


})

export type ChatStreamSchemaInfer = z.infer<typeof chatStreamSchema>


export const chatStreamDecoder = {
    temporary_chat_stream_input: (inputs: unknown) => chatStreamSchema.safeParse(inputs),

}