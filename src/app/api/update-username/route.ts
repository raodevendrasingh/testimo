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

	const { username } = await request.json();

	try {
		const updatedUser = await UserModel.findByIdAndUpdate(
			userId,
			{ username: username },
			{ new: true },
		);

		if (!updatedUser) {
			return Response.json(
				{
					success: false,
					message: "Failed to update username!",
				},
				{ status: 401 },
			);
		}

		return Response.json(
			{
				success: true,
				message: "Username updated successfully!",
			},
			{ status: 200 },
		);
	} catch (error) {
		console.error("Error updating username: \n", error);
		return Response.json(
			{
				success: false,
				message: "Error updating username. Try Again!",
			},
			{ status: 500 },
		);
	}
}
