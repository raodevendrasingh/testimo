"use client";

import React, { useEffect, useRef, useState } from "react";
import axios, { AxiosError } from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, UseFormReturn, useForm } from "react-hook-form";
import { ArrowLeft, ArrowRight, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Rating } from "react-simple-star-rating";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import * as z from "Zod";
import { ApiResponse } from "@/types/ApiResponse";
import Link from "next/link";
import { useParams } from "next/navigation";
import { feedbackSchema } from "@/schemas/feedbackSchema";
import { AnimatePresence, motion } from "framer-motion";
import { Input } from "@/components/ui/input";

import heartIcon from "@/assets/svgicons/heart-svgrepo-com.png";
import starIcon from "@/assets/svgicons/star-svgrepo-com.png";
import Image from "next/image";

const screens = [
	{ title: "Write a Testimonial", image: starIcon },
	{ title: "Add a Personal Touch", image: heartIcon },
];

export default function SendMessage() {
	const [currentScreen, setCurrentScreen] = useState(0);
	const [slideDirection, setSlideDirection] = useState(0);
	const [isLoading, setIsLoading] = useState(false);

	const form = useForm<z.infer<typeof feedbackSchema>>({
		resolver: zodResolver(feedbackSchema),
		defaultValues: {
			rating: 0,
			content: "",
			name: "",
			jobTitle: "",
		},
	});

	const {
		control,
		handleSubmit,
		formState: { errors, isValid },
		watch,
		setValue,
	} = form;

	const handleNext = (e: React.MouseEvent) => {
		e.preventDefault();
		setSlideDirection(1);
		setCurrentScreen((prev) => prev + 1);
	};

	const handlePrevious = (e: React.MouseEvent) => {
		e.preventDefault();
		setSlideDirection(-1);
		setCurrentScreen((prev) => prev - 1);
	};

	const renderScreen = () => {
		switch (currentScreen) {
			case 0:
				return <FeedbackForm control={control} errors={errors} />;
			case 1:
				return <DetailForm control={control} errors={errors} />;
			default:
				return null;
		}
	};

	const params = useParams<{ username: string }>();
	const username = params.username;
	// console.log(username);

	const onSubmit: SubmitHandler<z.infer<typeof feedbackSchema>> = async (
		data
	) => {
		setIsLoading(true);

		const feedbackData = { ...data, username: username };
		feedbackData.username = username;

		console.log("Feedback data:", feedbackData);

		try {
			const response = await axios.post<ApiResponse>(
				"/api/send-feedback",
				feedbackData
			);
			console.log("Feedback data with username:", feedbackData);

			console.log(response.data);
			toast({
				title: response.data.message,
			});
		} catch (error) {
			const axiosError = error as AxiosError<ApiResponse>;
			toast({
				title: "Error",
				description:
					axiosError.response?.data.message ?? "Failed to send message",
				variant: "destructive",
			});
		} finally {
			setIsLoading(false);
		}
	};

	const rating = watch("rating");
	const content = watch("content");

	const isFirstScreenValid = rating > 0 && content.trim() !== "";
	// const isFirstScreenValid =		watch("rating") > 0 && watch("content").trim() !== "";

	return (
		<>
			<section className="flex flex-col gap-5">
				{/* navbar */}
				<nav className="sticky top-0 w-full h-16 flex items-center justify-start gap-2 px-12 bg-transparent border-b">
					<span className="text-3xl font-extrabold text-black">
						<Link href="/">critiqly</Link>
					</span>
					<span className="inline-flex items-center gap-x-1.5 py-1 px-2 rounded-md text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-800/30 dark:text-blue-500">
						Beta
					</span>
				</nav>
				<AnimatePresence>
					<div className="w-2/5 mx-auto border rounded-xl shadow">
						<div className="flex items-center gap-5 rounded-t p-3 border-b">
							<span>
								<Image
									src={screens[currentScreen].image}
									alt="screen-logo"
									width={25}
								/>
							</span>
							<span className="text-2xl font-semibold text-gray-800 mt-1">
								{screens[currentScreen].title}
							</span>
						</div>
						<div className="p-3">
							<Form {...form}>
								<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
									<motion.div
										key={currentScreen}
										initial={{ x: slideDirection * 50, opacity: 0 }}
										animate={{ x: 0, opacity: 1 }}
										exit={{ x: -slideDirection * 50, opacity: 0 }}
										transition={{ duration: 0.3 }}
										className="h-[45vh] overflow-y-auto scroll-smooth"
									>
										<div className="p-3">
											<div className="flex flex-col gap-3">
												{renderScreen()}
											</div>
										</div>
									</motion.div>

									<div className="flex justify-between mt-4">
										{currentScreen > 0 && (
											<Button
												type="button"
												onClick={handlePrevious}
												className="flex items-center text-sm"
											>
												<ArrowLeft className="mr-2 size-4" /> Previous
											</Button>
										)}
										{currentScreen < screens.length - 1 ? (
											<Button
												type="button"
												onClick={handleNext}
												disabled={!isFirstScreenValid}
												className="flex items-center text-sm ml-auto"
											>
												Next <ArrowRight className="ml-2 size-4" />
											</Button>
										) : (
											<Button
												type="submit"
												// disabled={isLoading || !isValid}
												disabled={!isFirstScreenValid}
												className="flex items-center text-sm hover:bg-zinc-900 transition-colors ml-auto"
											>
												Send
												<Send className="ml-2 size-4" />
											</Button>
										)}
									</div>
								</form>
							</Form>
						</div>
					</div>
				</AnimatePresence>

				{/* signup card */}
				<div className="absolute bottom-5 right-5 shadow text-center border rounded-lg p-3 w-52">
					<div className="mb-4 text-sm font-medium">
						Want Your Own Testimonial Board ?
					</div>
					<Link href={"/sign-up"}>
						<Button className="w-full">Sign Up</Button>
					</Link>
				</div>
			</section>
		</>
	);
}

