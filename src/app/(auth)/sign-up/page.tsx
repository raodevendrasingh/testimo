"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDebounceCallback } from "usehooks-ts";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import * as z from "zod";
import axios, { AxiosError } from "axios";
import { signUpSchema } from "@/schemas/signUpSchema";

import { ApiResponse } from "@/types/ApiResponse";

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
import { toast } from "sonner";

const SignUpPage = (): JSX.Element => {
	const [username, setUsername] = useState<string>("");
	const [usernameMsg, setUsernameMsg] = useState<string>("");
	const [isCheckingUsername, setIsCheckingUsername] = useState<boolean>(false);
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

	const router = useRouter();

	const debounced = useDebounceCallback(setUsername, 500);

	const form = useForm<z.infer<typeof signUpSchema>>({
		resolver: zodResolver(signUpSchema),
		defaultValues: {
			username: "",
			email: "",
			password: "",
		},
	});

	useEffect(() => {
		const checkUsernameUniqueness = async () => {
			if (username) {
				setIsCheckingUsername(true);
				setUsernameMsg("");

				try {
					const url = `/api/check-username?username=${username}`;
					const response = await axios.get(url);
					setUsernameMsg(response.data.message);
				} catch (error) {
					const axiosError = error as AxiosError<ApiResponse>;
					setUsernameMsg(
						axiosError.response?.data.message ?? "Error checking username"
					);
				} finally {
					setIsCheckingUsername(false);
				}
			}
		};
		checkUsernameUniqueness();
	}, [username]);

	const onSubmit: SubmitHandler<z.infer<typeof signUpSchema>> = async (
		data
	) => {
		console.log("Form submission initiated", data);
		setIsSubmitting(true);
		try {
			const response = await axios.post<ApiResponse>("/api/sign-up", data);
			console.log("API Response:", response.data);
			toast("Success", { description: response.data.message });
			router.replace(`/verify/${data.username}`);
		} catch (error) {
			console.error("Signup Failed: ", error);
			const axiosError = error as AxiosError<ApiResponse>;
			let errorMsg =
				axiosError.response?.data.message || "An unknown error occurred";
			toast.error("Sign Up Failed", { description: errorMsg });
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="relative min-h-screen">
			<div className="absolute -z-10 inset-0 bg-white bg-[radial-gradient(#d2d2d2_1px,transparent_1px)] [background-size:20px_20px]" />
			<div className="relative z-10 flex justify-center items-center min-h-screen">
				<div className="w-full max-w-md p-8 m-3 space-y-6 bg-white rounded-xl shadow-md">
					<div className="select-none">
						<h1 className="text-4xl font-bold tracking-tight mb-6 font-serif lg:text-5xl text-left">
							sign up.
						</h1>
					</div>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
							<FormField
								name="username"
								control={form.control}
								render={({ field }) => (
									<FormItem>
										<FormLabel>Username</FormLabel>
										<FormControl>
											<Input
												placeholder="Username"
												{...field}
												onChange={(e) => {
													field.onChange(e);
													debounced(e.target.value);
												}}
											/>
										</FormControl>
										{isCheckingUsername && (
											<Loader className="animate-spin size-3" />
										)}
										<p
											className={`text-xs italic ${
												usernameMsg === "Username is available"
													? "text-green-500 "
													: "text-rose-500 "
											}`}
										>
											{usernameMsg}
										</p>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								name="email"
								control={form.control}
								render={({ field }) => (
									<FormItem>
										<FormLabel>Email</FormLabel>
										<FormControl>
											<Input placeholder="Email" {...field} />
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
							<Button
								type="submit"
								disabled={isSubmitting}
								className="w-full rounded-lg"
							>
								{isSubmitting ? (
									<>
										<Loader className="mr-2 size-4 animate-spin" /> Loading
									</>
								) : (
									"Sign Up"
								)}
							</Button>
						</form>
					</Form>
					<div className="text-center mt-4 text-base">
						<p>
							Already have an account?{" "}
							<Link
								href={"/sign-in"}
								className="text-blue-600 hover:text-blue-800"
							>
								Sign In
							</Link>
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default SignUpPage;
