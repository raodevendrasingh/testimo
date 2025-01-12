"use client";

import { verifySchema } from "@/schemas/verifySchema";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import * as z from "zod";

import {
	InputOTP,
	InputOTPGroup,
	InputOTPSlot,
} from "@/components/ui/input-otp";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Loader } from "lucide-react";
import { toast } from "sonner";

const VerificationPage = () => {
	const [isVerifying, setIsVerifying] = useState<boolean>(false);
	const router = useRouter();
	const params = useParams<{ token: string }>();

	const form = useForm<z.infer<typeof verifySchema>>({
		resolver: zodResolver(verifySchema),
	});

	const onSubmit: SubmitHandler<z.infer<typeof verifySchema>> = async (
		data
	) => {
		try {
			setIsVerifying(true);
			const response = await axios.post("/api/verify-code", {
				token: params.token,
				code: data.code,
			});
			toast.success("Success", {
				description: response.data.message,
			});
			setIsVerifying(false);
			router.replace("/sign-in");
		} catch (error) {
			toast.error("Verification Failed", {
				description: "Incorrect Verification Code",
			});
		} finally {
			form.reset();
			setIsVerifying(false);
		}
	};

	return (
		<div className="relative min-h-screen">
			<div className="absolute -z-10 inset-0 bg-white bg-[radial-gradient(#d2d2d2_1px,transparent_1px)] [background-size:20px_20px]" />
			<div className="relative z-10 flex justify-center items-center min-h-screen">
				<div className="w-full max-w-xl p-8 m-3 space-y-6 bg-white rounded-xl shadow-md">
					<div className="text-center">
						<h1 className="text-4xl font-bold tracking-tight mb-6 font-serif lg:text-5xl">
							Verify your account
						</h1>

						<p className="mb-4">
							Enter the six-digit verification code received in
							your mail
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
												<InputOTP
													maxLength={6}
													{...field}
												>
													<InputOTPGroup>
														<InputOTPSlot
															index={0}
														/>
														<InputOTPSlot
															index={1}
														/>
														<InputOTPSlot
															index={2}
														/>
														<InputOTPSlot
															index={3}
														/>
														<InputOTPSlot
															index={4}
														/>
														<InputOTPSlot
															index={5}
														/>
													</InputOTPGroup>
												</InputOTP>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
							<Button
								type="submit"
								disabled={isVerifying}
								className="w-full"
							>
								{isVerifying ? (
									<>
										Verifying{" "}
										<Loader className="ml-2 size-4 animate-spin" />
									</>
								) : (
									"Verify"
								)}
							</Button>
						</form>
					</Form>
				</div>
			</div>
		</div>
	);
};

export default VerificationPage;
