import mongoose, { Schema, Document } from "mongoose";

const urlMatcher = [
	/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
	"Enter a valid URL",
];
export interface Testimonial extends Document {
	action: string;
	content: string;
	rating: number;
	name?: string;
	jobTitle?: string;
	imageUrl?: string;
	createdAt: Date;
}

const TestimonialSchema: Schema<Testimonial> = new Schema({
	action: {
		type: String,
		default: "default",
		required: true,
	},
	content: {
		type: String,
		required: true,
	},
	rating: {
		type: Number,
		required: true,
	},
	name: {
		type: String,
	},
	jobTitle: {
		type: String,
	},
	imageUrl: {
		type: String,
	},
	createdAt: {
		type: Date,
		required: true,
		default: Date.now,
	},
});

export interface Socials extends Document {
	linkedin?: string;
	twitter?: string;
	instagram?: string;
}

const SocialSchema: Schema<Socials> = new Schema({
	linkedin: {
		type: String,
		match: urlMatcher,
	},
	twitter: {
		type: String,
		match: urlMatcher,
	},
	instagram: {
		type: String,
		match: urlMatcher,
	},
});

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
    isUsernameUpdated: boolean;
	isAcceptingTestimonials: boolean;
	companysite?: string;
	socials: Socials[];
	testimonial: Testimonial[];
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
    isUsernameUpdated: {
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
});

export const UserModel =
	(mongoose.models.User as mongoose.Model<User>) ||
	mongoose.model<User>("User", UserSchema);
