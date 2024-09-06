import { Testimonial } from "@/models/Testimonial";
import { User } from "@/models/User";

export interface ApiResponse {
    user?: Array<User>,
    success: boolean,
    message: string,
    token?: string,
    isAcceptingTestimonials?: boolean,
    testimonial?: Array<Testimonial>
}