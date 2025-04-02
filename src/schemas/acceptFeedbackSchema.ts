import { z } from "zod";

export const acceptFeedbackSchema = z.object({
	acceptFeedback: z.boolean(),
});
