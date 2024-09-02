"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import * as z from "zod";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import { signInSchema } from "@/schemas/signInSchema";
import { signIn } from "next-auth/react";
import { toast } from "sonner";

const SignInPage = (): JSX.Element => {
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
	const router = useRouter();

	const form = useForm<z.infer<typeof signInSchema>>({
		resolver: zodResolver(signInSchema),
	});

	const onSubmit: SubmitHandler<z.infer<typeof signInSchema>> = async (
		data
	) => {
		setIsSubmitting(true);
		// console.log("data", data);
		try {
			const result = await signIn("credentials", {
				redirect: false,
				identifier: data.identifier,
				password: data.password,
			});

			// console.log("result", result);

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
                console.log("Logged in sucessfully");
				console.log("Navigating to dashboard"); // Log navigation attempt

				router.replace("/dashboard");
			} else {
				console.log("Sign-in failed, no valid status or ok flag"); // Log if no valid status or ok flag
			}
		} catch (error) {
			console.error("Sign-in error:", error);
			toast.error("An unexpected error occurred. Please try again.");
		} finally {
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
											<Input
												type="password"
												placeholder="Password"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<Button type="submit" disabled={isSubmitting} className="w-full">
								{isSubmitting ? (
									<>
										<Loader className="mr-2 size-4 animate-spin" /> Loading
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
							<Link
								href={"/sign-up"}
								className="text-blue-600 hover:text-blue-800"
							>
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
