import { z } from "Zod";

export const acceptFeedbackSchema = z.object({
    acceptFeedback: z.boolean()
})