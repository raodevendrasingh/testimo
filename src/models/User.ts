import mongoose, {Schema, Document} from "mongoose";

export interface Feedback extends Document{
    content: string,
    rating: number,
    name: string,
    jobTitle: string,
    imageUrl: string,
    createdAt: Date,
}

const FeedbackSchema: Schema<Feedback> = new Schema({
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
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    }
})

export interface User extends Document{
    username: string,
    email: string,
    password: string,
    verifyCode: string,
    verifyCodeExpiry: Date,
    isVerified: boolean,
    isAcceptingFeedback: boolean,
    feedback: Feedback[]
}

const UserSchema: Schema<User> = new Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        trim: true,
        unique: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Enter a valid email'],
    },
    password: {
        type: String,
        required: [true, 'Password is required']
    },
    verifyCode: {
        type: String,
        required: [true, 'Verify code is required']
    },
    verifyCodeExpiry: {
        type: Date,
        required: [true, 'Verify code expiry is required']
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isAcceptingFeedback: {
        type: Boolean,
        default: true
    },
    feedback: [FeedbackSchema]
})

export const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>('User', UserSchema);