import dbConnect from "@/lib/dbConnect";
import { UserModel } from "@/models/User";
import { Testimonial } from "@/models/Testimonial";

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

		if (!user.isAcceptingTestimonials) {
			return Response.json(
				{
					sucess: false,
					message: "User is not accepting testimonials currently!",
				},
				{ status: 403 }
			);
		}

		const newTestimonial = {
			action: "default",
			content,
			rating,
			name,
			jobTitle,
			imageUrl,
			createdAt: new Date(),
		};
		user.testimonial.push(newTestimonial as Testimonial);
		await user.save();

		return Response.json(
			{
				sucess: true,
				message: "Testimonial is sent successfully!",
				testimonial: newTestimonial,
			},
			{ status: 200 }
		);
	} catch (error) {
		// console.error("Error sending testimonial\n", error);
		return Response.json(
			{
				sucess: false,
				message: "Error sending testimonial. Try Again!",
			},
			{ status: 500 }
		);
	}
}
