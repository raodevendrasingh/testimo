import { getServerSession, User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import { UserModel } from "@/models/User";
import mongoose from "mongoose";

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

	const userId = new mongoose.Types.ObjectId(user._id);

	try {
		const user = await UserModel.aggregate([
			{ $match: { id: userId } },
			{ $unwind: "$feedback" },
			{ $sort: { "feedback.createdAt": -1 } },
			{ $group: { _id: "$_id", feedback: { $push: "feedback" } } },
		]);
		if (!user || user.length === 0) {
			return Response.json(
				{
					sucess: false,
					message: "User not found",
				},
				{ status: 404 }
			);
		}

        return Response.json(
            {
                sucess: true,
                feedback: user[0].feedback
            },
            { status: 200 }
        );
	} catch (error) {}
}
