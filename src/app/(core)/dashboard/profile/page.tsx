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
				<div className="max-w-5xl h-[calc(100vh-58px)] mx-auto p-3 w-full lg:pr-16 border-r overflow-y-auto scroll-smooth">
					{/* Profile Header */}
					<div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl p-6 mb-6">
						<div className="flex flex-col sm:flex-row items-center gap-4">
							<div className="relative">
								{userDetail[0]?.imageUrl ? (
									<CldImage
										src={userDetail[0].imageUrl as string}
										alt="user-profile"
										width={100}
										height={100}
										className="rounded-full border-2 border-white"
									/>
								) : (
									<Image
										src={emptyLogo}
										alt="placeholder-image"
										width={100}
										height={100}
										className="rounded-full border-2 border-white"
									/>
								)}
								<button
									onClick={() => setShowUserDetailModal(true)}
									className="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow-md hover:bg-gray-100 transition"
								>
									<UserRoundCog className="size-4 text-gray-700" />
								</button>
							</div>
							<div className="text-center sm:text-left flex-grow">
								<h1 className="text-2xl font-bold text-white mb-1">
									{userDetail[0]?.name ||
										userDetail[0]?.username ||
										userDetail[0]?.email ||
										user.username}
								</h1>
								<p className="text-indigo-100 text-sm mb-3">
									{userDetail[0]?.tagline ||
										"Software Engineer by day, Indie Hacker by night"}
								</p>
								<div className="flex flex-wrap justify-center sm:justify-start gap-2">
									{userDetail[0]?.companysite && (
										<Link
											href={userDetail[0].companysite}
											target="_blank"
											rel="noopener noreferrer"
											className="bg-white text-indigo-600 px-3 py-1 rounded-full text-xs font-medium hover:bg-indigo-50 transition"
										>
											{ExtractDomain(userDetail[0].companysite)}
											<ArrowUpRight className="inline-block ml-1 size-3" />
										</Link>
									)}
									{["linkedin", "twitter", "instagram"].map((platform) => {
										const value = (userDetail[0]?.socials as any)?.[platform];
										if (!value) return null;
										return (
											<Link
												key={platform}
												href={value}
												target="_blank"
												rel="noopener noreferrer"
												className="bg-white text-indigo-600 px-3 py-1 rounded-full text-xs font-medium hover:bg-indigo-50 transition"
											>
												{capitalize(platform)}
												<ArrowUpRight className="inline-block ml-1 size-3" />
											</Link>
										);
									})}
								</div>
							</div>
						</div>
					</div>

					{/* Controls */}
					<section className="py-6 px-4 my-5 bg-white rounded-xl shadow-sm border border-gray-200">
						<div className="flex items-start mb-4">
							<div className="flex items-center gap-2">
								<SlidersHorizontal className="w-5 h-5 text-gray-700" />
								<h2 className="text-lg font-semibold text-gray-800">
									Controls
								</h2>
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
				{showUserDetailModal && (
					<UserDetailModal
						setShowUserDetailModal={setShowUserDetailModal}
						onSave={handleRefresh}
					/>
				)}
			</div>
		</div>
	);
};

export default ProfilePage;
