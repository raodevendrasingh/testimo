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

	const { acceptFeedback } = await request.json();

	try {
		const updatedUser = await UserModel.findByIdAndUpdate(
			userId,
			{ isAcceptingTestimonials: acceptFeedback },
			{ new: true },
		);
		if (!updatedUser) {
			return Response.json(
				{
					success: false,
					message: "Failed to update status to accept testimonial!",
				},
				{ status: 401 },
			);
		}

		return Response.json(
			{
				success: true,
				message: "Updated user status to accept testimonial!",
				updatedUser,
			},
			{ status: 200 },
		);
	} catch (error) {
		// console.error("Failed to update status to accept testimonial!\n", error);
		return Response.json(
			{
				success: false,
				message: "Failed to update status to accept testimonial!",
			},
			{ status: 500 },
		);
	}
}

export async function GET(request: Request) {
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

	try {
		const fetchedUser = await UserModel.findById(userId);

		if (!fetchedUser) {
			return Response.json(
				{
					success: false,
					message: "User not found!",
				},
				{ status: 404 },
			);
		}

		return Response.json(
			{
				success: true,
				isAcceptingTestimonials: fetchedUser.isAcceptingTestimonials,
			},
			{ status: 200 },
		);
	} catch (error) {
		console.error("Failed to fetch status to accept testimonial!\n", error);
		return Response.json(
			{
				success: false,
				message: "Failed to fetch testimonial acceptance status.",
			},
			{ status: 500 },
		);
	}
}
