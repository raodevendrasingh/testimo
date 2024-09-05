import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import { UserModel } from "@/models/User";

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
			async authorize(credentials: any): Promise<any> {
				await dbConnect();
				try {
					const user = await UserModel.findOne({
						$or: [
							{ email: credentials.identifier },
							{ username: credentials.identifier },
						],
					});
					if (!user) {
						throw new Error("No user found with this email");
					}
					if (!user.isVerified) {
						throw new Error("Please verify your account before logging in");
					}
					const isPasswordCorrect = await bcrypt.compare(
						credentials.password,
						user.password
					);
					if (isPasswordCorrect) {
						return user;
					} else {
						throw new Error("Incorrect password");
					}
				} catch (err: any) {
					throw new Error(err);
				}
			},
		}),
		GoogleProvider({
            clientId: googleClientId ?? '',
            clientSecret: googleClientSecret ?? '',
		}),
	],
	callbacks: {
		async jwt({ token, user, account, profile }) {
			await dbConnect();
			if (user) {
				let dbUser = await UserModel.findOne({ email: user.email });
                
				if (!dbUser) {
					dbUser = await UserModel.create({
						email: user.email,
						name: user.name,
						imageUrl: user.image,
						username: user.email?.split("@")[0] || profile?.name,
						isVerified: true,
						password:
							account?.provider === "google"
								? Math.random().toString(36).slice(-12)
								: undefined,
						verifyCode:
							account?.provider === "google" ? "GOOGLE_OAUTH" : "000000",
						verifyCodeExpiry: Date.now() + 1000 * 60 * 60 * 24,
						oauthProvider: account?.provider === "google" ? "google" : null,
					});
				}
				token._id = dbUser._id?.toString();
				token.isVerified = dbUser.isVerified;
				token.isAcceptingMessages = dbUser.isAcceptingTestimonials;
				token.username = dbUser.username;
				token.oauthProvider = dbUser.oauthProvider;
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
