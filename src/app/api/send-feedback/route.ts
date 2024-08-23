import dbConnect from "@/lib/dbConnect";
import { UserModel, Feedback } from "@/models/User";

export async function POST(request: Request) {
	await dbConnect();

	const { username, action, content, rating, name, jobTitle, imageUrl } =
		await request.json();

	try {
		const user = await UserModel.findOne({ username });
		if (!user) {
			return Response.json(
				{
					sucess: false,
					message: "User not found!",
				},
				{ status: 404 }
			);
		}

		if (!user.isAcceptingFeedback) {
			return Response.json(
				{
					sucess: false,
					message: "User is not accepting feedback currently!",
				},
				{ status: 403 }
			);
		}

		const newFeedback = {
			action: "default",
			content,
			rating,
			name,
			jobTitle,
			imageUrl,
			createdAt: new Date(),
		};
		user.feedback.push(newFeedback as Feedback);
		await user.save();

		return Response.json(
			{
				sucess: true,
				message: "Feedback is sent successfully!",
				feedback: newFeedback,
			},
			{ status: 200 }
		);
	} catch (error) {
		// console.error("Error sending feedback\n", error);
		return Response.json(
			{
				sucess: false,
				message: "Error sending feedback. Try Again!",
			},
			{ status: 500 }
		);
	}
}
