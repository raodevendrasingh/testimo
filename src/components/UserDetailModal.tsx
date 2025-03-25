"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { AnimatePresence, motion } from "framer-motion";
import {
	Control,
	FieldErrors,
	FieldValues,
	useForm,
	UseFormSetValue,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { userDetailSchema } from "@/schemas/userDetailSchema";
import { ArrowLeft, ArrowRight, Loader, X } from "lucide-react";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { User } from "next-auth";
import { UserDetailScreen } from "./UserProfileForm";
import { useFetchUserDetail } from "@/hooks/useFetchUserDetails";

interface FormValues {
	name: string;
	imageUrl?: string;
	tagline: string;
	companysite?: string;
	socials: {
		linkedin?: string;
		twitter?: string;
		instagram?: string;
	};
}

const screens = ["Update Details", "Add Social Links"];

interface UserDetailModalProps {
	onSave: () => void;
	setShowUserDetailModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export const UserDetailModal: React.FC<UserDetailModalProps> = ({
	setShowUserDetailModal,
	onSave,
}) => {
	const { data: session } = useSession();
	const [currentScreen, setCurrentScreen] = useState(0);
	const [slideDirection, setSlideDirection] = useState(0);
	const [isLoading, setIsLoading] = useState(false);

	const { userDetail, isUserLoading, fetchUserData } = useFetchUserDetail();

	const form = useForm<FormValues>({
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

	useEffect(() => {
		if (session?.user) {
			fetchUserData();
		}
	}, [session, fetchUserData]);

	useEffect(() => {
		if (userDetail && !isUserLoading && userDetail.length > 0) {
			const user = userDetail[0] as {
				name?: string;
				imageUrl?: string;
				tagline?: string;
				companysite?: string;
				socials?: {
					linkedin?: string;
					twitter?: string;
					instagram?: string;
				};
			};
			form.reset({
				name: user.name ?? "",
				imageUrl: user.imageUrl,
				tagline: user.tagline ?? "",
				companysite: user.companysite,
				socials: {
					linkedin: user.socials?.linkedin,
					twitter: user.socials?.twitter,
					instagram: user.socials?.instagram,
				},
			});
		}
	}, [userDetail, isUserLoading, form]);

	const {
		control,
		handleSubmit,
		formState: { errors, isValid, touchedFields },
		watch,
		setValue,
	} = form;

	const name = watch("name");
	const tagline = watch("tagline");

	const isFirstScreenValid = name.length >= 3 && tagline.length >= 5;

	const user = session?.user as User | undefined;
	const username = user?.username;

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
		const formData = { ...data, username: username };

		try {
			const response = await axios.post("/api/add-user-details", formData);
			toast.success(response.data.message);
			setShowUserDetailModal(false);
			onSave();
		} catch (error) {
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
				className="bg-slate-900/20 backdrop-blur-sm fixed inset-0 z-50 grid place-items-center overflow-y-scroll cursor-pointer"
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
								className="ml-auto border-0 text-black float-right text-3xl leading-none font-semibold outline-hidden focus:outline-hidden"
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
