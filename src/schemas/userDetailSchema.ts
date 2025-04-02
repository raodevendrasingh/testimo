import { z } from "zod";

export const usernameValidation = z
	.string()
	.min(2, { message: "Username must be at least 2 characters" })
	.max(16, { message: "Username must be less than 16 characters" })
	.regex(/^[a-zA-Z0-9]+$/, {
		message: "Username must contain only letters and numbers",
	})
	.transform((val) => val.toLowerCase());

export const userDetailSchema = z.object({
	username: usernameValidation,
	name: z
		.string()
		.min(3, { message: "Name must be at least 3 characters" })
		.max(32, { message: "Name must be less than 32 characters" }),
	imageUrl: z.string().optional(),
	tagline: z
		.string()
		.min(5, { message: "Tagline must be at least 5 characters" })
		.max(64, { message: "Tagline must be less than 64 characters" })
		.optional(),
});

export const userDetailModalSchema = z.object({
	name: z
		.string()
		.min(3, { message: "Name must be at least 3 characters" })
		.max(32, { message: "Name must be less than 32 characters" }),
	imageUrl: z.string().optional(),
	tagline: z
		.string()
		.min(5, { message: "Tagline must be at least 5 characters" })
		.max(64, { message: "Tagline must be less than 64 characters" })
		.optional(),
	companysite: z.string().optional(),
	socials: z.object({
		linkedin: z.string().optional(),
		twitter: z.string().optional(),
		instagram: z.string().optional(),
	}),
});
