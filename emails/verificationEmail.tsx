import {
	Html,
	Head,
	Font,
	Preview,
	Heading,
	Row,
	Section,
	Text,
} from "@react-email/components";

interface VerificationEmailProps {
    email: string;
	token: string;
	otp: string;
}

export default function VerificationEmail({
    email,
	otp,
	token,
}: VerificationEmailProps) {
	return (
		<Html lang="en" dir="ltr">
			<Head>
				<title>Verification Code</title>
				<Font
					fontFamily="Roboto"
					fallbackFontFamily="Verdana"
					webFont={{
						url: "https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2",
						format: "woff2",
					}}
					fontWeight={400}
					fontStyle="normal"
				/>
			</Head>
			<Preview>Here&apos;s your verification code: {otp}</Preview>
			<Section>
				<Row>
					<Heading as="h2">Hello {email.split("@")[0]}, </Heading>
				</Row>
				<Row>
					<Text>
						Thank you for registering. Please use the following verification
						code to complete your registration:
					</Text>
				</Row>
				<Row>
					<Text>{otp}</Text>
				</Row>
                <Row>
					<Text>
						If your are not automaticaly redirected, use the below link for verification:
                        <a href={`http://localhost:3000/verify/${token}`}>Verify here</a>
					</Text>
				</Row>
				<Row>
					<Text>
						If you did not request this code, please ignore this email.
					</Text>
				</Row>
			</Section>
		</Html>
	);
}
