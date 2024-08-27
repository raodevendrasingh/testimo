"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { User } from "next-auth";
import { useSession } from "next-auth/react";
import { CldImage } from "next-cloudinary";
import {
	ArrowUpRight,
	Copy,
	Loader,
	RefreshCcw,
	UserRoundCog,
} from "lucide-react";

import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import emptyLogo from "@/assets/placeholder/emptyLogo.png";

import { useFetchFeedback } from "@/hooks/useFetchFeedback";
import { useFetchAcceptFeedback } from "@/hooks/useFetchAcceptFeedback";
import { copyToClipboard } from "@/helpers/CopytoClipboard";
import { UserDetailModal } from "../../_components/UserDetailModal";
import { useFetchUserDetail } from "@/hooks/useFetchUserDetails";
import { ExtractDomain } from "@/helpers/ExtractDomainName";
import { capitalize } from "@/helpers/CapitalizeFirstChar";

const ProfilePage = () => {
	const { data: session } = useSession();
	const [profileUrl, setProfileUrl] = useState<string>("");
	const [showLoginMessage, setShowLoginMessage] = useState(false);
	const [isFetchingUser, setIsFetchingUser] = useState(true);
	const [showUserDetailModal, setShowUserDetailModal] =
		useState<boolean>(false);
	const [refresh, setRefresh] = useState(false);

	const handleRefresh = () => {
		setRefresh(!refresh);
	};

	const user = session?.user as User;
	const username = user?.username;

	const { feedback, isLoading, fetchFeedback } = useFetchFeedback();
	const {
		isAcceptingFeedback,
		isSwitchLoading,
		fetchAcceptFeedback,
		handleSwitchChange,
	} = useFetchAcceptFeedback();

	const { userDetail, isUserLoading, fetchUserData } = useFetchUserDetail();

	useEffect(() => {
		if (!session || !session.user) return;
		fetchFeedback();
		fetchAcceptFeedback();
	}, [session, fetchFeedback, fetchAcceptFeedback]);

	useEffect(() => {
		if (session?.user) {
			fetchUserData();
		}
	}, [session, fetchUserData]);

	useEffect(() => {
		const baseUrl = `${window.location.protocol}//${window.location.host}`;
		setProfileUrl(`${baseUrl}/i/${username}/review`);
	}, [username]);

	useEffect(() => {
		if (!session || !session.user) {
			const timer = setTimeout(() => {
				setShowLoginMessage(true);
				setIsFetchingUser(false);
			}, 10000);

			return () => clearTimeout(timer);
		} else {
			setIsFetchingUser(false);
		}
	}, [session]);

	if (isFetchingUser) {
		return (
			<div className="w-full h-[calc(100vh-58px)] flex justify-center items-center gap-3 bg-gray-50 p-3 z-50">
				<Loader className="size-4 animate-spin" />
				Fetching Session Info
			</div>
		);
	}

	if (showLoginMessage) {
		return <div className="flex items-center gap-3 p-3 font-mono">Reload</div>;
	}

	return (
		<div className="w-full mx-auto scrollbar-hide">
			<div className="max-w-6xl mx-auto lg:ml-72 w-full">
				<div className="max-w-5xl h-[calc(100vh-58px)] mx-auto p-3 w-full pr-16 border-r">
						{/* User info and controls */}
						<div className="flex flex-col sm:flex-row justify-between gap-2 items-center sm:items-start p-2 xs:p-0">
							{/* user info */}
							<div className="flex flex-col items-center gap-2 p-2">
								{isUserLoading ? (
									// loading skeleton
									<div className="flex flex-col items-center justify-center gap-3">
										<div className="flex items-center justify-start gap-4">
											<div className="size-28 bg-gray-300 animate-pulse rounded-lg" />
											<div className="flex flex-col items-start justify-start gap-4">
												<div className="h-6 w-44 bg-gray-300 animate-pulse rounded-lg" />
												<div className="h-5 w-56 bg-gray-300 animate-pulse rounded-lg" />
												<div className="flex justify-start gap-2">
													<div className="h-5 w-10 bg-gray-300 animate-pulse rounded-lg" />
													<div className="h-5 w-44 bg-gray-300 animate-pulse rounded-lg" />
												</div>
											</div>
										</div>
										<div className="flex items-center justify-start gap-2 w-full">
											<div className="w-20 h-5 bg-gray-300 animate-pulse rounded-lg" />
											<div className="w-20 h-5 bg-gray-300 animate-pulse rounded-lg" />
											<div className="w-20 h-5 bg-gray-300 animate-pulse rounded-lg" />
										</div>
									</div>
								) : (
									userDetail.length > 0 && (
										<div className="flex flex-col items-center justify-center sm:justify-start gap-3 w-full">
											<div className="flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-3 sm:gap-5">
												<div className="flex items-center justify-center">
													<div className="size-28 rounded-lg">
														{userDetail[0].imageUrl ? (
															<CldImage
																src={userDetail[0].imageUrl as string}
																alt="user-profile"
																width={120}
																height={120}
																priority={true}
																className="rounded-lg"
															/>
														) : (
															<Image
																src={emptyLogo}
																alt="placeholder-image"
																width={100}
																height={100}
																priority={true}
															/>
														)}
													</div>
												</div>
												<div className="flex flex-col items-center justify-center sm:justify-start gap-2 w-full">
													<div className="flex items-center justify-center sm:justify-start text-center text-3xl font-medium w-full">
														{userDetail[0].name ||
															userDetail[0].username ||
															userDetail[0].email ||
															user.username}
													</div>
													<div className="flex justify-center w-full sm:justify-start text-center sm:text-left">
														{userDetail[0].tagline || (
															<div className=" text-blue-500 text-sm">
																+ Add Tagline
															</div>
														)}
													</div>
													<div className="flex items-center justify-center sm:justify-start w-full gap-2">
														<div className="flex justify-center items-center">
															<button
																type="button"
																onClick={() => setShowUserDetailModal(true)}
																className="flex justify-evenly items-center px-2 py-1 gap-2 bg-white border border-gray-300 hover:bg-gray-100 rounded-lg "
															>
																<span className="text-xs font-medium text-gray-600">
																	Edit
																</span>
																<UserRoundCog className="size-3 text-gray-800" />
															</button>
															{showUserDetailModal && (
																<UserDetailModal
																	setShowUserDetailModal={
																		setShowUserDetailModal
																	}
																	onSave={handleRefresh}
																/>
															)}
														</div>

														<Link
															href={userDetail[0].companysite || "#"}
															target="_blank"
															rel="noopener noreferrer"
														>
															<div className="inline-flex justify-center items-center sm:justify-start gap-2 px-3 py-0.5 rounded-full border bg-white">
																{userDetail[0].companysite ? (
																	<>
																		<span className="text-sm">
																			{ExtractDomain(userDetail[0].companysite)}
																		</span>
																		<ArrowUpRight className="size-5 text-gray-700" />
																	</>
																) : (
																	<span className="text-blue-500 text-sm">
																		+ Add Website
																	</span>
																)}
															</div>
														</Link>
													</div>
												</div>
											</div>

											<div className="flex items-center justify-center sm:justify-start w-full gap-2">
												<div className="flex flex-wrap gap-2">
													{userDetail[0].socials &&
													Object.keys(userDetail[0].socials).some((key) =>
														["linkedin", "twitter", "instagram"].includes(key)
													) ? (
														["linkedin", "twitter", "instagram"].map(
															(platform) => {
																const value = (userDetail[0].socials as any)[
																	platform
																];
																if (!value || platform === "_id") return null;
																return (
																	<Link
																		href={value}
																		key={platform}
																		target="_blank"
																		rel="noopener noreferrer"
																	>
																		<div className="flex justify-center items-center gap-1 px-2 py-1 rounded-full border bg-white">
																			<span className="text-xs font-medium text-gray-600">
																				{capitalize(
																					ExtractDomain(
																						value as string
																					).replace(".com", "")
																				)}
																			</span>
																			<ArrowUpRight className="size-4 text-gray-700" />
																		</div>
																	</Link>
																);
															}
														)
													) : (
														<div className="flex justify-center items-center gap-2 px-3 py-1 rounded-full border bg-white">
															<span className="text-blue-500 text-sm">
																+ Add Social Links
															</span>
														</div>
													)}
												</div>
											</div>
										</div>
									)
								)}
							</div>

							{/* fetch controls */}
							<div className="flex flex-row-reverse w-full sm:w-44 sm:flex-col gap-2 mb-2 sm:mb-0">
								<Button
									variant="outline"
									className="flex w-1/3 sm:w-auto items-center justify-evenly"
								>
									<span
										className={`text-sm font-medium hidden sm:inline-block ${
											isAcceptingFeedback ? "text-green-500" : "text-rose-600"
										}`}
									>
										Feedback
									</span>
									<Switch
										checked={isAcceptingFeedback}
										onCheckedChange={handleSwitchChange}
										disabled={isSwitchLoading}
									/>
								</Button>
								<Button
									className="flex w-1/3 sm:w-auto items-center justify-evenly "
									variant="outline"
									onClick={(e) => {
										e.preventDefault();
										fetchFeedback(true);
									}}
								>
									<span className="font-medium text-sm hidden sm:inline-block">
										Refresh
									</span>
									{isLoading ? (
										<Loader className="size-4 text-gray-600 animate-spin" />
									) : (
										<RefreshCcw className="size-4 text-gray-600" />
									)}
								</Button>
								<Button
									onClick={() => copyToClipboard(profileUrl)}
									className="flex w-1/3 sm:w-auto items-center justify-evenly"
									variant="outline"
								>
									<span className="font-medium text-sm hidden sm:inline-block">
										Feedback URL
									</span>
									<Copy className="size-4 text-gray-600" />
								</Button>
							</div>
						</div>

				</div>
			</div>
		</div>
	);
};

export default ProfilePage;
