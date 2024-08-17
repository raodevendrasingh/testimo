import { z } from "Zod";

export const feedbackSchema = z.object({
	content: z
		.string()
		.min(10, { message: "Content must be at least 10 characters long" })
		.max(300, { message: "Content must not exceed 300 characters" }),
	rating: z.number().min(1).max(5),
	name: z
		.string()
		.min(10, { message: "Name must be at least 2 characters" })
		.max(30, { message: "Name must not exceed 30 characters" }),
	jobTitle: z
		.string()
		.min(10, { message: "Job Title must be at least 3 characters" })
		.max(50, { message: "Job Title must not exceed 50 characters" }),
	imageUrl: z.string(),
});
