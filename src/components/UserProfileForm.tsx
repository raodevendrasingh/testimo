"use client";

import { useEffect, useRef, useState } from "react";
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
import {
	Control,
	FieldErrors,
	UseFormSetValue,
	FieldValues,
} from "react-hook-form";
import { useSession } from "next-auth/react";
import { useFetchUserDetail } from "@/hooks/useFetchUserDetails";
import Image from "next/image";
import { useLocalStorage } from "usehooks-ts";
import { ImageCropper } from "./ImageCropper";
import emptyUser from "@/assets/placeholder/emptyUser.png";

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

	const [value, setCroppedValue, removeValue] = useLocalStorage<
		string | ArrayBuffer | null
	>("croppedImage", "");
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

	const { userDetail, fetchUserData } = useFetchUserDetail();

	useEffect(() => {
		if (session?.user) {
			fetchUserData();
		}
	}, [session, fetchUserData]);

	return (
		<div className="flex flex-col gap-2 w-full">
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
						<ImageCropper
							imageSrc={uploadedImage}
							onCropComplete={handleCrop}
						/>
						<Image
							src={uploadedImage}
							width={70}
							height={70}
							alt="User profile"
							className="size-[70px] object-cover rounded-full bg-gray-400"
						/>
					</>
				) : userDetail && userDetail.length > 0 && userDetail[0].imageUrl ? (
					<Image
						src={userDetail[0].imageUrl as string}
						width={70}
						height={70}
						alt="User profile"
						className="size-[70px] object-cover rounded-full bg-gray-400"
					/>
				) : (
					<Image
						src={emptyUser}
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
