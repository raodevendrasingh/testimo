"use client";

import { useToast } from "@/components/ui/use-toast";
import { verifySchema } from "@/schemas/verifySchema";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
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
import { useState } from "react";
import { Loader } from "lucide-react";

const VerificationPage = () => {
	const [isVerifying, setIsVerifying] = useState<boolean>(false);
	const router = useRouter();
	const params = useParams<{ username: string }>();
	const { toast } = useToast();

	const form = useForm<z.infer<typeof verifySchema>>({
		resolver: zodResolver(verifySchema),
	});

	const onSubmit: SubmitHandler<z.infer<typeof verifySchema>> = async (
		data
	) => {
		try {
			setIsVerifying(true);
			const response = await axios.post("/api/verify-code", {
				username: params.username,
				code: data.code,
			});
			toast({
				title: "Success",
				description: response.data.message,
				variant: "success",
			});
			setIsVerifying(false);
			router.replace("/sign-in");
		} catch (error) {
			// console.error("Incorrect Verification Code: ", error);
			toast({
				title: "Verification Failed",
				description: "Incorrect Verification Code",
				variant: "destructive",
			});
		} finally {
			setIsVerifying(false);
		}
	};

	return (
		<div className="flex justify-center items-center h-screen bg-gray-100">
			<div className="w-full max-w-xl m-3 p-8 space-y-8 bg-white rounded-lg shadow-md">
				<div className="text-center">
					<h1 className="text-4xl font-bold tracking-tight mb-6 font-serif lg:text-5xl">
						Verify your account
					</h1>

					<p className="mb-4">
						Enter the six-digit verification code received in your mail
					</p>
				</div>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="w-2/3 mx-auto space-y-8"
					>
						<div className="flex justify-center">
							<FormField
								control={form.control}
								name="code"
								render={({ field }) => (
									<FormItem className="">
										<FormControl>
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
						</div>
						<Button type="submit" disabled={isVerifying} className="w-full">
							{isVerifying ? (
								<>
									<Loader className="mr-2 size-4 animate-spin" /> Verifying...
								</>
							) : (
								"Verify"
							)}
						</Button>
					</form>
				</Form>
			</div>
		</div>
	);
};

export default VerificationPage;
