import { z } from "zod";

export const signUpSchema = z.object({
	email: z
		.string()
		.email({ message: "Email is invalid" })
		.min(5, { message: "Email must be at least 5 characters" })
		.max(60, { message: "Email must be less than 60 characters" }),
	password: z
		.string()
		.min(8, { message: "Password must be at least 8 characters" })
		.max(32, { message: "Password must be less than 32 characters" }),
});
