import "next-auth";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
	interface User {
		_id?: string;
		email?: string;
		username?: string;
		isVerified?: boolean;
		isAcceptingTestimonials?: boolean;
		oauthProvider?: string | null;
		subscriptionTier?: "starter" | "premium";
		monthlyTestimonialCount?: number;
		monthlyTestimonialResetDate?: Date;
	}
	interface Session {
		user: {
			_id?: string;
			isVerified?: boolean;
			isAcceptingTestimonials?: boolean;
			email?: string;
			username?: string;
			oauthProvider?: string | null;
			subscriptionTier?: "starter" | "premium";
			monthlyTestimonialCount?: number;
			monthlyTestimonialResetDate?: Date;
		} & DefaultSession["user"];
	}
}

declare module "next-auth/jwt" {
	interface JWT {
		_id?: string;
		isVerified?: boolean;
		isAcceptingTestimonials?: boolean;
		email?: string;
		username?: string;
		oauthProvider?: string | null;
		subscriptionTier?: "starter" | "premium";
		monthlyTestimonialCount?: number;
		monthlyTestimonialResetDate?: Date;
	}
}
