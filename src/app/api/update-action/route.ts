import dbConnect from "@/lib/dbConnect";
import { UserModel } from "@/models/User";
import { type User, getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";

export async function POST(request: Request) {
	await dbConnect();

	const session = await getServerSession(authOptions);

	const user: User = session?.user as User;

	if (!session || !session.user) {
		return Response.json(
			{
				success: false,
				message: "User is not logged in",
			},
			{ status: 401 },
		);
	}

	const userId = user._id;

	const { feedbackId, action } = await request.json();

	try {
		const updatedUser = await UserModel.findOneAndUpdate(
			{ _id: userId, "testimonial._id": feedbackId },
			{ $set: { "testimonial.$.action": action } },
			{ new: true },
		);

		if (!updatedUser) {
			return Response.json(
				{
					success: false,
					message: "User or testimonial not found",
				},
				{ status: 404 },
			);
		}
		const updatedFeedback = updatedUser.testimonial.find(
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			(fb: any) => fb._id.toString() === feedbackId,
		);

		return Response.json(
			{
				success: true,
				message: `Testimonial ${action}!`,
				updatedFeedback,
			},
			{ status: 200 },
		);
	} catch (error) {
		// console.error("Failed to update testimonial action!\n", error);
		return Response.json(
			{
				success: false,
				message: "Failed to update testimonial action!",
			},
			{ status: 500 },
		);
	}
}
