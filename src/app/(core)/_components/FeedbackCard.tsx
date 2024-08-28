import { CopyBlock, atomOneDark } from "react-code-blocks";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { ChevronDown, Code, Eye } from "lucide-react";

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
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Stars } from "../../../components/ui/Stars";

import { Framework, languages, Status, statuses } from "@/lib/selectOptions";
import { DeleteDialog } from "@/utils/DeleteDialogBox";
import { ExportDialog } from "@/utils/ExportCodeDialog";

type FeedbackCardProps = {
	feedback: Feedback;
	onFeedbackDelete: (feedbackId: string) => void;
};

export const FeedbackCard = ({
	feedback,
	onFeedbackDelete,
}: FeedbackCardProps) => {
	// for action selection
	const [open, setOpen] = useState(false);
	const [selectedStatus, setSelectedStatus] = useState<Status | null>(null);
	const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
	const [isExportAlertOpen, setIsExportAlertOpen] = useState(false);
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
		setIsDeleteAlertOpen(false);
	};

	const handleActionSelect = async (value: string) => {
		setSelectedStatus(
			statuses.find((status) => status.value === value) || null
		);
		setOpen(false);

		if (value === "discarded") {
			setIsDeleteAlertOpen(true);
		} else if (value === "exported") {
			setIsExportAlertOpen(true);
			await actionUpdate(feedback._id as string, value);
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

									<Stars rating={feedback.rating} />
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
							<PopoverContent className="p-0" width="144px" align="start">
								<Command>
									<CommandList>
										<CommandGroup>
											{statuses.map((status) => (
												<CommandItem
													key={status.value}
													value={status.value}
													className="text-sm"
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

			<DeleteDialog
				isOpen={isDeleteAlertOpen}
				onOpenChange={setIsDeleteAlertOpen}
				onConfirm={handleDeleteConfirm}
			/>

			<ExportDialog
				isOpen={isExportAlertOpen}
				onOpenChange={setIsExportAlertOpen}
				feedback={feedback}
			/>
		</>
	);
};
