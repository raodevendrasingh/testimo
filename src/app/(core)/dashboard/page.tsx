"use client";

import { User } from "next-auth";
import { useSession } from "next-auth/react";
import Image from "next/image";
import emptyLogo from "@/assets/placeholder/emptyLogo.png";
import { Switch } from "@/components/ui/switch";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Loader, RefreshCcw } from "lucide-react";
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
		content: <ArchivedFeedback/>,
	},
	{
		title: "Insights",
		content: <FeedbackInsights/>,
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
		setProfileUrl(`${baseUrl}/g/${username}`);
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
			<div className="flex items-center gap-3 p-3">
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
			<div className="flex flex-col m-3 bg-white shadow border rounded-2xl px-5 md:px-12 lg:px-28 pt-8 ">
				{/* User info and controls */}
				<div className="flex justify-between items-start">
					{/* user info */}
					<div className="flex flex-col gap-2 h-full">
						<div className="flex items-center gap-5">
							<div className="flex">
								<Image src={emptyLogo} alt="" width={100} priority={true} />
							</div>
							<div className="flex flex-col gap-2">
								<div className="text-4xl md:text-5xl">
									{user?.username || user?.email}
								</div>
								<div className="text-base">Lorem ipsum dolor sit amet.</div>
							</div>
						</div>
						<div>
							<span> &lt;your-website&gt;</span>
						</div>
					</div>
					{/* fetch controls */}
					<div className="flex flex-col gap-3 ">
						<div className="flex items-center gap-2 border px-2 py-2.5 rounded-lg bg-white">
							<Switch
								checked={isAcceptingFeedback}
								onCheckedChange={handleSwitchChange}
								disabled={isSwitchLoading}
							/>

							<span
								className={`text-sm font-medium ${
									isAcceptingFeedback ? "text-green-500" : "text-rose-600"
								}`}
							>
								Accept Feedback
							</span>
						</div>
						<Button
							className="flex items-center justify-center gap-2"
							variant="outline"
							onClick={(e) => {
								e.preventDefault();
								fetchFeedback(true);
							}}
						>
							<span className="font-medium text-sm">Refresh</span>
							{isLoading ? (
								<Loader className="size-3 animate-spin" />
							) : (
								<RefreshCcw className="size-3" />
							)}
						</Button>
						<div className="flex items-center justify-around border rounded-lg bg-white p-2">
							<span className="font-medium text-sm">Feedback URL</span>
							<button
								onClick={() => copyToClipboard(profileUrl)}
								className="p-1.5 rounded-lg text-sm bg-gray-100"
							>
								<Copy className="size-3 text-gray-700" />
							</button>
						</div>
					</div>
				</div>

				{/* Tabs */}
				<main className="sticky top-[64px] overflow-hidden z-10">
					<div className="px-4 py-3 flex  items-center gap-2 overflow-x-auto whitespace-nowrap scrollbar-hide">
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
