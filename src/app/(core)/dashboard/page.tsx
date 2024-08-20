"use client";

import { User } from "next-auth";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import emptyLogo from "@/assets/placeholder/emptyLogo.png";
import { Switch } from "@/components/ui/switch";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, Copy, Loader, RefreshCcw } from "lucide-react";
import { Chip } from "@/app/(core)/_components/Chips";
import { useFetchFeedback } from "@/hooks/useFetchFeedback";
import { useFetchAcceptFeedback } from "@/hooks/useFetchAcceptFeedback";
import { copyToClipboard } from "@/helpers/CopytoClipboard";
import { DisplayFeedback } from "../_components/DisplayFeedback";
import { ArchivedFeedback } from "../_components/ArchivedFeedback";
import { FeedbackInsights } from "../_components/FeedbackInsights";

const tabsData = [
	{
		title: "Feedbacks",
		content: <DisplayFeedback />,
	},
	{
		title: "Archived",
		content: <ArchivedFeedback />,
	},
	{
		title: "Insights",
		content: <FeedbackInsights />,
	},
];

const DashboardPage = () => {
	const { data: session } = useSession();
	const [selected, setSelected] = useState(0);
	const [profileUrl, setProfileUrl] = useState<string>("");
	const [showLoginMessage, setShowLoginMessage] = useState(false);
	const [isFetchingUser, setIsFetchingUser] = useState(true);

	const user = session?.user as User;
	const username = user?.username;

	const { feedback, isLoading, fetchFeedback } = useFetchFeedback();
	const {
		isAcceptingFeedback,
		isSwitchLoading,
		fetchAcceptFeedback,
		handleSwitchChange,
	} = useFetchAcceptFeedback();

	useEffect(() => {
		if (!session || !session.user) return;
		fetchFeedback();
		fetchAcceptFeedback();
	}, [session, fetchFeedback, fetchAcceptFeedback]);

	useEffect(() => {
		const baseUrl = `${window.location.protocol}//${window.location.host}`;
		setProfileUrl(`${baseUrl}/g/${username}/review`);
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
			<div className="w-full h-screen flex justify-center items-center gap-3 bg-gray-50 p-3">
				<Loader className="size-4 animate-spin" />
				Fetching Session Info
			</div>
		);
	}

	if (showLoginMessage) {
		return <div className="flex items-center gap-3 p-3">Please Login</div>;
	}

	return (
		<div className="w-full min-h-screen">
			<div className="flex flex-col bg-white border-b px-5 md:px-12 lg:px-28 pt-5 ">
				{/* User info and controls */}
				<div className="flex flex-col sm:flex-row justify-between gap-2 items-center sm:items-start ">
					{/* user info */}
					<div className="flex flex-col gap-2 h-full">
						<div className="flex items-center justify-start gap-3 sm:gap-5">
							<div className="flex size-28 bg-gray-300 animate-pulse rounded-lg items-center justify-center">
								{/* <Image src={emptyLogo} alt="" width={100} priority={true} /> */}
							</div>
							<div className="flex flex-col gap-1">
								<div className="text-4xl md:text-5xl">
									{user?.username || user?.email}
								</div>
								<div className="text-base">Lorem ipsum dolor sit amet.</div>
								<Link href="#">
									<div className="flex justify-center items-center gap-2 px-3 py-1 rounded-full border bg-white">
										<span className="text-sm"> yourwebsite.com</span>
										<ArrowUpRight className="size-5 text-gray-700" />
									</div>
								</Link>
							</div>
						</div>
					</div>
					{/* fetch controls */}
					<div className="flex flex-row-reverse w-full sm:w-44 sm:flex-col gap-2">
						<div className="flex w-1/3 sm:w-auto items-center justify-around gap-2 border px-2 py-2.5 rounded-lg bg-white">
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
						</div>
						<Button
							className="flex w-1/3 items-center justify-around sm:w-auto gap-2"
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
								<Loader className="size-4 animate-spin" />
							) : (
								<RefreshCcw className="size-4" />
							)}
						</Button>
						<div className="flex w-1/3 sm:w-auto items-center justify-around border rounded-lg bg-white p-2">
							<span className="font-medium text-sm hidden sm:inline-block">
								Feedback URL
							</span>
							<button
								onClick={() => copyToClipboard(profileUrl)}
								className="p-1 rounded-lg text-sm bg-gray-100"
							>
								<Copy className="size-4 text-gray-700" />
							</button>
						</div>
					</div>
				</div>

				{/* Tabs */}
				<main className="sticky top-[64px] overflow-hidden z-10">
					<div className="px-5 py-3 flex  items-center gap-2 overflow-x-auto whitespace-nowrap scrollbar-hide">
						{tabsData.map((tab, idx) => (
							<Chip
								key={idx}
								index={idx}
								text={tab.title}
								selected={selected === idx}
								setSelected={setSelected}
							/>
						))}
					</div>
				</main>
			</div>
			{/* Tab content */}
			<main className="flex-grow mx-auto w-full">
				<div>{tabsData[selected].content}</div>
			</main>
		</div>
	);
};

export default DashboardPage;
