import { z } from "Zod";


export const verifySchema = z.object({
    code: z.string()
})