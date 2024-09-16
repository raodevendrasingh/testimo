"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { User } from "next-auth";
import { useSession } from "next-auth/react";
import {
	ArrowUpRight,
	ChartPie,
	ClipboardList,
	Loader,
	RefreshCcw,
	RotateCw,
	SlidersHorizontal,
} from "lucide-react";

import { FeedbackStats } from "@/lib/selectOptions";

import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import emptyLogo from "@/assets/placeholder/emptyLogo.png";
import { useFetchTestimonials } from "@/hooks/useFetchTestimonials";
import { useFetchAcceptTestimonials } from "@/hooks/useFetchAcceptTestimonials";
import { copyToClipboard } from "@/helpers/CopytoClipboard";
import { useFetchUserDetail } from "@/hooks/useFetchUserDetails";
import { ExtractDomain } from "@/helpers/ExtractDomainName";
import PulseRingLoader from "@/components/ui/PulseRingLoader";
import { ProfileSkeleton } from "@/components/ProfileSkeleton";
import { OnboardingModal } from "@/components/OnboardingModal";

const ProfilePage = () => {
	const { data: session } = useSession();
	const [profileUrl, setProfileUrl] = useState<string>("");
	const [username, setUsername] = useState<string>("");
	const [showLoginMessage, setShowLoginMessage] = useState(false);
	const [isFetchingUser, setIsFetchingUser] = useState(true);
	const [showOnboardingModal, setShowOnboardingModal] =
		useState<boolean>(false);
	const [isInitialFetch, setIsInitialFetch] = useState(true);

	const [refresh, setRefresh] = useState(false);

	const handleRefresh = () => {
		setRefresh(!refresh);
	};

	const user = session?.user as User;

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
		fetchUserData();
		fetchTestimonials();
		fetchAcceptTestimonial();
	}, [session, fetchTestimonials, fetchAcceptTestimonial, fetchUserData]);

	useEffect(() => {
		if (session?.user && isInitialFetch) {
			fetchUserData().then(() => {
				setIsInitialFetch(false);
			});
		}
	}, [session, fetchUserData, isInitialFetch]);

	useEffect(() => {
		if (!isInitialFetch && userDetail && userDetail.length > 0) {
			if (userDetail[0].isOnboarded === false) {
				setShowOnboardingModal(true);
			}
			setUsername(userDetail[0].username || "");
		}
	}, [userDetail, isInitialFetch]);

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
			<div className="w-full h-[80vh] flex justify-center items-center gap-3 p-3 z-50">
				<PulseRingLoader />
			</div>
		);
	}

	if (showLoginMessage) {
		return (
			<div className="flex items-center justify-center h-[80vh] w-full gap-3 p-3">
				<a href="/dashboard">
					<Button
						className="flex items-center justify-center gap-2"
						variant="outline"
					>
						<span className="text-base font-medium">Reload</span>
						<RotateCw className="size-4" />
					</Button>
				</a>
			</div>
		);
	}

	return (
		<div className="w-full mx-auto">
			{showOnboardingModal && (
				<OnboardingModal
					setShowOnboardingModal={setShowOnboardingModal}
					onSave={handleRefresh}
				/>
			)}
			<div className="max-w-5xl mx-auto mt-4 px-3">
				{/* Profile Header */}
				<section className="flex flex-col sm:flex-row justify-between border rounded-xl gap-2 items-center  p-3 ">
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
													<Image
														src={userDetail[0].imageUrl as string}
														alt="user-profile"
														width={120}
														height={120}
														priority={true}
														className="rounded-lg"
														onError={(e) => {
															console.error("Image failed to load:", e);
															e.currentTarget.src =
																"@/assets/placeholder/emptyLogo.png";
														}}
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
																+ Website
															</span>
														)}
													</div>
												</Link>
											</div>
										</div>
									</div>
								</div>
							)
						)}
					</div>
				</section>

				{/* Controls */}
				<section className="py-6 px-4 my-5 bg-white rounded-xl shadow-sm border border-gray-200">
					<div className="flex items-start mb-4">
						<div className="flex items-center gap-2">
							<SlidersHorizontal className="w-5 h-5 text-gray-700" />
							<h2 className="text-lg font-semibold text-gray-800">Controls</h2>
						</div>
					</div>
					<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
						<div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
							<div>
								<p className="text-sm font-medium text-gray-700">
									Accept Testimonials
								</p>
								<p className="text-xs text-gray-500">
									Allow others to leave feedback
								</p>
							</div>
							<Switch
								checked={isAcceptingTestimonials}
								onCheckedChange={handleSwitchChange}
								disabled={isSwitchLoading}
								className="data-[state=checked]:bg-blue-600"
							/>
						</div>
						<Button
							onClick={(e) => {
								e.preventDefault();
								fetchTestimonials(true);
							}}
							variant="outline"
							className="flex items-center justify-between p-3 h-auto"
						>
							<div className="flex flex-col items-start">
								<p className="text-sm font-medium text-gray-700">
									Refresh Data
								</p>
								<p className="text-xs text-gray-500">Update testimonials</p>
							</div>
							{isLoading ? (
								<Loader className="w-4 h-4 text-gray-600 animate-spin" />
							) : (
								<RefreshCcw className="w-4 h-4 text-gray-600" />
							)}
						</Button>
						<Button
							onClick={() => copyToClipboard(profileUrl)}
							variant="outline"
							className="flex items-center justify-between p-3 h-auto"
						>
							<div className="flex flex-col items-start">
								<p className="text-sm font-medium text-gray-700">
									Share Profile
								</p>
								<p className="text-xs text-gray-500 truncate max-w-[180px]">
									{profileUrl}
								</p>
							</div>
							<ClipboardList className="w-4 h-4 text-gray-600 flex-shrink-0" />
						</Button>
					</div>
				</section>

				{/* Stats Section */}
				<div className="bg-white rounded-xl border p-6">
					<h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
						<ChartPie className="size-5 text-gray-600" />
						Stats
					</h2>
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
						{FeedbackStats.map((stat, index) => (
							<div key={index} className="bg-gray-50 p-4 rounded-lg">
								<div className="flex items-center justify-between mb-2">
									<stat.icon className={`size-8 ${stat.iconColor}`} />
									<span className="text-2xl font-bold text-gray-800">
										{stat.value}
									</span>
								</div>
								<h3 className="text-sm font-medium text-gray-600">
									{stat.title}
								</h3>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
};

export default ProfilePage;
