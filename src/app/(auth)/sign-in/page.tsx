"use client";

import { GoogleAuthButton } from "@/components/GoogleAuthButton";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { signInSchema } from "@/schemas/signInSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type JSX, useState } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import type * as z from "zod";

const SignInPage = (): JSX.Element => {
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
	const router = useRouter();

	const form = useForm<z.infer<typeof signInSchema>>({
		resolver: zodResolver(signInSchema),
	});

	const onSubmit: SubmitHandler<z.infer<typeof signInSchema>> = async (data) => {
		setIsSubmitting(true);
		try {
			const result = await signIn("credentials", {
				redirect: false,
				identifier: data.identifier,
				password: data.password,
			});

			if (result?.error) {
				if (result.error === "CredentialsSignin") {
					toast.error("Login Failed", {
						description: "Incorrect username or password",
					});
				} else {
					toast.error(result.error);
				}
				setIsSubmitting(false);
				return;
			}

			if (result?.status === 200 && result.ok && result.url) {
				router.replace("/dashboard");
			} else {
				console.error("Sign-in failed, no valid status or ok flag");
			}
		} catch (error) {
			console.error("Sign-in error:", error);
			toast.error("An unexpected error occurred. Please try again.");
		} finally {
			form.reset();
			setIsSubmitting(false);
		}
	};

	return (
		<div className="relative min-h-screen">
			<div className="absolute -z-10 inset-0 bg-white bg-[radial-gradient(#d2d2d2_1px,transparent_1px)] [background-size:20px_20px]" />
			<div className="relative z-10 flex justify-center items-center h-screen">
				<div className="w-full max-w-md p-8 m-3 space-y-6 bg-white rounded-xl shadow-md">
					<div className="select-none">
						<h1 className="text-4xl font-bold tracking-tight mb-6 font-serif lg:text-5xl text-left">
							sign in.
						</h1>
					</div>
					<GoogleAuthButton />
					<div className="flex items-center justify-center px-5">
						<Separator className="w-1/2" />
						<p className="text-center text-sm text-gray-500 mx-4">or</p>
						<Separator className="w-1/2" />
					</div>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
							<FormField
								name="identifier"
								control={form.control}
								render={({ field }) => (
									<FormItem>
										<FormLabel>Email / Username</FormLabel>
										<FormControl>
											<Input placeholder="Email / Username" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								name="password"
								control={form.control}
								render={({ field }) => (
									<FormItem>
										<FormLabel>Password</FormLabel>
										<FormControl>
											<Input type="password" placeholder="Password" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<Button type="submit" disabled={isSubmitting} className="w-full">
								{isSubmitting ? (
									<>
										Please wait <Loader className="ml-2 size-4 animate-spin" />
									</>
								) : (
									"Sign In"
								)}
							</Button>
						</form>
					</Form>
					<div className="text-center mt-4">
						<p>
							Don&apos;t have an account?{" "}
							<Link href={"/sign-up"} className="text-blue-600 hover:text-blue-800">
								Sign Up
							</Link>
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default SignInPage;
