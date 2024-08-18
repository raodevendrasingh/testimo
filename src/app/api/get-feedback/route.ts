import { getServerSession, User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import { UserModel } from "@/models/User";
import mongoose from "mongoose";

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
		const user = await UserModel.aggregate([
			// Match the user by their ID
			{ $match: { _id: userId } },
			{
				$lookup: {
					from: "feedback",
					localField: "_id",
					foreignField: "userId",
					as: "feedback",
				},
			},
			{ $unwind: { path: "$feedback", preserveNullAndEmptyArrays: true } },
			{ $sort: { "feedback.createdAt": -1 } },
			{ $group: { _id: "$_id", feedback: { $push: "$feedback" } } },
		]).exec();

		if (!user || user.length === 0) {
			return new Response(
				JSON.stringify({
					success: false,
					message: "User not found",
				}),
				{ status: 404 }
			);
		}

		if (user[0].feedback.length === 0) {
			return new Response(
				JSON.stringify({
					success: false,
					message: "No feedback data available",
				}),
				{ status: 404 }
			);
		}

		return new Response(
			JSON.stringify({
				success: true,
				feedback: user[0].feedback,
			}),
			{ status: 200 }
		);
	} catch (error) {
		console.error("An Unexpected error occurred\n", error);
		return new Response(
			JSON.stringify({
				success: false,
				message: "Error fetching feedback!",
			}),
			{ status: 500 }
		);
	}
}
