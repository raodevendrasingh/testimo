import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import { UserModel } from "@/models/User";

export const authOptions: NextAuthOptions = {
	providers: [
		CredentialsProvider({
			id: "credentials",
			name: "Credentials",
			credentials: {
				identifier: { label: "Email", type: "text" },
				password: { label: "Password", type: "password" },
			},
			async authorize(credentials: any): Promise<any> {
				console.log("Authorize function called with credentials:", credentials);
				await dbConnect();
				try {
					const user = await UserModel.findOne({
						$or: [
							{ email: credentials.identifier },
							{ username: credentials.identifier },
						],
					});
					if (!user) {
						throw new Error("No user exists with this email!");
					}
					if (!user.isVerified) {
						throw new Error("Please verify your account before login!");
					}
					const isPasswordCorrect = await bcrypt.compare(
						credentials.password,
						user.password
					);
					if (isPasswordCorrect) {
						console.log("User authenticated:", user);
						return user;
					} else {
						throw new Error("Incorrect Password. Try Again!");
					}
				} catch (error: any) {
					console.error("Error in authorize function:", error);
					throw new Error(error.message);
				}
			},
		}),
	],
	callbacks: {
		async jwt({ token, user }) {
			console.log("JWT callback called with token:", token, "and user:", user);
			if (user) {
				token._id = user._id?.toString();
				token.isVerified = user.isVerified;
				token.isAcceptingFeedback = user.isAcceptingFeedback;
				token.username = user.username;
			}
			return token;
		},
		async session({ session, token }: { session: any; token: any }) {
			console.log(
				"Session callback called with session:",
				session,
				"and token:",
				token
			);
			if (token) {
				session.user._id = token._id;
				session.user.isVerified = token.isVerified;
				session.user.isAcceptingFeedback = token.isAcceptingFeedback;
				session.user.username = token.username;
			}
			return session;
		},
	},
	pages: {
		signIn: "/sign-in",
	},
	session: {
		strategy: "jwt",
	},
	secret: process.env.AUTH_SECRET,
	debug: process.env.NODE_ENV === "development",
};
