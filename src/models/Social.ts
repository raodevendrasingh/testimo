import { type Document, Schema } from "mongoose";

export const urlMatcher = [
	/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
	"Enter a valid URL",
];

export interface Socials extends Document {
	linkedin?: string;
	twitter?: string;
	instagram?: string;
}

export const SocialSchema: Schema<Socials> = new Schema({
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
