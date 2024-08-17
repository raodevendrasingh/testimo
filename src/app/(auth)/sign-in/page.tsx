"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import * as z from "Zod";
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

const SignInPage = (): JSX.Element => {
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
	const { toast } = useToast();
	const router = useRouter();

	const form = useForm<z.infer<typeof signInSchema>>({
		resolver: zodResolver(signInSchema)
	});

	const onSubmit: SubmitHandler<z.infer<typeof signInSchema>> = async (
		data
	) => {
		try {
			setIsSubmitting(true);
			const result = await signIn("credentials", {
				redirect: false,
				identifier: data.identifier,
				password: data.password,
			});

			if (result?.error) {
				toast({
					title: "Login failed",
					description: "Incorrect credentials",
					variant: "destructive",
				});
			}
            if (result?.url) {
				toast({
					title: "Success",
					description: "You are now signed in!",
					variant: "success",
				});
				router.replace("/dashboard");
			}
		} catch (error) {
			toast({
				title: "Error",
				description: "An unexpected error occurred",
				variant: "destructive",
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="flex justify-center items-center min-h-screen bg-gray-100">
			<div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-md">
				<div className="text-center">
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
										<Input type="password" placeholder="Password" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button type="submit" disabled={isSubmitting} className="w-full">
							{isSubmitting ? (
								<>
									<Loader className="mr-2 size-4 animate-spin" /> Signing In..
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
	);
};

export default SignInPage;
