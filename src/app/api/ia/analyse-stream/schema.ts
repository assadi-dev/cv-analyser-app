import { z } from "zod";

export const analyseStreamSchema = z.object({
    job_description: z.string().min(1, "Job description is required"),
    // The CV is either uploaded with the request or one the user already
    // stored (`cv_id`): at least one of the two, checked below.
    cv_file: z.custom<File>().optional(),
    cv_id: z.string().uuid().optional(),
    // Present when the analysis is launched from a candidature: the API then
    // records it on that candidature. Absent for a standalone analysis.
    candidature_id: z.string().uuid().optional(),
}).refine((input) => input.cv_file || input.cv_id, {
    message: "Send a CV file or the id of a stored CV",
    path: ["cv_file"],
})

export type AnalyseStreamSchemaInfer = z.infer<typeof analyseStreamSchema>


export const analyseStreamDecoder = {
    temporary_analyse_input: (inputs: FormData) => analyseStreamSchema.safeParse({
        job_description: inputs.get("job_description"),
        cv_file: inputs.get("cv_file") ?? undefined,
        cv_id: inputs.get("cv_id") ?? undefined,
        candidature_id: inputs.get("candidature_id") ?? undefined,
    }),

}