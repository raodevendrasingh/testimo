"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { User } from "next-auth";
import { useSession } from "next-auth/react";
import { CldImage } from "next-cloudinary";
import {
	ArrowUpRight,
	BookOpenCheck,
	ChartPie,
	CirclePercent,
	ClipboardList,
	Clock,
	Cog,
	Coins,
	Copy,
	Loader,
	LucideIcon,
	MessageSquareQuote,
	RefreshCcw,
	RotateCw,
	Settings,
	SlidersHorizontal,
	Star,
	UserRoundCog,
} from "lucide-react";

type Stats = {
	icon: LucideIcon;
	iconColor: string;
	title: string;
	value: number;
};

const FeedbackStats: Stats[] = [
	{
		icon: Coins,
		iconColor: "text-orange-400",
		title: "Credits Remaining",
		value: 8,
	},
	{
		icon: MessageSquareQuote,
		iconColor: "text-indigo-400",
		title: "Testimonials Recieved",
		value: 2,
	},
	{
		icon: Star,
		iconColor: "text-yellow-400",
		title: "Average Rating",
		value: 4.5,
	},
	{
		icon: Clock,
		iconColor: "text-blue-500",
		title: "Most Recent Testimonial",
		value: 2,
	},
];

import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import emptyLogo from "@/assets/placeholder/emptyLogo.png";

import { useFetchTestimonials } from "@/hooks/useFetchTestimonials";
import { useFetchAcceptTestimonials } from "@/hooks/useFetchAcceptTestimonials";
import { copyToClipboard } from "@/helpers/CopytoClipboard";
import { UserDetailModal } from "../../_components/UserDetailModal";
import { useFetchUserDetail } from "@/hooks/useFetchUserDetails";
import { ExtractDomain } from "@/helpers/ExtractDomainName";
import { capitalize } from "@/helpers/CapitalizeFirstChar";
import { Separator } from "@/components/ui/separator";
import { ProfileSkeleton } from "@/components/ProfileSkeleton";
import PulseRingLoader from "@/components/ui/PulseRingLoader";

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

	const { testimonial, isLoading, fetchTestimonials } = useFetchTestimonials();
	const {
		isAcceptingTestimonials,
		isSwitchLoading,
		fetchAcceptTestimonial,
		handleSwitchChange,
	} = useFetchAcceptTestimonials();

	const { userDetail, isUserLoading, fetchUserData } = useFetchUserDetail();

	useEffect(() => {
		if (!session || !session.user) return;
		fetchTestimonials();
		fetchAcceptTestimonial();
	}, [session, fetchTestimonials, fetchAcceptTestimonial]);

	useEffect(() => {
		if (session?.user) {
			fetchUserData();
		}
	}, [session, fetchUserData]);

	useEffect(() => {
		const baseUrl = `${window.location.protocol}//${window.location.host}`;
		setProfileUrl(`${baseUrl}/i/${username}`);
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
			<div className="w-full h-[calc(100vh-58px)] pl-44 flex justify-center items-center gap-3 p-3 z-50">
				<PulseRingLoader />
			</div>
		);
	}

	if (showLoginMessage) {
		return (
			<div className="flex items-center justify-center pl-44 h-[calc(100vh-58px)] w-full gap-3 p-3">
				<a href="/dashboard">
					<Button
						className="flex items-center justify-center gap-2"
						variant="outline"
					>
						<RotateCw className="size-5" />
						<span className="text-base font-medium">Reload</span>
					</Button>
				</a>
			</div>
		);
	}

	return (
		<div className="w-full mx-auto scrollbar-hide">
			<div className="max-w-6xl mx-auto lg:ml-72 w-full">
				<div className="flex flex-col  max-w-5xl h-[calc(100vh-58px)] mx-auto p-3 w-full lg:pr-16 border-r">
					{/* User info and controls */}
					<section className="flex flex-col sm:flex-row justify-between gap-2 items-center sm:items-start p-2 xs:p-0 ">
						{/* user info */}
						<div className="flex flex-col items-center gap-2 p-2 w-full py-10 md:pt-3 md:pb-5">
							{isUserLoading ? (
								<ProfileSkeleton />
							) : (
								userDetail.length > 0 && (
									<div className="flex flex-col sm:flex-row items-center justify-between gap-3 w-full ">
										<div className="flex flex-col sm:flex-row items-center justify-center w-[80%] sm:justify-start gap-3 sm:gap-5 ">
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
																setShowUserDetailModal={setShowUserDetailModal}
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
										<div className="flex flex-row sm:flex-col items-center justify-center sm:justify-start w-[20%] gap-2 ">
											<div className="flex flex-row sm:flex-col gap-2">
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
																	<div className="flex justify-start items-center gap-1 px-3 py-1.5 rounded-full border bg-white">
																		<span className="text-sm font-medium text-gray-600 w-4/5">
																			{capitalize(
																				ExtractDomain(value as string).replace(
																					".com",
																					""
																				)
																			)}
																		</span>
																		<span className="w-1/5">
																			<ArrowUpRight className="size-4 text-gray-700" />
																		</span>
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
					</section>
					<hr />

					{/* fetch controls */}
					<section className="flex flex-col justify-start py-5">
						<div className="">
							<div className="flex justify-start items-center gap-2 p-2">
								<SlidersHorizontal className="size-5 text-gray-600" />
								<span className="text-lg font-medium text-gray-700 select-none">
									Controls
								</span>
							</div>
						</div>
						<div className="flex flex-row w-full gap-3 p-3">
							<Button
								variant="outline"
								className="flex w-1/3 sm:w-auto items-center justify-evenly gap-2"
							>
								<span
									className={`text-sm font-medium hidden sm:inline-block ${
										isAcceptingTestimonials ? "text-green-500" : "text-rose-600"
									}`}
								>
									Testimonial
								</span>
								<Switch
									checked={isAcceptingTestimonials}
									onCheckedChange={handleSwitchChange}
									disabled={isSwitchLoading}
								/>
							</Button>
							<Button
								className="flex w-1/3 sm:w-auto items-center justify-evenly gap-2"
								variant="outline"
								onClick={(e) => {
									e.preventDefault();
									fetchTestimonials(true);
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
								className="flex w-1/3 sm:w-auto items-center justify-evenly gap-2"
								variant="outline"
							>
								<span className="font-medium text-sm hidden sm:inline-block">
									{profileUrl}
								</span>
								<ClipboardList className="size-4 text-gray-600" />
							</Button>
						</div>
					</section>
					<hr />

					{/* stats */}
					<section className="flex flex-col justify-start py-5">
						<div className="">
							<div className="flex justify-start items-center gap-2 p-2">
								<ChartPie className="size-5 text-gray-600" />
								<span className="text-lg font-medium text-gray-700 select-none">
									Stats
								</span>
							</div>
						</div>
						<div className="flex flex-wrap w-full gap-6 p-3">
							{FeedbackStats.map((stat, key) => (
								<div
									key={key}
									className="flex justify-between items-center w-full bg-white gap-3 rounded-lg px-3 h-20 xs:w-52 border transition duration-150 cursor-pointer"
								>
									<span className="w-[10%]">
										<stat.icon className={`size-8 ${stat.iconColor}`} />
									</span>
									<span className="w-[65%] text-sm font-medium text-start pl-3 overflow-hidden text-zinc-800">
										{stat.title}
									</span>
									<span className="w-[25%] text-3xl font-semibold text-center">
										{stat.value}
									</span>
								</div>
							))}
						</div>
					</section>
					<hr />
				</div>
			</div>
		</div>
	);
};

export default ProfilePage;
