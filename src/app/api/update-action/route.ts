import { getServerSession, User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import { UserModel } from "@/models/User";

export async function POST(request: Request) {
	await dbConnect();

	const session = await getServerSession(authOptions);

	const user: User = session?.user as User;

	if (!session || !session.user) {
		return Response.json(
			{
				sucess: false,
				message: "User is not logged in",
			},
			{ status: 401 }
		);
	}

	const userId = user._id;

	const { feedbackId, action } = await request.json();

	try {
		const updatedUser = await UserModel.findOneAndUpdate(
			{ _id: userId, "feedback._id": feedbackId },
			{ $set: { "feedback.$.action": action } },
			{ new: true }
		);

		if (!updatedUser) {
			return Response.json(
				{
					success: false,
					message: "User or feedback not found",
				},
				{ status: 404 }
			);
		}

		const updatedFeedback = updatedUser.feedback.find(
			(fb) => fb._id.toString() === feedbackId
		);

		return Response.json(
			{
				success: true,
				message: `Feedback ${action}!`,
				updatedFeedback,
			},
			{ status: 200 }
		);
	} catch (error) {
		// console.error("Failed to update feedback action!\n", error);
		return Response.json(
			{
				sucess: false,
				message: "Failed to update feedback action!",
			},
			{ status: 500 }
		);
	}
}
