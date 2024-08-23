import dbConnect from "@/lib/dbConnect";
import { UserModel } from "@/models/User";

export async function POST(request: Request) {
	await dbConnect();

	const {
		username,
		name,
		imageUrl,
		tagline,
		companysite,
		socials: { linkedin, twitter, instagram },
	} = await request.json();

	try {
		const user = await UserModel.findOneAndUpdate(
			{ username },
			{
				$set: {
					name,
					imageUrl,
					tagline,
					companysite,
					socials: { linkedin, twitter, instagram },
				},
			},
			{ new: true, runValidators: true }
		);

		if (!user) {
			return new Response(
				JSON.stringify({
					success: false,
					message: "User not found!",
				}),
				{ status: 404 }
			);
		}

		return new Response(
			JSON.stringify({
				success: true,
				message: "User details updated successfully!",
			}),
			{ status: 200 }
		);
	} catch (error) {
		console.error("Error updating user details\n", error);
		return Response.json(
			{
				sucess: false,
				message: "Error updating user details!",
			},
			{ status: 500 }
		);
	}
}
