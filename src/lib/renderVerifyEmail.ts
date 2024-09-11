const appDomain = process.env.APP_DOMAIN;

export function renderVerificationEmail(
	email: string,
	otp: string,
	token: string
): string {
	return `
		<!DOCTYPE html>
		<html lang="en">
			<body>
				<h2 style="font-size: 24px;">Hello ${email.split("@")[0]},</h2>
				<p style="font-size: 16px;">Thank you for registering on Remonial. Please use the following verification code to complete your registration:</p>
				<h1 style="font-size: 32px;"><code>${otp}</code></h1>
				<p style="font-size: 16px;">If you are not automatically redirected, use the below link for verification:</p>
				<p style="font-size: 16px;"><a href="${appDomain}/verify/${token}">Verify here</a></p>
				<p style="font-size: 16px;">If you did not request this code, please ignore this email.</p>
                <br>
                <p style="font-size: 16px;"><i>This Email was auto generated, please do not reply at this address.</i></p>
			</body>
		</html>
	`;
}
