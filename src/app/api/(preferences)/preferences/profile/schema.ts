import z from "zod";

export const profileBodySchema = z.object({
    first_name: z.string().trim().min(1, "Le prénom est requis").max(100),
    last_name: z.string().trim().min(1, "Le nom est requis").max(100),
    professional_title: z.string().trim().max(200).optional(),
})

export type ProfileBody = z.infer<typeof profileBodySchema>

export const profileValidator = {
    body: (inputs: unknown) => profileBodySchema.safeParse(inputs),
}
