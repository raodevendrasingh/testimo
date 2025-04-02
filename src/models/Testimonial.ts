import { type Document, Schema } from "mongoose";

export interface Testimonial extends Document {
	action: string;
	content: string;
	rating: number;
	name?: string;
	jobTitle?: string;
	imageUrl?: string;
	createdAt: Date;
}

export const TestimonialSchema: Schema<Testimonial> = new Schema({
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
