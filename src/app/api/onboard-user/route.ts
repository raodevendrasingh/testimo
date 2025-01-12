import dbConnect from "@/lib/dbConnect";
import { UserModel } from "@/models/User";
import { getServerSession, User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { Testimonial } from "@/models/Testimonial";

interface UpdateUserData {
	username: string;
	isOnboarded?: boolean;
	name?: string;
	imageUrl?: string;
	tagline?: string;
}

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
			{ status: 401 }
		);
	}

	const userId = user._id;

	const { username, name, imageUrl, tagline }: UpdateUserData =
		await request.json();

	try {
		const updatedFields: Partial<UpdateUserData> = {
			...(username?.trim() && { username, isOnboarded: true }),
			...(name?.trim() && { name }),
			...(imageUrl?.trim() && { imageUrl }),
			...(tagline?.trim() && { tagline }),
		};

		const updatedUser = await UserModel.findOneAndUpdate(
			{ _id: userId },
			{ $set: updatedFields },
			{ new: true }
		);

		if (!updatedUser) {
			return Response.json(
				{
					success: false,
					message: "Error updating user details!",
				},
				{ status: 404 }
			);
		}
		const exampleTestimonial1 = {
			action: "default",
			content:
				"Slack is awesome for team communication! Keeps everyone connected and organized. Love it",
			rating: "5",
			name: "Jason Viess",
			jobTitle: "Managing Director",
			imageUrl:
				"https://media.istockphoto.com/id/1335941248/photo/shot-of-a-handsome-young-man-standing-against-a-grey-background.jpg?s=612x612&w=0&k=20&c=JSBpwVFm8vz23PZ44Rjn728NwmMtBa_DYL7qxrEWr38=",
			createdAt: new Date(),
		};

		const exampleTestimonial2 = {
			action: "default",
			content:
				"Notion is a lifesaver! I use it for everything from project management to note-taking. Highly recommend.",
			rating: "5",
			name: "Michael B.",
			jobTitle: "",
			imageUrl: "",
			createdAt: new Date(),
		};

		updatedUser.testimonial.push(
			exampleTestimonial1 as unknown as Testimonial
		);
		updatedUser.testimonial.push(
			exampleTestimonial2 as unknown as Testimonial
		);

		await updatedUser.save();

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
				success: false,
				message: "Error updating user details!",
			},
			{ status: 500 }
		);
	}
}
