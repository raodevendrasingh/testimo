import mongoose, { Schema, Document } from "mongoose";

const urlMatcher = [
	/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
	"Enter a valid URL",
];
export interface Feedback extends Document {
	action: string;
	content: string;
	rating: number;
	name?: string;
	jobTitle?: string;
	imageUrl?: string;
	createdAt: Date;
}

const FeedbackSchema: Schema<Feedback> = new Schema({
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
		required: true,
	},
	jobTitle: {
		type: String,
	},
	imageUrl: {
		type: String,
        match: urlMatcher,
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
	username: string;
	name?: string;
	imageUrl?: String;
	tagline?: String;
	email: string;
	password: string;
	verifyCode: string;
	verifyCodeExpiry: Date;
	isVerified: boolean;
	isAcceptingFeedback: boolean;
	socials: Socials[];
	feedback: Feedback[];
}

const UserSchema: Schema<User> = new Schema({
	username: {
		type: String,
		required: [true, "Username is required"],
		trim: true,
		unique: true,
	},
	name: {
		type: String,
		required: [true, "Name is Required"],
	},
	imageUrl: {
		type: String,
        match: urlMatcher,
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
	isAcceptingFeedback: {
		type: Boolean,
		default: true,
	},
	socials: SocialSchema,
	feedback: [FeedbackSchema],
});

export const UserModel =
	(mongoose.models.User as mongoose.Model<User>) ||
	mongoose.model<User>("User", UserSchema);
