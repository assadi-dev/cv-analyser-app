import { z } from "zod";

export const analyseStreamSchema = z.object({
    job_description: z.string().min(1, "Job description is required"),
    cv_file: z.custom<File>(),
    // Present when the analysis is launched from a candidature: the API then
    // records it on that candidature. Absent for a standalone analysis.
    candidature_id: z.string().uuid().optional(),
})

export type AnalyseStreamSchemaInfer = z.infer<typeof analyseStreamSchema>


export const analyseStreamDecoder = {
    temporary_analyse_input: (inputs: FormData) => analyseStreamSchema.safeParse({
        job_description: inputs.get("job_description"),
        cv_file: inputs.get("cv_file"),
        candidature_id: inputs.get("candidature_id") ?? undefined,
    }),

}