"use client";

import { useEffect, useRef, useState } from "react";
import axios, { AxiosError } from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { ArrowRight, Loader, Send, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Rating } from "react-simple-star-rating";
import FancyText from "@carefully-coded/react-text-gradient";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import * as z from "zod";
import { ApiResponse } from "@/types/ApiResponse";
import Link from "next/link";
import { useParams } from "next/navigation";
import { feedbackSchema } from "@/schemas/feedbackSchema";
import { AnimatePresence, motion } from "framer-motion";
import { Input } from "@/components/ui/input";

import heartIcon from "@/assets/svgicons/heart-svgrepo-com.png";
import starIcon from "@/assets/svgicons/star-svgrepo-com.png";
import Image from "next/image";
import { CldImage, CldUploadWidget } from "next-cloudinary";
import type { ConfettiRef } from "@/components/magicui/confetti";
import Confetti from "@/components/magicui/confetti";

import remonial_wordmark_dark from "@/assets/brand/remonial_wordmark_dark.png";

const screens = [
	{ title: "Write a Testimonial", image: starIcon },
	{ title: "Add a Personal Touch", image: heartIcon },
	{ title: "Thank You", image: heartIcon },
];

export default function SendMessage() {
	const [currentScreen, setCurrentScreen] = useState(0);
	const [slideDirection, setSlideDirection] = useState(0);
	const [isLoading, setIsLoading] = useState(false);

	const form = useForm<z.infer<typeof feedbackSchema>>({
		resolver: zodResolver(feedbackSchema),
		defaultValues: {
			action: "default",
			rating: 0,
			content: "",
			name: undefined,
			jobTitle: undefined,
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

	const renderScreen = () => {
		switch (currentScreen) {
			case 0:
				return <TestimonialForm control={control} errors={errors} />;
			case 1:
				return <DetailForm control={control} setValue={setValue} />;
			case 2:
				return <ThankYouScreen />;
			default:
				return null;
		}
	};

	const params = useParams<{ username: string }>();
	const username = params.username;

	const onSubmit: SubmitHandler<z.infer<typeof feedbackSchema>> = async (
		data
	) => {
		setIsLoading(true);

		const feedbackData = { ...data, username: username, action: "default" };

		try {
			const response = await axios.post<ApiResponse>(
				"/api/send-testimonial",
				feedbackData
			);
			toast.success(response.data.message);
			setCurrentScreen(2);
		} catch (error) {
			const axiosError = error as AxiosError<ApiResponse>;
			toast.error("Error", {
				description:
					axiosError.response?.data.message ?? "Failed to send message",
			});
		} finally {
			setIsLoading(false);
		}
	};

	const rating = watch("rating");
	const content = watch("content");

	const isFirstScreenValid = rating > 0 && content.trim() !== "";

	return (
		<>
			<section className="relative min-h-screen flex flex-col gap-5 overflow-y-auto">
				<div className="absolute -z-10 inset-0 bg-white bg-[radial-gradient(#d2d2d2_1px,transparent_1px)] [background-size:20px_20px]" />

				{/* navbar */}
				<nav className="sticky top-0 w-full flex items-center justify-start gap-2 px-12 pt-2">
					<Link href="/">
						<Image
							src={remonial_wordmark_dark}
							alt="remonials"
							width={180}
							height={40}
							className="aspect-auto"
						/>
					</Link>
					<span className="inline-flex items-center gap-x-1.5 py-1 px-2 rounded-md text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-800/30 dark:text-blue-500">
						Beta
					</span>
				</nav>
				{/* content box */}
				<AnimatePresence>
					<div className="w-[70%] sm:w-2/4 max-w-md mx-auto border rounded-xl bg-white shadow">
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
										className="h-[50vh]"
									>
										<div className="p-3">
											<div className="flex flex-col gap-3">
												{renderScreen()}
											</div>
										</div>
									</motion.div>

									<div className="flex justify-between mt-4 p-2">
										{currentScreen === 0 && (
											<Button
												type="button"
												onClick={handleNext}
												disabled={!isFirstScreenValid}
												className="flex items-center text-sm w-full"
											>
												Next <ArrowRight className="ml-2 size-4" />
											</Button>
										)}
										{currentScreen === 1 && (
											<Button
												type="submit"
												disabled={!isFirstScreenValid || isLoading}
												className="flex items-center text-sm w-full"
											>
												{isLoading ? (
													<>
														<span>Sending </span>
														<Loader className="size-4 ml-3 animate-spin " />
													</>
												) : (
													<>
														Send
														<Send className="ml-3 size-4" />
													</>
												)}
											</Button>
										)}
									</div>
								</form>
							</Form>
						</div>
					</div>
				</AnimatePresence>

				{/* signup card */}
				<div className="absolute bottom-2 right-2 shadow text-center border rounded-lg p-3 w-52 bg-white">
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

const TestimonialForm: React.FC<{
	control: any;
	errors: any;
}> = ({ control, errors }) => {
	const [bio, setBio] = useState("");
	const maxChars = 500;

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
			<div className="text-light text-sm py-3 text-gray-600">
				<ul className="list-disc pl-5">
					<li>How did our service help you?</li>
					<li>What did you like the most about our service?</li>
					<li>Would you recommend us to others? Why?</li>
				</ul>
			</div>
			<div>
				<FormField
					control={control}
					name="content"
					render={({ field }) => (
						<FormItem>
							<FormControl>
								<Textarea
									{...field}
									maxLength={maxChars}
                                    rows={5}
									className="resize-none"
									onChange={(e) => {
										setBio(e.target.value);
										field.onChange(e);
									}}
									placeholder="Please share your experience with us"
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

interface CloudinaryUploadWidgetInfo {
	public_id: string;
}

interface CloudinaryUploadWidgetResults {
	event?: string;
	info?: string | CloudinaryUploadWidgetInfo;
}

const DetailForm: React.FC<{
	control: any;
	setValue: any;
}> = ({ control, setValue }) => {
	const [publicId, setPublicId] = useState<string>("");

	useEffect(() => {
		if (publicId) {
			setValue("imageUrl", publicId);
		}
	}, [publicId, setValue]);

	return (
		<>
			<div className="flex items-center gap-2 pb-1 -mt-3">
				<span className="font-mono font-light text-xl">*</span>
				<span className="font-light">Completely Optional</span>
			</div>
			<FormLabel>Profile Picture</FormLabel>
			<div className="w-full border h-24 border-dashed rounded-lg p-2 flex justify-center items-center border-gray-400 bg-sky-50">
				<CldUploadWidget
					options={{
						sources: ["local"],
						multiple: false,
						maxFiles: 1,
						cropping: true,
						croppingAspectRatio: 1,
						showSkipCropButton: false,
						clientAllowedFormats: ["jpg", "jpeg", "png"],
						minImageWidth: 300,
						minImageHeight: 300,
						maxImageFileSize: 1050000,
						styles: {
							palette: {
								window: "#FFFFFF",
								windowBorder: "#90A0B3",
								tabIcon: "#141414",
								menuIcons: "#5A616A",
								textDark: "#000000",
								textLight: "#FFFFFF",
								link: "#141414",
								action: "#FF620C",
								error: "#F44235",
								inProgress: "#0078FF",
								complete: "#20B832",
								sourceBg: "#FFFFFF",
							},
							fonts: {
								default: null,
								"'Poppins', sans-serif": {
									url: "https://fonts.googleapis.com/css?family=Poppins",
									active: true,
								},
							},
						},
					}}
					uploadPreset={process.env.NEXT_PUBLIC_UPLOAD_PRESET}
					onSuccess={(results: CloudinaryUploadWidgetResults) => {
						if (typeof results.info === "object" && results.info !== null) {
							setPublicId(results.info.public_id);
						} else {
							console.error("Unexpected info format:", results.info);
						}
					}}
				>
					{({ open }) => (
						<button
							type="button"
							onClick={(e) => {
								e.preventDefault();
								open();
							}}
							className="flex justify-center items-center text-gray-600 gap-3 p-8 w-full"
						>
							{publicId ? (
								<>
									<CldImage
										src={publicId}
										alt={publicId}
										width={50}
										height={50}
										className="rounded-md"
									/>
									<div className="flex flex-col justify-start items-start">
										<span className="text-sm text-green-600">
											Image Successfully uploaded
										</span>
										<span className="text-xs">
											Click to upload another image
										</span>
									</div>
								</>
							) : (
								<div className="flex items-center justify-center gap-3 ">
									<Upload />
									<span>Upload an Image</span>
								</div>
							)}
						</button>
					)}
				</CldUploadWidget>
			</div>
			<FormField
				control={control}
				name="name"
				render={({ field }) => (
					<FormItem>
						<FormLabel>Full Name</FormLabel>
						<FormControl>
							<Input placeholder="Full Name" {...field} />
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>
			<FormField
				control={control}
				name="jobTitle"
				render={({ field }) => (
					<FormItem>
						<FormLabel>Job Title</FormLabel>
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

const ThankYouScreen: React.FC<{}> = () => {
	const confettiRef = useRef<ConfettiRef>(null);
	return (
		<div className="relative flex select-none w-full flex-col items-center justify-center overflow-hidden">
			<FancyText
				gradient={{ from: "#a6fc7e", to: "#32c8ed", type: "radial" }}
				animateTo={{ from: "#6DEDD0", to: "#fc7e7e" }}
				animateDuration={1000}
			>
				<div className="text-5xl pt-10 sm:text-7xl font-extrabold font-mono text-center flex flex-col items-center justify-center gap-5 h-full">
					<span className="block">YOU</span>
					<span className="block">ARE</span>
					<span className="block">AWESOME</span>
				</div>
			</FancyText>
			<Confetti
				ref={confettiRef}
				className="absolute left-0 top-0 z-0 size-full"
				onMouseEnter={() => {
					confettiRef.current?.fire({});
				}}
			/>
		</div>
	);
};
