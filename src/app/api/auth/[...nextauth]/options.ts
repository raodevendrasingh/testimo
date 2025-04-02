import {
	INITIAL_TESTIMONIAL_COUNT,
	INITIAL_TIER,
	getExpiryDate,
	getResetDate,
} from "@/lib/constants";
import dbConnect from "@/lib/dbConnect";
import { UserModel } from "@/models/User";
import bcrypt from "bcryptjs";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;

export const authOptions: NextAuthOptions = {
	providers: [
		CredentialsProvider({
			id: "credentials",
			name: "Credentials",
			credentials: {
				email: { label: "Email", type: "text" },
				password: { label: "Password", type: "password" },
			},
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			async authorize(credentials: any): Promise<any> {
				await dbConnect();
				try {
					const user = await UserModel.findOne({
						$or: [{ email: credentials.identifier }, { username: credentials.identifier }],
					});
					if (!user) {
						throw new Error("No user found with this email");
					}
					if (!user.isVerified) {
						throw new Error("Please verify your account before logging in");
					}
					if (!user.password) {
						throw new Error("Please sign in with your OAuth provider");
					}
					const isPasswordCorrect = await bcrypt.compare(
						credentials.password,
						user.password as string,
					);
					if (isPasswordCorrect) {
						return user;
					}
					throw new Error("Incorrect password");
					// biome-ignore lint/suspicious/noExplicitAny: <explanation>
				} catch (err: any) {
					throw new Error(err);
				}
			},
		}),
		GoogleProvider({
			clientId: googleClientId ?? "",
			clientSecret: googleClientSecret ?? "",
		}),
	],
	callbacks: {
		async jwt({ token, user, account, profile }) {
			await dbConnect();
			if (user) {
				let dbUser = await UserModel.findOne({ email: user.email });

				if (!dbUser) {
					dbUser = await UserModel.create({
						username: user.email?.split("@")[0] || profile?.name,
						email: user.email,
						name: user.name,
						imageUrl: user.image,
						password: null,
						isVerified: true,
						verifyCode: "000000",
						verifyCodeExpiry: getExpiryDate(),
						isAcceptingTestimonials: true,
						oauthProvider: "GOOGLE",
						subscriptionTier: INITIAL_TIER,
						monthlyTestimonialCount: INITIAL_TESTIMONIAL_COUNT,
						subscriptionStartDate: new Date(),
						monthlyTestimonialResetDate: getResetDate(),
					});
				}
				token._id = dbUser._id?.toString();
				token.isVerified = dbUser.isVerified;
				token.isAcceptingTestimonials = dbUser.isAcceptingTestimonials;
				token.username = dbUser.username;
				token.oauthProvider = dbUser.oauthProvider;
				token.subscriptionTier = dbUser.subscriptionTier;
				token.monthlyTestimonialCount = dbUser.monthlyTestimonialCount;
				token.monthlyTestimonialResetDate = dbUser.monthlyTestimonialResetDate;
			}
			return token;
		},
		async session({ session, token }) {
			if (token) {
				session.user._id = token._id;
				session.user.isVerified = token.isVerified;
				session.user.isAcceptingTestimonials = token.isAcceptingTestimonials;
				session.user.username = token.username;
				session.user.oauthProvider = (token.oauthProvider as string) || null;
				session.user.subscriptionTier = token.subscriptionTier;
				session.user.monthlyTestimonialCount = token.monthlyTestimonialCount;
				session.user.monthlyTestimonialResetDate = token.monthlyTestimonialResetDate;
			}
			return session;
		},
	},
	session: {
		strategy: "jwt",
	},
	secret: process.env.NEXTAUTH_SECRET,
	pages: {
		signIn: "/sign-in",
	},
};
