import type { Testimonial } from "@/models/Testimonial";
import type { User } from "@/models/User";

export interface ApiResponse {
	user?: User[];
	success: boolean;
	message: string;
	token?: string;
	isAcceptingTestimonials?: boolean;
	testimonial?: Testimonial[];
}
