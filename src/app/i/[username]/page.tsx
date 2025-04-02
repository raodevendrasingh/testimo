"use client";

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
import { Textarea } from "@/components/ui/textarea";
import { feedbackSchema } from "@/schemas/feedbackSchema";
import type { ApiResponse } from "@/types/ApiResponse";
import FancyText from "@carefully-coded/react-text-gradient";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { type AxiosError } from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Loader, Send, Upload } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { Rating } from "react-simple-star-rating";
import { toast } from "sonner";
import type * as z from "zod";

import userImage from "@/assets/placeholder/emptyUser.png";
import heartIcon from "@/assets/svgicons/heart-svgrepo-com.png";
import starIcon from "@/assets/svgicons/star-svgrepo-com.png";
import type { ConfettiRef } from "@/components/magicui/confetti";
import Confetti from "@/components/magicui/confetti";
import { CldImage, CldUploadWidget } from "next-cloudinary";
import Image from "next/image";

import remonial_wordmark_dark from "@/assets/brand/remonial_wordmark_dark.png";
import { ImageCropper } from "@/components/ImageCropper";
import { uploadToCloudinary } from "@/lib/UploadToCloudinary";
import { useLocalStorage, useReadLocalStorage } from "usehooks-ts";

const screens = [
	{ title: "Write a Testimonial", image: starIcon },
	{ title: "Add a Personal Touch", image: heartIcon },
	{ title: "Thank You", image: heartIcon },
];

export default function SendTestimonial() {
	const [currentScreen, setCurrentScreen] = useState(0);
	const [slideDirection, setSlideDirection] = useState(0);
	const [isLoading, setIsLoading] = useState(false);
	const croppedImage = useReadLocalStorage<string | ArrayBuffer | null>("croppedImage");
	const [, , removeCroppedValue] = useLocalStorage<string>("croppedImage", "null");

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

	const onSubmit: SubmitHandler<z.infer<typeof feedbackSchema>> = async (data) => {
		setIsLoading(true);
		try {
			let cloudinaryImageUrl = "";
			if (croppedImage) {
				cloudinaryImageUrl = await uploadToCloudinary(croppedImage as string);
			}

			const feedbackData = {
				...data,
				imageUrl: cloudinaryImageUrl,
				username: username,
				action: "default",
			};

			const response = await axios.post<ApiResponse>("/api/send-testimonial", feedbackData);
			toast.success(response.data.message);
			setCurrentScreen(2);
			removeCroppedValue();
		} catch (error) {
			const axiosError = error as AxiosError<ApiResponse>;
			toast.error("Error", {
				description: axiosError.response?.data.message ?? "Failed to send message",
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
					<div className="w-[70%] sm:w-2/4 max-w-md mx-auto border rounded-xl bg-white shadow-sm">
						<div className="flex items-center gap-5 rounded-t p-3 border-b">
							<span>
								<Image src={screens[currentScreen].image} alt="screen-logo" width={25} />
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
										initial={{
											x: slideDirection * 50,
											opacity: 0,
										}}
										animate={{ x: 0, opacity: 1 }}
										exit={{
											x: -slideDirection * 50,
											opacity: 0,
										}}
										transition={{ duration: 0.3 }}
										className="h-[50vh]"
									>
										<div className="p-3">
											<div className="flex flex-col gap-3">{renderScreen()}</div>
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
				<div className="absolute bottom-2 right-2 shadow-sm text-center border rounded-lg p-3 w-52 bg-white">
					<div className="mb-4 text-sm font-medium">Want Your Own Testimonial Board ?</div>
					<Link href={"/sign-up"}>
						<Button className="w-full">Sign Up</Button>
					</Link>
				</div>
			</section>
		</>
	);
}

const TestimonialForm: React.FC<{
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	control: any;
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
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
										fillColorArray={["#f14f45", "#f16c45", "#f18845", "#f1b345", "#f1d050"]}
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
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	control: any;
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	setValue: any;
}> = ({ control, setValue }) => {
	const [, setCroppedValue] = useLocalStorage<string | ArrayBuffer | null>("croppedImage", "");
	const [croppedImage, setCroppedImage] = useState<string | null>(null);
	const [uploadedImage, setUploadedImage] = useState<string | null>(null);
	const inputRef = useRef<HTMLInputElement | null>(null);

	const handleCrop = (croppedImageData: string) => {
		setCroppedImage(croppedImageData);
		setCroppedValue(croppedImageData);
	};

	const openFileDialog = () => {
		inputRef.current?.click();
		setUploadedImage(null);
	};

	const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file) {
			setCroppedImage(null);
			const reader = new FileReader();
			reader.onloadend = () => {
				setUploadedImage(reader.result as string);
				setCroppedValue(reader.result);
			};
			reader.readAsDataURL(file);
		}
	};

	return (
		<>
			<div className="flex items-center gap-2 pb-1 -mt-3">
				<span className="font-mono font-light text-xl">*</span>
				<span className="font-light">Completely Optional</span>
			</div>
			<FormLabel>Profile Picture</FormLabel>
			<div className="flex flex-col items-center justify-center gap-2 w-full">
				<FormField
					control={control}
					name="imageUrl"
					render={({ field }) => (
						<FormItem>
							<FormControl>
								<Input
									{...field}
									type="file"
									className="hidden"
									ref={(e) => {
										inputRef.current = e;
									}}
									onChange={handleFileUpload}
								/>
							</FormControl>
						</FormItem>
					)}
				/>
				{croppedImage ? (
					<Image
						src={croppedImage}
						alt="Cropped"
						width={70}
						height={70}
						className="size-16 object-cover rounded-full bg-gray-400"
					/>
				) : uploadedImage ? (
					<>
						<ImageCropper imageSrc={uploadedImage} onCropComplete={handleCrop} />
						<Image
							src={uploadedImage}
							width={70}
							height={70}
							alt="User profile"
							className="size-[70px] object-cover rounded-full bg-gray-400"
						/>
					</>
				) : (
					<Image
						src={userImage}
						width={70}
						height={70}
						alt="User profile"
						className="size-[70px] object-cover rounded-full bg-gray-400"
					/>
				)}
				<button
					type="button"
					onClick={openFileDialog}
					className="text-slate-700 bg-white text-xs p-1 rounded-md"
				>
					Upload Picture
				</button>
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

const ThankYouScreen: React.FC = () => {
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
