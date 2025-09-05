"use server";

import VerifyEmailTemplate from "@/lib/VerifyEmailTemplate";
import type { ApiResponse } from "@/types/ApiResponse";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function sendVerificationEmail(
	email: string,
	verifyCode: string,
	signUpToken: string,
): Promise<ApiResponse> {
	try {
		const { error } = await resend.emails.send({
			from: "Testimo <hello@testimo.cc>",
			to: email,
			subject: "Testimo | Verify Your Email",
			react: VerifyEmailTemplate({ verifyCode, email, signUpToken }),
		});
		if (error) {
			console.error("Resend error:", error);
			throw new Error("Failed to send verification email");
		}
		return {
			success: true,
			message: "Verification email sent successfully",
		};
	} catch (error) {
		console.error("Failed to send verification email:", error);
		throw error;
	}
}
