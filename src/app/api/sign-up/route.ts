import { sendVerificationEmail } from "@/actions/sendVerifyEmail";
import {
	INITIAL_TESTIMONIAL_COUNT,
	INITIAL_TIER,
	getExpiryDate,
	getResetDate,
} from "@/lib/constants";
import dbConnect from "@/lib/dbConnect";
import { UserModel } from "@/models/User";
import bcrypt from "bcryptjs";
import { nanoid } from "nanoid";
export async function POST(request: Request) {
	await dbConnect();

	try {
		const { email, password } = await request.json();

		const existingUserbyEmail = await UserModel.findOne({ email });

		const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
		const signUpToken = nanoid(32);

		if (existingUserbyEmail) {
			if (existingUserbyEmail.isVerified) {
				return Response.json(
					{
						success: false,
						message: "Email Already exists!",
					},
					{ status: 400 },
				);
			}
			const hashedPassword = await bcrypt.hash(password, 10);

			Object.assign(existingUserbyEmail, {
				password: hashedPassword,
				signUpToken,
				verifyCode,
				verifyCodeExpiry: getExpiryDate(),
				subscriptionTier: INITIAL_TIER,
				monthlyTestimonialCount: INITIAL_TESTIMONIAL_COUNT,
				subscriptionStartDate: new Date(),
				monthlyTestimonialResetDate: getResetDate(),
			});

			await existingUserbyEmail.save();
		} else {
			const hashedPassword = await bcrypt.hash(password, 10);

			const newUser = new UserModel({
				username: email.split("@")[0],
				email,
				password: hashedPassword,
				signUpToken,
				verifyCode,
				verifyCodeExpiry: getExpiryDate(),
				isVerified: false,
				isAcceptingTestimonials: true,
				testimonial: [],
				subscriptionTier: INITIAL_TIER,
				monthlyTestimonialCount: INITIAL_TESTIMONIAL_COUNT,
				subscriptionStartDate: new Date(),
				monthlyTestimonialResetDate: getResetDate(),
			});

			await newUser.save();
		}

		//* send verification email
		const emailResponse = await sendVerificationEmail(email, verifyCode, signUpToken);

		if (!emailResponse.success) {
			return Response.json(
				{
					success: false,
					message: emailResponse.message,
				},
				{ status: 500 },
			);
		}

		return Response.json(
			{
				success: true,
				token: signUpToken,
				message: "User registered successfully! Email verification pending.",
			},
			{ status: 201 },
		);
	} catch (error) {
		console.error("Error signing up: ", error);
		return Response.json(
			{
				success: false,
				message: "Error signing up!",
			},
			{ status: 500 },
		);
	}
}
