import dbConnect from "@/lib/dbConnect";
import { UserModel } from "@/models/User";

interface UpdateUserData {
  username: string;
  name?: string;
  imageUrl?: string;
  tagline?: string;
  companysite?: string;
  socials?: {
    linkedin?: string;
    twitter?: string;
    instagram?: string;
  };
}

export async function POST(request: Request) {
	await dbConnect();

	const {
		username,
		name,
		imageUrl,
		tagline,
		companysite,
		socials
	}: UpdateUserData = await request.json();

	try {
		// Fetch the current user data
		const currentUser = await UserModel.findOne({ username }) as Document | null;

		if (!currentUser) {
			return new Response(
				JSON.stringify({
					success: false,
					message: "User not found!",
				}),
				{ status: 404 }
			);
		}

		// Prepare an object to store fields to update
		const updatedFields: Partial<UpdateUserData> = {};

		const updateIfChanged = (field: keyof UpdateUserData, value: any) => {
			if (value !== undefined && value !== (currentUser as any)[field]) {
				updatedFields[field] = value;
			}
		};

		updateIfChanged("name", name);
		updateIfChanged("imageUrl", imageUrl);
		updateIfChanged("tagline", tagline);
		updateIfChanged("companysite", companysite);

		if (socials) {
			const updatedSocials: Partial<UpdateUserData['socials']> = {};
			let socialsChanged = false;

			if (
				socials.linkedin !== undefined &&
				socials.linkedin !== (currentUser as any).socials?.linkedin
			) {
				updatedSocials.linkedin = socials.linkedin;
				socialsChanged = true;
			}
			if (
				socials.twitter !== undefined &&
				socials.twitter !== (currentUser as any).socials?.twitter
			) {
				updatedSocials.twitter = socials.twitter;
				socialsChanged = true;
			}
			if (
				socials.instagram !== undefined &&
				socials.instagram !== (currentUser as any).socials?.instagram
			) {
				updatedSocials.instagram = socials.instagram;
				socialsChanged = true;
			}

			if (socialsChanged) {
				updatedFields.socials = updatedSocials;
			}
		}

		if (Object.keys(updatedFields).length > 0) {
			await UserModel.updateOne({ username }, { $set: updatedFields });
			return new Response(
				JSON.stringify({
					success: true,
					message: "User details updated successfully!",
				}),
				{ status: 200 }
			);
		} else {
			return new Response(
				JSON.stringify({
					success: true,
					message: "No changes detected.",
				}),
				{ status: 200 }
			);
		}
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
