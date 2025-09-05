import {
	Body,
	Container,
	Head,
	Heading,
	Html,
	Link,
	Preview,
	Section,
	Tailwind,
	Text,
} from "@react-email/components";
import * as React from "react";

const appDomain = process.env.APP_DOMAIN!;

interface VerifyEmailTemplateProps {
	email: string;
	verifyCode: string;
	signUpToken: string;
}

export default function VerifyEmailTemplate({
	email,
	verifyCode,
	signUpToken,
}: VerifyEmailTemplateProps) {
	return (
		<Html>
			<Head />
			<Preview> Your verify code is here</Preview>
			<Tailwind>
				<Body className="bg-gray-50 py-16">
					<Container className="bg-white border border-gray-200 rounded-lg mx-auto p-10 max-w-2xl">
						{/* Logo Section */}
						<Section className="mb-5">
							<Text className="text-4xl font-bold text-center text-black tracking-tight">
								Testimo
							</Text>
						</Section>

						<Text className="text-center text-gray-600 text-base leading-relaxed my-3">
							Use the below code to verify your email address.
						</Text>

						<Heading className="text-3xl text-mono font-bold text-gray-800 text-center my-6">
							{verifyCode}
						</Heading>

						<Text className="text-center text-gray-600 text-base leading-relaxed my-3">
							If you are not automatically redirected, use the below link for verification:
						</Text>

						<Section className="text-center my-3">
							<Link
								href={`${appDomain}/verify/${signUpToken}`}
								className="bg-black/90 hover:bg-gray-800 text-white px-4 py-3 rounded-lg font-semibold inline-block transition-colors duration-200"
							>
								Verify Email
							</Link>
						</Section>

						{/* Footer */}
						<Section className="mt-12 pt-8 bg-slate-50 border-t border-gray-200">
							<Text className="text-gray-500 text-sm text-center leading-relaxed">
								© {new Date().getFullYear()} Testimo. All rights reserved.
								<br />
								<br />
								This email was sent to {email}. If you didn't request this code, you can safely
								ignore this email.
								<br />
								This email was auto generated, please do not reply at this address.
							</Text>
						</Section>
					</Container>
				</Body>
			</Tailwind>
		</Html>
	);
}
