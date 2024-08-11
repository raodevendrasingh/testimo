import { Feedback } from "@/models/User";

export interface ApiResponse {
    success: boolean,
    message: string,
    isAcceptingFeedback?: boolean,
    feedback?: Array<Feedback>
}