const FeedbackForm: React.FC<{
	control: any;
	errors: any;
}> = ({ control, errors }) => {
	const [bio, setBio] = useState("");
	const maxChars = 250;

	return (
		<div className="flex flex-col gap-2">
			<FormField
				control={control}
				name="rating"
				render={({ field }) => (
					<FormItem>
						<FormLabel>Rate your experience</FormLabel>
						<FormControl>
							<div className="flex justify-start items-center">
								<div>
									<Rating
										onClick={(rate: number) => {
											field.onChange(rate);
										}}
										fillColorArray={[
											"#f14f45",
											"#f16c45",
											"#f18845",
											"#f1b345",
											"#f1d050",
										]}
										initialValue={field.value}
										transition
										size={40}
									/>
								</div>
							</div>
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>
			<div>
				<FormField
					control={control}
					name="content"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Write your feedback here</FormLabel>
							<FormControl>
								<Textarea
									{...field}
									maxLength={maxChars}
									className="resize-none"
									onChange={(e) => {
										setBio(e.target.value);
										field.onChange(e);
									}}
									placeholder="Write your feedback here"
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<span className="relative right-0 text-xs text-gray-600">
					({maxChars - bio.length}/{maxChars})
				</span>
			</div>
		</div>
	);
};

const DetailForm: React.FC<{
	control: any;
	errors: any;
}> = ({ control, errors }) => {
	const [fileUrl, setFileUrl] = useState<string | null>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
		setFileUrl(null);
	}, []);
	return (
		<>
			<FormField
				control={control}
				name="name"
				render={({ field }) => (
					<FormItem>
						<FormLabel>Full Name (Optional)</FormLabel>
						<FormControl>
							<Input placeholder="Full Name" {...field} />
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>
			<FormField
				control={control}
				name="imageUrl"
				render={({ field }) => {
					const handleFileChange = (
						event: React.ChangeEvent<HTMLInputElement>
					) => {
						const file = event.target.files?.[0];
						if (file) {
							const url = URL.createObjectURL(file);
							setFileUrl(url);
							field.onChange(url); // Store the URL string instead of the file object
						}
					};

					return (
						<FormItem>
							<FormLabel>Upload Picture</FormLabel>
							<Input
								ref={fileInputRef}
								id="picture"
								type="file"
								onChange={handleFileChange}
								// Clear the file input value when the field value is cleared
								onClick={(e) => {
									if (!field.value) {
										e.currentTarget.value = "";
									}
								}}
							/>
							<FormMessage />
							{field.value && (
								<Image src={field.value} alt="pfp" width={40} height={40} />
							)}
						</FormItem>
					);
				}}
			/>
			<FormField
				control={control}
				name="jobTitle"
				render={({ field }) => (
					<FormItem>
						<FormLabel>Job Title (Optional)</FormLabel>
						<FormControl>
							<Input placeholder="Job Title" {...field} />
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>
		</>
	);
};
