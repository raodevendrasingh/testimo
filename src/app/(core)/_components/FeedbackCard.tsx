import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import {
	Archive,
	ArrowRightFromLine,
	LucideIcon,
	PartyPopper,
	Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Feedback } from "@/models/User";
import axios from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { cn } from "@/lib/utils";
import {
	Command,
	CommandGroup,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";

import { useState } from "react";
import { timesAgo } from "@/helpers/ConvertTimeStamp";
import { useActionUpdate } from "@/hooks/useActionUpdate";
import { toast } from "sonner";
import { capitalize } from "@/helpers/CapitalizeFirstChar";
import { CldImage } from "next-cloudinary";

import emptyUser from "@/assets/placeholder/emptyUser.png";
import Image from "next/image";

type Status = {
	value: string;
	label: string;
	icon: LucideIcon;
};
const statuses: Status[] = [
	{
		value: "approved",
		label: "Approve",
		icon: PartyPopper,
	},
	{
		value: "archived",
		label: "Archive",
		icon: Archive,
	},
	{
		value: "exported",
		label: "Export",
		icon: ArrowRightFromLine,
	},
	{
		value: "discarded",
		label: "Discard",
		icon: Trash2,
	},
];

type FeedbackCardProps = {
	feedback: Feedback;
	onFeedbackDelete: (feedbackId: string) => void;
};

export const FeedbackCard = ({
	feedback,
	onFeedbackDelete,
}: FeedbackCardProps) => {
	const [open, setOpen] = useState(false);
	const [selectedStatus, setSelectedStatus] = useState<Status | null>(null);
	const [isAlertOpen, setIsAlertOpen] = useState(false);
	const { actionUpdate, loading, error } = useActionUpdate();

	const handleDeleteConfirm = async () => {
		try {
			const response = await axios.delete<ApiResponse>(
				`/api/delete-feedback/${feedback._id}`
			);
			toast.success(response.data.message);
			onFeedbackDelete(feedback._id as string);
		} catch (error) {
			toast.error("Error", {
				description: "Failed to delete message",
			});
		}
		setIsAlertOpen(false);
	};

	const handleActionSelect = async (value: string) => {
		setSelectedStatus(
			statuses.find((status) => status.value === value) || null
		);
		setOpen(false);

		if (value === "discarded") {
			setIsAlertOpen(true);
		} else {
			await actionUpdate(feedback._id as string, value);
		}
	};

	const matchingStatus = statuses.find(
		(status) => status.value === feedback.action
	);

	return (
		<>
			<div
				className={cn(
					"flex flex-col xs:flex-row items-start justify-start mx-5 p-2 gap-1 w-full rounded-md h-full",
					{
						"bg-red-50": feedback.action === "default",
						"bg-zinc-50": feedback.action !== "default",
					}
				)}
			>
				{" "}
				{/* display picture */}
				<div className="p-1 flex justify-center h-full w-full xs:w-[20%]">
					{feedback.imageUrl ? (
						<CldImage
							src={feedback.imageUrl as string}
							alt="pfp"
							width={80}
							height={80}
							className="rounded-lg"
						/>
					) : (
						<Image
							src={emptyUser}
							alt="pfp"
							width={80}
							height={80}
							className="rounded-lg"
						/>
					)}
				</div>
				<div className="flex flex-col-reverse xs:flex-row gap-2 w-full">
					{/* content */}
					<div className="flex flex-col justify-center items-center xs:justify-start xs:items-start h-full w-full sm:w-[80%]">
						<div className="flex flex-col h-full justify-center items-center xs:justify-start xs:items-start">
							<div className="flex flex-col justify-center xs:items-start items-center">
								<div className="flex flex-col-reverse xs:flex-row justify-center items-center xs:items-start xs:justify-start  gap-2 ">
									{feedback.name ||
										(feedback.jobTitle && (
											<div className="flex flex-col justify-center items-center xs:items-start xs:justify-startxs:items-start xs:justify-start ">
												<span className="text-base font-semibold">
													{feedback.name}
												</span>
												<span className="text-xs font-medium text-gray-600">
													{feedback.jobTitle}
												</span>
											</div>
										))}

									<span className="text-yellow-300 text-base">
										{Array.from({ length: feedback.rating }).map((_, index) => (
											<span key={index} className="text-xl">
												&#9733;
											</span>
										))}
									</span>
								</div>
								<div>
									<span className="text-xs font-light text-gray-500">
										{timesAgo(feedback.createdAt.toString())}
									</span>
								</div>
							</div>
							<div className="flex h-full flex-col text-center xs:text-start text-sm flex-grow">
								{feedback.content}
							</div>
						</div>
					</div>

					<div className="flex flex-grow justify-center items-start sm:items-center w-64 mx-auto xs:w-[30%] sm:w-[20%] p-1 md:mt-0">
						<Popover open={open} onOpenChange={setOpen}>
							<PopoverTrigger asChild>
								<Button
									variant="outline"
									size="sm"
									className="w-full md:w-[150px] justify-center"
								>
									{selectedStatus ? (
										<>
											<selectedStatus.icon className="mr-2 h-4 w-4 shrink-0" />
											{selectedStatus.label +
												(selectedStatus.label.endsWith("e") ? "d" : "ed")}
										</>
									) : (
										<>
											{feedback.action === "default" ? (
												"Select Action"
											) : matchingStatus ? (
												<>
													<matchingStatus.icon className="mr-2 h-4 w-4 shrink-0" />
													{capitalize(matchingStatus.value)}
												</>
											) : (
												capitalize(feedback.action)
											)}
										</>
									)}
								</Button>
							</PopoverTrigger>
							<PopoverContent className="p-0" align="start">
								<Command>
									<CommandList>
										<CommandGroup>
											{statuses.map((status) => (
												<CommandItem
													key={status.value}
													value={status.value}
													onSelect={handleActionSelect}
												>
													<status.icon
														className={cn(
															"mr-2 h-4 w-4",
															status.value === selectedStatus?.value
																? "opacity-100"
																: "opacity-60"
														)}
													/>
													{status.label}
												</CommandItem>
											))}
										</CommandGroup>
									</CommandList>
								</Command>
							</PopoverContent>
						</Popover>
					</div>
				</div>
			</div>
			<AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
						<AlertDialogDescription>
							This action cannot be undone. This will permanently delete this
							feedback and remove it from our servers.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel onClick={() => setIsAlertOpen(false)}>
							Cancel
						</AlertDialogCancel>
						<AlertDialogAction onClick={handleDeleteConfirm}>
							Delete
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
};
