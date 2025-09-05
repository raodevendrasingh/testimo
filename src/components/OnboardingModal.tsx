"use client";

import iconLogo from "@/assets/brand/testimo_icon_dark.png";
import { UserDetailScreen } from "@/components/UserProfileForm";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { uploadToCloudinary } from "@/lib/UploadToCloudinary";
import { userDetailSchema } from "@/schemas/userDetailSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Loader } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useState } from "react";
import {
	type Control,
	type FieldErrors,
	type FieldValues,
	type UseFormSetValue,
	useForm,
} from "react-hook-form";
import { toast } from "sonner";
import { useLocalStorage, useReadLocalStorage } from "usehooks-ts";
import { UsernameScreen } from "./UsernameScreen";

interface FormValues {
	username: string;
	name: string;
	imageUrl?: string | undefined;
	tagline?: string | undefined;
}

const screens = [
	"Claim your username to get started",
	"We need a few details to finish creating your account. You can always change this later.",
];

interface UserOnboardingModalProps {
	onSave: () => void;
	setShowOnboardingModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export const OnboardingModal: React.FC<UserOnboardingModalProps> = ({
	onSave,
	setShowOnboardingModal,
}) => {
	const [currentScreen, setCurrentScreen] = useState(0);
	const [slideDirection, setSlideDirection] = useState(0);
	const [isLoading, setIsLoading] = useState(false);
	const croppedImage = useReadLocalStorage<string | ArrayBuffer | null>("croppedImage");
	const [, , removeCroppedValue] = useLocalStorage<string>("croppedImage", "null");

	const { data: session } = useSession();

	const form = useForm<FormValues>({
		resolver: zodResolver(userDetailSchema),
		defaultValues: {
			username: "",
			name: "",
			imageUrl: "",
			tagline: "",
		},
		mode: "onChange",
	});

	const {
		control,
		handleSubmit,
		formState: { errors, touchedFields },
		watch,
		setValue,
		getValues,
	} = form;

	if (!session) {
		return null;
	}

	const username = watch("username");
	const name = watch("name");
	const tagline = watch("tagline");

	const isFirstScreenValid = username.length >= 4 && username.length <= 16;
	const isSecondScreenValid = name.length >= 2 && (tagline?.length ?? 0) >= 4;

	const handleNext = (e: React.MouseEvent) => {
		e.preventDefault();
		if (isFirstScreenValid) {
			setSlideDirection(1);
			setCurrentScreen((prev) => prev + 1);
		}
	};

	const renderScreen = () => {
		switch (currentScreen) {
			case 0:
				return <UsernameScreen control={control as unknown as Control<FieldValues>} />;
			case 1:
				return (
					<UserDetailScreen
						setValue={setValue as unknown as UseFormSetValue<FieldValues>}
						control={control as unknown as Control<FieldValues>}
						errors={errors as FieldErrors<FieldValues>}
						touchedFields={touchedFields as Partial<Record<string, boolean>>}
					/>
				);
			default:
				return null;
		}
	};

	const onSubmit = async (data: FormValues) => {
		setIsLoading(true);

		try {
			let cloudinaryImageUrl = "";
			if (croppedImage) {
				cloudinaryImageUrl = await uploadToCloudinary(croppedImage as string);
			}

			const formData = {
				...data,
				imageUrl: cloudinaryImageUrl,
				username: getValues("username"),
			};
			const response = await axios.post("/api/onboard-user", formData);
			toast.success(response.data.message);
			onSave();
			setShowOnboardingModal(false);
		} catch (error) {
			console.error(error);
			toast.error("Error updating user details");
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
				className="bg-slate-900/20 backdrop-blur-sm fixed inset-0 z-50 grid place-items-center overflow-y-scroll cursor-pointer"
			>
				<motion.div
					initial={{ scale: 0.9, rotate: "0deg" }}
					animate={{ scale: 1, rotate: "0deg" }}
					exit={{ scale: 0, rotate: "0deg" }}
					onClick={(e) => e.stopPropagation()}
					className="bg-white h-[500px] rounded-2xl sm:mx-auto w-full max-w-sm shadow-xl cursor-default relative overflow-hidden"
				>
					<div className="relative z-10">
						<div className="flex flex-col items-center justify-center select-none rounded-t p-3 pb-1">
							{currentScreen === 0 ? (
								<div className="flex flex-col items-center justify-center pt-5">
									<Image src={iconLogo} alt="Testimo" width={60} height={60} />
									<h1 className="text-2xl font-semibold text-gray-800 mt-1">Welcome to Testimo</h1>
								</div>
							) : (
								<div className="" />
							)}
							<h3 className="text-center text-sm font-normal text-gray-800 pt-5 px-5">
								{screens[currentScreen]}
							</h3>
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
										className={clsx({
											"h-[216px]": currentScreen === 0,
											"h-[310px]": currentScreen === 1,
										})}
									>
										<div className="p-3">
											<div className="flex flex-col gap-3">{renderScreen()}</div>
										</div>
									</motion.div>

									<div className="flex justify-end select-none p-3 w-full">
										{currentScreen < screens.length - 1 ? (
											<Button
												type="button"
												onClick={handleNext}
												disabled={!isFirstScreenValid}
												className="flex w-full justify-center items-center gap-2 text-sm"
											>
												Next <ArrowRight className=" size-4" />
											</Button>
										) : (
											<Button
												type="submit"
												disabled={isLoading || !isSecondScreenValid}
												className="flex w-full justify-center items-center gap-2 text-sm"
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
