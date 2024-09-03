import { resend } from '@/lib/resend'
import VerificationEmail from '../../emails/verificationEmail'

import { ApiResponse } from '@/types/ApiResponse'

export async function sendVerifyEmail(
    email: string,
    signUpToken: string,
    verifyCode: string
): Promise<ApiResponse> {
    try {
        await resend.emails.send({
            from: 'oboarding@resend.dev',
            to: email,
            subject: 'Remonial | Verify your email',
            react: VerificationEmail({ email: email, otp: verifyCode, token: signUpToken })
        });

        return {
            success: true,
            message: 'Verification email sent successfully'
        }
    } catch (emailError) {
        console.error("Error sending verification email: ", emailError);

        return {
            success: false,
            message: 'Failed to send verification email'
        }
    }
}