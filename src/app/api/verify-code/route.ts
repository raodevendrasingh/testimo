import dbConnect from "@/lib/dbConnect";
import { UserModel } from "@/models/User";

export async function POST(request: Request) {
	await dbConnect();

	try {
		const { username, code } = await request.json();
		const decodedUsername = decodeURIComponent(username);

		const user = await UserModel.findOne({ username: decodedUsername });

		if (!user) {
			return Response.json(
				{
					sucess: false,
					message: "User not found",
				},
				{ status: 404 }
			);
		}

		const isCodeValid = user.verifyCode === code;
		const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

		if (isCodeValid && isCodeNotExpired) {
			user.isVerified = true;
			await user.save();

			return Response.json(
				{
					sucess: true,
					message: "User verified successfully",
				},
				{ status: 200 }
			);
		} else if (!isCodeValid) {
			return Response.json(
				{
					sucess: false,
					message: "Incorrect verification code",
				},
				{ status: 400 }
			);
		} else {
			return Response.json(
				{
					sucess: false,
					message:
						"Verification code is expired. Please signup again to receive a new code!",
				},
				{ status: 400 }
			);
		}
	} catch (error) {
		// console.error("Error verifying code!\n", error);
		return Response.json(
			{
				sucess: false,
				message: "Error verifying code",
			},
			{ status: 500 }
		);
	}
}
