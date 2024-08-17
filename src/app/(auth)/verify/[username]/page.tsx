"use client";

import { useToast } from "@/components/ui/use-toast";
import { verifySchema } from "@/schemas/verifySchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { useParams, useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import * as z from "Zod";

import {
	InputOTP,
	InputOTPGroup,
	InputOTPSeparator,
	InputOTPSlot,
} from "@/components/ui/input-otp";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";

const VerificationPage = () => {
	const router = useRouter();
	const params = useParams<{ username: string }>();
	const { toast } = useToast();

	const form = useForm<z.infer<typeof verifySchema>>({
		resolver: zodResolver(verifySchema),
	});

	const onSubmit: SubmitHandler<z.infer<typeof verifySchema>> = async (
		data
	) => {
		console.log(data);
		try {
			const response = await axios.post("/api/verify-code", {
				username: params.username,
				code: data.code,
			});
			toast({
				title: "Success",
				description: response.data.message,
                variant: "success"
			});
			router.replace("/sign-in");
		} catch (error) {
			console.error("Incorrect Verifyication Code: ", error);
			const axiosError = error as AxiosError<ApiResponse>;

			toast({
				title: "Verification Failed",
				description: "Incorrect Verification Code",
				variant: "destructive",
			});
		}
	};

	return (
		<div className="flex justify-center items-center min-h-screen bg-gray-100">
			<div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
				<div className="text-center">
					<h1 className="text-4xl font-extrabold tracking-tight mb-6">
						Verify your account
					</h1>
					<p className="mb-4">
						Enter the verification code received in your mail
					</p>
				</div>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="w-2/3 mx-auto space-y-6"
					>
						<FormField
							control={form.control}
							name="code"
							render={({ field }) => (
								<FormItem className="ml-2">
									<FormControl >
										<InputOTP maxLength={6} {...field}>
											<InputOTPGroup>
												<InputOTPSlot index={0} />
												<InputOTPSlot index={1} />
												<InputOTPSlot index={2} />
												<InputOTPSlot index={3} />
												<InputOTPSlot index={4} />
												<InputOTPSlot index={5} />
											</InputOTPGroup>
										</InputOTP>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button type="submit" className="w-full">
							Verify
						</Button>
					</form>
				</Form>
			</div>
		</div>
	);
};

export default VerificationPage;
