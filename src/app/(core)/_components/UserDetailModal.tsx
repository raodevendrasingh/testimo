"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { AnimatePresence, motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { userDetailSchema } from "@/schemas/userDetailSchema";
import { ArrowLeft, ArrowRight, Loader, Upload, X } from "lucide-react";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CldImage, CldUploadWidget } from "next-cloudinary";
import { useSession } from "next-auth/react";
import { User } from "next-auth";

const screens = ["Update Details", "Add Social Links"];

export const UserDetailModal: React.FC<{
	onSave: () => void;
	setShowUserDetailModal: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ setShowUserDetailModal, onSave }) => {
    const { data: session } = useSession();
	const [currentScreen, setCurrentScreen] = useState(0);
	const [slideDirection, setSlideDirection] = useState(0);
	const [isLoading, setIsLoading] = useState(false);

	const form = useForm({
		resolver: zodResolver(userDetailSchema),
		defaultValues: {
			name: "",
			imageUrl: undefined,
			tagline: "",
			companysite: undefined,
			socials: {
				linkedin: undefined,
				twitter: undefined,
				instagram: undefined,
			},
		},
		mode: "onChange",
	});

	const {
		control,
		handleSubmit,
		formState: { errors, isValid, touchedFields },
		watch,
		trigger,
		setValue,
	} = form;

	const name = watch("name");
	const tagline = watch("tagline");

	const isFirstScreenValid = name.length >= 3 && tagline.length >= 5;

    const user = session?.user as User;
	const username = user?.username;
    // console.log(username);

	const handleNext = (e: React.MouseEvent) => {
		e.preventDefault();
		if (isFirstScreenValid) {
			setSlideDirection(1);
			setCurrentScreen((prev) => prev + 1);
		}
	};

	const handlePrevious = (e: React.MouseEvent) => {
		e.preventDefault();
		setSlideDirection(-1);
		setCurrentScreen((prev) => prev - 1);
	};

	const renderScreen = () => {
		switch (currentScreen) {
			case 0:
				return (
					<UserDetailScreen
						setValue={setValue}
						control={control}
						errors={errors}
						touchedFields={touchedFields}
					/>
				);
			case 1:
				return <SocialLinksScreen control={control} />;
			default:
				return null;
		}
	};

	const onSubmit = async (data: any) => {
		setIsLoading(true);
		const formData = { ...data, username:username}
        console.log(formData);

		try {
			const response = await axios.post("/api/add-user-details", formData);
			console.log("API Response:", response.data);
			toast.success(response.data.message);
			onSave();
		} catch (error) {
			console.error("API Error:", error);
			if (axios.isAxiosError(error) && error.response?.status === 404) {
				toast.error("Error: API endpoint not found (404)");
			} else {
				toast.error("Error updating user details");
			}
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<AnimatePresence>
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0 }}
				className="bg-slate-900/20 backdrop-blur fixed inset-0 z-50 grid place-items-center overflow-y-scroll cursor-pointer"
			>
				<motion.div
					initial={{ scale: 0.9, rotate: "0deg" }}
					animate={{ scale: 1, rotate: "0deg" }}
					exit={{ scale: 0, rotate: "0deg" }}
					onClick={(e) => e.stopPropagation()}
					className="bg-white rounded-2xl sm:mx-auto w-full max-w-[350px] xs:max-w-md sm:max-w-lg shadow-xl cursor-default relative overflow-hidden"
				>
					<div className="relative z-10">
						<div className="flex items-start justify-between rounded-t border-b p-3 pb-1">
							<h3 className="text-xl font-semibold text-gray-800 mt-1 pl-3">
								{screens[currentScreen]}
							</h3>
							<button
								className="ml-auto border-0 text-black float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
								onClick={() => setShowUserDetailModal(false)}
							>
								<span className="bg-transparent text-gray-800">
									<X className="size-9 hover:bg-gray-100 rounded-full p-2" />
								</span>
							</button>
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

									<div className="flex justify-between mt-4 p-3">
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
												disabled={isLoading || !isFirstScreenValid}
												className="flex w-28 justify-center items- gap-2 text-sm hover:bg-zinc-900 transition-colors ml-auto"
											>
												{isLoading ? (
													<>
														<span>Saving</span>
														<Loader className="size-4 animate-spin " />
													</>
												) : (
													"Save"
												)}
											</Button>
										)}
									</div>
								</form>
							</Form>
						</div>
					</div>
				</motion.div>
			</motion.div>
		</AnimatePresence>
	);
};

interface CloudinaryUploadWidgetInfo {
	public_id: string;
}

interface CloudinaryUploadWidgetResults {
	event?: string;
	info?: string | CloudinaryUploadWidgetInfo;
}

const UserDetailScreen: React.FC<{
	control: any;
	setValue: any;
	errors: any;
	touchedFields: any;
}> = ({ control, setValue, errors, touchedFields }) => {
	const [publicId, setPublicId] = useState<string>("");

	useEffect(() => {
		if (publicId) {
			setValue("imageUrl", publicId);
		}
	}, [publicId, setValue]);

	return (
		<div className="flex flex-col gap-2">
			<FormLabel>Profile Picture</FormLabel>
			<div className="w-full border h-24 border-dashed rounded-lg p-2 flex justify-center items-center border-gray-400 bg-gray-50">
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
							onClick={() => open()}
							className="flex justify-center hover:bg-sky-50 items-center text-gray-600 gap-3 p-8 w-full"
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
						<FormLabel>Name</FormLabel>
						<FormControl>
							<Input placeholder="Your Name" {...field} />
						</FormControl>
						{touchedFields.name && errors.name && <FormMessage />}
					</FormItem>
				)}
			/>
			<FormField
				control={control}
				name="tagline"
				render={({ field }) => (
					<FormItem>
						<FormLabel>Tagline</FormLabel>
						<FormControl>
							<Textarea
								placeholder="Your tagline"
								className="resize-none"
								{...field}
							/>
						</FormControl>
						{touchedFields.tagline && errors.tagline && <FormMessage />}
					</FormItem>
				)}
			/>
		</div>
	);
};

const SocialLinksScreen: React.FC<{
	control: any;
}> = ({ control }) => (
	<>
		<FormField
			control={control}
			name="companysite"
			render={({ field }) => (
				<FormItem>
					<FormLabel>Company / Portfolio Site</FormLabel>
					<FormControl>
						<Input placeholder="https://yoursite.com" {...field} />
					</FormControl>
					<FormMessage />
				</FormItem>
			)}
		/>

		<div className="space-y-4">
			{["linkedin", "twitter", "instagram"].map((siteName) => (
				<FormField
					key={siteName}
					control={control}
					name={`socials.${siteName}`}
					render={({ field }) => (
						<FormItem>
							<FormLabel htmlFor={siteName}>
								{siteName.charAt(0).toUpperCase() + siteName.slice(1)}
							</FormLabel>
							<FormControl>
								<Input
									placeholder={`https://${siteName}.com/yourusername`}
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
			))}
		</div>
	</>
);
