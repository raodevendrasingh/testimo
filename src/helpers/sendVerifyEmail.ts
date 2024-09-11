import nodemailer from "nodemailer"; // Import nodemailer
import { ApiResponse } from "@/types/ApiResponse";
import { renderVerificationEmail } from "@/lib/renderVerifyEmail";

const userEmail = process.env.EMAIL_USER
const password = process.env.EMAIL_PASS

const transporter = nodemailer.createTransport({
	service: "gmail",
	auth: {
		user: userEmail,
		pass: password
	},
});


export async function sendVerifyEmail(
	email: string,
	signUpToken: string,
	verifyCode: string
): Promise<ApiResponse> {
	try {
        const emailContent = renderVerificationEmail(email, verifyCode, signUpToken);

		await transporter.sendMail({
			from: userEmail,
			to: email,
			subject: "Remonial | Verify your email",
			html: emailContent
		});

		return {
			success: true,
			message: "Verification email sent successfully",
		};
	} catch (emailError) {
		console.error("Error sending verification email: ", emailError);

		return {
			success: false,
			message: "Failed to send verification email",
		};
	}
}
