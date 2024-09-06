import mongoose, { Schema, Document } from "mongoose";
import { Socials, SocialSchema, urlMatcher } from "./Social";
import { Testimonial, TestimonialSchema } from "./Testimonial";

export interface User extends Document {
	username?: string;
	name?: string;
	imageUrl?: String;
	tagline?: String;
	email: string;
	password: string;
	oauthProvider: string | null;
	signUpToken: string;
	verifyCode: string;
	verifyCodeExpiry: Date;
	isVerified: boolean;
	isOnboarded: boolean;
	isAcceptingTestimonials: boolean;
	companysite?: string;
	socials: Socials[];
	testimonial: Testimonial[];
	monthlyTestimonialCount: number;
	monthlyTestimonialResetDate: Date;
	subscriptionTier: "starter" | "premium";
	subscriptionStartDate: Date;
	subscriptionEndDate: Date;
	paymentMethod: {
		type: string;
		lastFour: string;
		expiryDate: string;
	};
	billingAddress: {
		street: string;
		city: string;
		state: string;
		country: string;
		zipCode: string;
	};
}

const UserSchema: Schema<User> = new Schema({
	username: {
		type: String,
		trim: true,
		unique: true,
	},
	name: {
		type: String,
	},
	imageUrl: {
		type: String,
	},
	tagline: {
		type: String,
	},
	email: {
		type: String,
		required: [true, "Email is required"],
		unique: true,
		match: [
			/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
			"Enter a valid email",
		],
	},
	password: {
		type: String,
		required: [true, "Password is required"],
	},
	oauthProvider: { type: String, default: null },
	signUpToken: {
		type: String,
	},
	isOnboarded: {
		type: Boolean,
		default: false,
	},
	verifyCode: {
		type: String,
		required: [true, "Verify code is required"],
	},
	verifyCodeExpiry: {
		type: Date,
		required: [true, "Verify code expiry is required"],
	},
	isVerified: {
		type: Boolean,
		default: false,
	},
	isAcceptingTestimonials: {
		type: Boolean,
		default: true,
	},
	companysite: {
		type: String,
		match: urlMatcher,
	},
	socials: SocialSchema,
	testimonial: [TestimonialSchema],
	monthlyTestimonialCount: {
		type: Number,
		default: 0,
	},
	monthlyTestimonialResetDate: {
		type: Date,
	},
	subscriptionTier: {
		type: String,
		enum: ["starter", "premium"],
		default: "starter",
	},
	subscriptionStartDate: {
		type: Date,
	},
	subscriptionEndDate: {
		type: Date,
	},
	paymentMethod: {
		type: {
			type: String,
		},
		lastFour: {
			type: String,
		},
		expiryDate: {
			type: String,
		},
	},
	billingAddress: {
		street: String,
		city: String,
		state: String,
		country: String,
		zipCode: String,
	},
});

export const UserModel =
	(mongoose.models.User as mongoose.Model<User>) ||
	mongoose.model<User>("User", UserSchema);
