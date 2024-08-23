import dbConnect from "@/lib/dbConnect";
import { UserModel } from "@/models/User";
import mongoose from "mongoose";
import { getServerSession, User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";

export async function GET(request: Request) {
	await dbConnect();

	const session = await getServerSession(authOptions);

	const _user: User = session?.user as User;

	if (!session || !_user) {
		return new Response(
			JSON.stringify({
				success: false,
				message: "User is not logged in",
			}),
			{ status: 401 }
		);
	}

	const userId = new mongoose.Types.ObjectId(_user._id);

	try {
		const userData = await UserModel.aggregate([
			{ $match: { _id: userId } },
			{
				$project: {
					username: 1,
					name: 1,
                    imageUrl: 1,
					email: 1,
					companysite: 1,
					tagline: 1,
					socials: 1,
				},
			},
		]);

		if (!userData) {
			return new Response(
				JSON.stringify({
					success: false,
					message: "User does not exists!",
				}),
				{ status: 404 }
			);
		}

		return new Response(
			JSON.stringify({
				success: true,
                message: "User data fetched successfully!",
				user: userData,
			}),
			{ status: 200 }
		);
	} catch (error) {
		// console.error("An Unexpected error occurred\n", error);
		return new Response(
			JSON.stringify({
				success: false,
				message: "Error Fetching User Data!",
			}),
			{ status: 500 }
		);
	}
}
