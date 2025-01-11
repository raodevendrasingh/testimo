"use server";

import { ApiResponse } from "@/types/ApiResponse";
import { Resend } from "resend";
import VerifyEmailTemplate from "@/lib/VerifyEmailTemplate";

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function sendVerificationEmail(
	email: string,
	verifyCode: string,
	signUpToken: string
): Promise<ApiResponse> {
	try {
		const { error } = await resend.emails.send({
			from: "Remonial <hello@remonial.live>",
			to: email,
			subject: "Remonial | Verify Your Email",
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
