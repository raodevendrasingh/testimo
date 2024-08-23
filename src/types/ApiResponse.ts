import { Feedback, User } from "@/models/User";


export interface ApiResponse {
    user?: Array<User>,
    success: boolean,
    message: string,
    isAcceptingFeedback?: boolean,
    feedback?: Array<Feedback>
}