"use client";

import { useEffect, useState } from "react";
import { Upload } from "lucide-react";
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { CldImage, CldUploadWidget } from "next-cloudinary";
import {
	Control,
	FieldErrors,
	UseFormSetValue,
	FieldValues,
} from "react-hook-form";
import { useSession } from "next-auth/react";
import { useFetchUserDetail } from "@/hooks/useFetchUserDetails";

interface CloudinaryUploadWidgetInfo {
	public_id: string;
}

interface CloudinaryUploadWidgetResults {
	event?: string;
	info?: string | CloudinaryUploadWidgetInfo;
}

interface UserDetailScreenProps {
	control: Control<FieldValues>;
	setValue: UseFormSetValue<FieldValues>;
	errors: FieldErrors<FieldValues>;
	touchedFields: Partial<Record<keyof FieldValues, boolean>>;
}

export const UserDetailScreen: React.FC<UserDetailScreenProps> = ({
	control,
	setValue,
	errors,
	touchedFields,
}) => {
	const { data: session } = useSession();
	const [publicId, setPublicId] = useState<string>("");

	const { userDetail, isUserLoading, fetchUserData } = useFetchUserDetail();

	useEffect(() => {
		if (session?.user) {
			fetchUserData();
		}
	}, [session, fetchUserData]);

	useEffect(() => {
		if (userDetail && !isUserLoading && userDetail.length > 0) {
			const user = userDetail[0];
			setValue("publicId", user.imageUrl);
		}
	}, [userDetail, setValue]);

	useEffect(() => {
		if (publicId) {
			setValue("imageUrl", publicId);
		}
	}, [publicId, setValue]);

	return (
		<div className="flex flex-col gap-2">
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
							{userDetail[0]?.imageUrl ? (
								<>
									<CldImage
										src={`${userDetail[0]?.imageUrl}`}
										alt="User profile"
										width={50}
										height={50}
										className="rounded-md"
									/>
									<div className="flex flex-col justify-start items-start">
										<span className="text-sm text-green-600">
											Current profile image
										</span>
										<span className="text-xs">Click to upload a new image</span>
									</div>
								</>
							) : publicId ? (
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

interface SocialLinksScreenProps {
	control: Control<FieldValues>;
}

export const SocialLinksScreen: React.FC<SocialLinksScreenProps> = ({
	control,
}) => (
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
