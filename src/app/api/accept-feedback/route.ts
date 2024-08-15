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

	const { acceptFeedback } = await request.json();

	try {
		const updatedUser = await UserModel.findByIdAndUpdate(
			userId,
			{ isAcceptingFeedback: acceptFeedback },
			{ new: true }
		);
		if (!updatedUser) {
			return Response.json(
				{
					sucess: false,
					message: "Failed to update status to accept feedback!",
				},
				{ status: 401 }
			);
		}

		return Response.json(
			{
				sucess: true,
				message: "Updated user status to accept feedback!",
				updatedUser,
			},
			{ status: 200 }
		);
	} catch (error) {
		console.error("Failed to update status to accept feedback!\n", error);
		return Response.json(
			{
				sucess: false,
				message: "Failed to update status to accept feedback!",
			},
			{ status: 500 }
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
				sucess: false,
				message: "User is not logged in",
			},
			{ status: 401 }
		);
	}

	const userId = user._id;

	try {
		const fetchedUser = await UserModel.findById(userId);

		if (!fetchedUser) {
			return Response.json(
				{
					sucess: false,
					message: "User not found!",
				},
				{ status: 404 }
			);
		}

		return Response.json(
			{
				sucess: true,
				isAcceptingFeedback: fetchedUser.isAcceptingFeedback,
			},
			{ status: 200 }
		);
	} catch (error) {
		console.error("Failed to fetch status to accept feedback!\n", error);
		return Response.json(
			{
				sucess: false,
				message: "Failed to fetch feedback acceptance status.",
			},
			{ status: 500 }
		);
	}
}
