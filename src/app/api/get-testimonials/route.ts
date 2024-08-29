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
		const userTestimonials = await UserModel.aggregate([
			{ $match: { _id: userId } },
			{ $unwind: "$testimonial" },
			{ $sort: { "testimonial.createdAt": -1 } },
			{ $group: { _id: "$_id", testimonial: { $push: "$testimonial" } } },
			{ $project: { testimonial: 1 } },
		]);

		if (!userTestimonials || userTestimonials.length === 0) {
			return new Response(
				JSON.stringify({
					success: false,
					message: "No testimonial data available",
				}),
				{ status: 404 }
			);
		}

		return new Response(
			JSON.stringify({
				success: true,
				testimonial: userTestimonials[0].testimonial,
			}),
			{ status: 200 }
		);
	} catch (error) {
		// console.error("An Unexpected error occurred\n", error);
		return new Response(
			JSON.stringify({
				success: false,
				message: "Error fetching testimonial!",
			}),
			{ status: 500 }
		);
	}
}
