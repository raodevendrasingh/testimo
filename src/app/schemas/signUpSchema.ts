import { z } from "Zod";

export const usernameValidation = z
	.string()
	.min(2, { message: "Username must be at least 2 characters" })
	.max(20, { message: "Username must be less than 20 characters" })
	.regex(/^[a-zA-Z0-9]+$/, {
		message: "Username must contain only letters and numbers",
	});

export const signUpSchema = z.object({
	username: usernameValidation,
	email: z
		.string()
		.email({ message: "Email is invalid" })
		.min(3, { message: "Email must be at least 3 characters" })
		.max(60, { message: "Email must be less than 60 characters" }),
	password: z
		.string()
		.min(6, { message: "Password must be at least 6 characters" })
		.max(60, { message: "Password must be less than 60 characters" }),
	confirmPassword: z
		.string()
		.min(6, { message: "Password must be at least 6 characters" })
		.max(60, { message: "Password must be less than 60 characters" }),
});
