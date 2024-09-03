import dbConnect from "@/lib/dbConnect";
import { UserModel } from "@/models/User";

export async function POST(request: Request) {
	await dbConnect();

	try {
		const { token, code } = await request.json();

        if (!token) {
            return Response.json(
                {
                    success: false,
                    message: "Token is missing",
                },
                { status: 400 }
            );
        }

		const user = await UserModel.findOne({ signUpToken: token });

		if (!user) {
			return Response.json(
				{
					sucess: false,
					message: "Invalid token",
				},
				{ status: 400 }
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
