import { z } from "zod";

export const feedbackSchema = z.object({
	content: z
		.string()
		.min(5, { message: "Content must be at least 5 characters long" })
		.max(300, { message: "Content must not exceed 300 characters" }),
	rating: z.number().min(1, { message: "Select at least one star" }),
	name: z
		.string()
		.min(4, { message: "Name must be at least 4 characters" })
		.max(30, { message: "Name must not exceed 30 characters" })
        .optional(),
	jobTitle: z
		.string()
		.min(3, { message: "Job Title must be at least 3 characters" })
		.max(50, { message: "Job Title must not exceed 50 characters" })
        .optional(),
	imageUrl: z.string().optional(),
	action: z.string().default("default"),
});
