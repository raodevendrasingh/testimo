import { getServerSession, User } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import { UserModel } from "@/models/User";

export async function DELETE(request: Request, props: { params: Promise<{ testimonialId: string }> }) {
    const params = await props.params;
    const testimonialId = params.testimonialId;

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

    try {
		const updateResult = await UserModel.updateOne(
			{ _id: _user._id },
			{ $pull: { testimonial: { _id: testimonialId } } }
		);
		if (updateResult.modifiedCount === 0) {
			return new Response(
				JSON.stringify({
					success: false,
					message: "Testimonial doesn't exist!",
				}),
				{ status: 404 }
			);
		}
		return new Response(
			JSON.stringify({
				success: true,
				message: "Testimonial deleted!",
			}),
			{ status: 200 }
		);
	} catch (error) {
		// console.error('An Error occured while deleting testimonial', error);
		return new Response(
			JSON.stringify({
				success: false,
				message: "An Error occured while deleting testimonial",
			}),
			{ status: 500 }
		);
	}
}
