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
import Image from "next/image";

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
	const oauthProvider = session?.user?.oauthProvider;
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
	}, [userDetail, isUserLoading, setValue]);

	useEffect(() => {
		if (publicId) {
			setValue("imageUrl", publicId);
		}
	}, [publicId, setValue]);

	const isFullUrl = (url: string) =>
		url.startsWith("http://") || url.startsWith("https://");

	return (
		<div className="flex flex-col gap-2 pb-1">
			<FormLabel>Profile Picture</FormLabel>
			<div className="w-full border h-[70px] border-dashed rounded-lg p-2 flex justify-center items-center border-gray-400 bg-sky-50">
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
							{/* loading google profile image */}
							{oauthProvider &&
							userDetail &&
							userDetail.length > 0 &&
							userDetail[0].imageUrl &&
							isFullUrl(userDetail[0].imageUrl as string) ? (
								<>
									<Image
										src={userDetail[0].imageUrl as string}
										alt="oauth-profile"
										width={50}
										height={50}
										priority={true}
										className="rounded-lg"
										onError={(e) => {
											console.error("Image failed to load:", e);
											e.currentTarget.src =
												"@/assets/placeholder/emptyLogo.png";
										}}
									/>
									<div className="flex flex-col justify-start items-start">
										<span className="text-sm text-green-600">
											Current profile image
										</span>
										<span className="text-xs">Click to upload a new image</span>
									</div>
								</>
							) : oauthProvider || publicId ? (
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
							<Input
								{...field}
								placeholder="Your Name / Business Name"
								maxLength={32}
							/>
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
								{...field}
								rows={2}
								maxLength={64}
								placeholder="Your tagline"
								className="resize-none"
							/>
						</FormControl>
						{touchedFields.tagline && errors.tagline && <FormMessage />}
					</FormItem>
				)}
			/>
		</div>
	);
};
