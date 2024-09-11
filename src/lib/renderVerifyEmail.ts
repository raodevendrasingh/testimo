const appDomain = process.env.APP_DOMAIN

export function renderVerificationEmail(
	email: string,
	otp: string,
	token: string
): string {
	return `
		<!DOCTYPE html>
		<html lang="en">
			<body>
				<h3>Hello ${email.split("@")[0]},</h3>
                <br><br>
				<p>Thank you for registering on Remonial. Please use the following verification code to complete your registration:</p>
				<h4><code>${otp}</code></h4>
                <br>
				<p>If you are not automatically redirected, use the below link for verification:</p>
				<p><a href="${appDomain}/verify/${token}">Verify here</a></p>
                <br><br>
				<p>If you did not request this code, please ignore this email.</p>
                <br><br>
                <h4>Remonial</h4>
                <p>This Email was auto generated, please do not reply at this address.</p>
			</body>
		</html>
	`;
}