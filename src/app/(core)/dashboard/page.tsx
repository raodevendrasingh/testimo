"use client";

import { User } from "next-auth";
import { useSession } from "next-auth/react";
import Image from "next/image";
import emptyLogo from "@/assets/emptyLogo.png";
import { Switch } from "@/components/ui/switch";
import { useCallback, useEffect, useState } from "react";
import { Feedback } from "@/models/User";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { acceptFeedbackSchema } from "@/schemas/acceptFeedbackSchema";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { Button } from "@/components/ui/button";
import { Copy, Loader, RefreshCcw } from "lucide-react";
import { FeedbackCard } from "@/components/FeedbackCard";
import { Chip } from "@/components/Chips";

const tabsData = [
	{
		title: "Feedbacks",
		content: "Feedback",
	},
	{
		title: "Archived",
		content: "Archived",
	},
	{
		title: "Insights",
		content: "Insights",
	},
];

const DashboardPage = () => {
	const { data: session } = useSession();
	const [selected, setSelected] = useState(0);
    const [profileUrl, setProfileUrl] = useState<string>('')
	const [feedback, setFeedback] = useState<Feedback[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [isSwitchLoading, setIsSwitchLoading] = useState<boolean>(false);

	const user = session?.user as User;
	const username = user?.username;

	const form = useForm({
		resolver: zodResolver(acceptFeedbackSchema),
	});

	const { register, watch, setValue } = form;

	const acceptFeedback = watch("acceptFeedback");

	const handleDeleteFeedback = (feedbackId: string) => {
		setFeedback(feedback.filter((feedback) => feedback._id !== feedbackId));
	};

	const fetchAcceptFeedback = useCallback(async () => {
		setIsSwitchLoading(true);
		try {
			const response = await axios.get<ApiResponse>("/api/accept-feedback");
			setValue("acceptFeedback", response.data.isAcceptingFeedback);
		} catch (error) {
			const axiosError = error as AxiosError<ApiResponse>;
			toast.error("Error", {
				description:
					axiosError.response?.data.message ||
					"Failed to fetch feedback settings",
			});
		} finally {
			setIsSwitchLoading(false);
		}
	}, [setValue]);

	const fetchFeedback = useCallback(
		async (refresh: boolean = false) => {
			setIsLoading(true);
			setIsSwitchLoading(false);
			try {
				const response = await axios.get<ApiResponse>("/api/get-feedback");
				setFeedback(response.data.feedback || []);
				if (refresh) {
					toast.success("Feedbacks Refreshed", {
						description: "Showing latest feedbacks",
					});
				}
			} catch (error) {
				const axiosError = error as AxiosError<ApiResponse>;
				toast.error("Error", {
					description:
						axiosError.response?.data.message || "Failed to fetch feedback",
				});
			} finally {
				setIsLoading(false);
				setIsSwitchLoading(false);
			}
		},
		[setIsLoading, setFeedback]
	);

	useEffect(() => {
		if (!session || !session.user) return;
		fetchFeedback();
		fetchAcceptFeedback();
	}, [session, setValue, fetchAcceptFeedback, fetchFeedback]);

	const handleSwitchChange = async () => {
		try {
			const response = await axios.post<ApiResponse>("/api/accept-feedback", {
				acceptFeedback: !acceptFeedback,
			});
			setValue("acceptFeedback", !acceptFeedback);
			toast.error(response.data.message);
		} catch (error) {
			const axiosError = error as AxiosError<ApiResponse>;
			toast.error("Error", {
				description:
					axiosError.response?.data.message || "Failed to fetch feedback",
			});
		}
	};

	// const baseUrl = `${window.location.protocol}//${window.location.host}`;
	// const profileUrl = `${baseUrl}/g/${username}`;

    useEffect(() => {
        const baseUrl = `${window.location.protocol}//${window.location.host}`;
        setProfileUrl(`${baseUrl}/g/${username}`);
      }, [username]);
    

	const copyToClipboard = () => {
		navigator.clipboard.writeText(profileUrl);
		toast.success("Profile URL copied to clipboard!");
	};

	if (!session || !session.user) {
		return <div>Please Login</div>;
	}

	return (
		<div className="w-full min-h-screen">
			<div className="flex flex-col gap-3 bg-white shadow border-b rounded-b-2xl px-5 md:px-12 lg:px-28 pt-12">
				<div className="flex justify-between items-center">
					<div className="flex items-center gap-5">
						<div>
							<Image src={emptyLogo} alt="" width={112} />
						</div>
						<div className="flex flex-col gap-2">
							<div className="text-4xl md:text-5xl">
								{user?.username || user?.email}
							</div>
							<div className="text-base">Lorem ipsum dolor sit amet.</div>
						</div>
					</div>
					<div className="flex flex-col gap-3 ">
						<div className="flex items-center gap-2 border px-2 py-2.5 rounded-lg bg-white">
							<Switch
								{...register("acceptMessages")}
								checked={acceptFeedback}
								onCheckedChange={handleSwitchChange}
								disabled={isSwitchLoading}
							/>
							<span
								className={`text-sm font-medium  ${
									acceptFeedback ? "text-green-500" : "text-rose-600"
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
							<span className="font-redium text-sm">Refresh</span>
							{isLoading ? (
								<Loader className="size-3 animate-spin" />
							) : (
								<RefreshCcw className="size-3" />
							)}
						</Button>
					</div>
				</div>
				<div className="mb-2 max-w-sm ">
					<div className="flex items-center border rounded-lg bg-gray-50 p-1.5">
						<input
							type="text"
							value={profileUrl}
							disabled
							className="w-full mr-2 px-2"
						/>
						<button
							onClick={copyToClipboard}
							className="p-1.5 border rounded-lg text-sm"
						>
							<Copy className="size-4 text-gray-600" />
						</button>
					</div>
				</div>
				<main className="sticky top-[64px] overflow-hidden z-10">
					<div className="px-4 py-3 flex justify-center items-center gap-2 overflow-x-auto whitespace-nowrap scrollbar-hide">
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
			<div className="flex flex-col max-w-7xl mx-auto bg-rose-200 w-full flex-grow">
				<div className="flex flex-col items-center gap-3">
					{feedback.length > 0 ? (
						feedback.map((message: Feedback, index: any) => (
							<FeedbackCard
								key={message._id}
								feedback={message}
								onFeedbackDelete={handleDeleteFeedback}
							/>
						))
					) : (
						<p>No Feedbacks received yet.</p>
					)}
				</div>
			</div>
		</div>
	);
};

export default DashboardPage;
