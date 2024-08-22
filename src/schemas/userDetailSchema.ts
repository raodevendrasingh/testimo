import { z } from "zod";

const socialSchema = z.object({
	linkedin: z.string().url().optional(),
	twitter: z.string().url().optional(),
	instagram: z.string().url().optional(),
});

export const userDetailSchema = z.object({
	name: z
		.string()
		.min(3, { message: "Name must be at least 3 characters" })
		.max(30, { message: "Name must be less than 60 characters" }),
	imageUrl: z.string().optional(),
	tagline: z
		.string()
		.min(5, { message: "Tagline must be at least 5 characters" })
		.max(100, { message: "Tagline must be less than 60 characters" })
		.optional(),
    companysite: z.string().url().optional(),
	socials: socialSchema.optional(),
});
