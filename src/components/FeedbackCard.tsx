import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import {
	Archive,
	ArrowRightFromLine,
	ArrowUpCircle,
	CheckCircle2,
	Circle,
	HelpCircle,
	LucideIcon,
	PartyPopper,
	Trash2,
	XCircle,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

import { Button } from "./ui/button";
import { X } from "lucide-react";
import { Feedback } from "@/models/User";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { cn } from "@/lib/utils";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";
import { Separator } from "./ui/separator";
import { timesAgo } from "@/helpers/ConvertTimeStamp";

type Status = {
	value: string;
	label: string;
	icon: LucideIcon;
};
const statuses: Status[] = [
	{
		value: "approve",
		label: "Approve",
		icon: PartyPopper,
	},
	{
		value: "archive",
		label: "Archive",
		icon: Archive,
	},
	{
		value: "export",
		label: "Export",
		icon: ArrowRightFromLine,
	},
	{
		value: "discard",
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
	const { toast } = useToast();
	const [open, setOpen] = useState(false);
	const [selectedStatus, setSelectedStatus] = useState<Status | null>(null);

	const handleDeleteConfirm = async () => {
		try {
			const response = await axios.delete<ApiResponse>(
				`/api/delete-feedback/${feedback._id}`
			);
			toast({
				title: response.data.message,
			});
			onFeedbackDelete(feedback._id);
		} catch (error) {
			toast({
				title: "Error",
				description: "Failed to delete message",
				variant: "destructive",
			});
		}
	};

	const handleDiscardStatus = () => {
		return (
			<AlertDialog>
				<AlertDialogTrigger asChild>
					<Button variant="destructive">
						<X className="size-5" />
					</Button>
				</AlertDialogTrigger>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
						<AlertDialogDescription>
							This action cannot be undone. This will permanently delete this
							feedback and remove it from our servers.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction onClick={handleDeleteConfirm}>
							Delete
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		);
	};

	return (
		<>
			<div className="flex flex-col xs:flex-row items-start justify-start mx-5 p-2 gap-1 w-full rounded-md h-full bg-zinc-50">
				{/* display picture */}
				<div className="p-1 flex justify-center h-full w-full xs:w-[20%]">
					<div className="size-16 rounded-md bg-gradient-to-br from-teal-300 to-green-400" />
				</div>
				<div className="flex flex-col-reverse xs:flex-row gap-2 w-full">
					{/* content */}
					<div className="flex flex-col justify-center items-center xs:justify-start xs:items-start h-full w-full sm:w-[80%]">
						<div className="flex flex-col h-full justify-center items-center xs:justify-start xs:items-start">
							<div className="flex flex-col justify-center xs:items-start items-center">
								<div className="flex flex-col-reverse xs:flex-row justify-center items-center xs:items-start xs:justify-start  gap-2 ">
									<div className="flex flex-col justify-center items-center xs:items-start xs:justify-startxs:items-start xs:justify-start ">
										<span className="text-base font-semibold">
											{feedback.name}
										</span>
										<span className="text-xs font-medium text-gray-600">
											{feedback.jobTitle}
										</span>
									</div>
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

					<div className="flex flex-grow justify-center items-center w-64 mx-auto xs:w-[30%] sm:w-[20%] p-1 md:mt-0">
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
										<>Select Action</>
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
													onSelect={(value) => {
														setSelectedStatus(
															statuses.find(
																(priority) => priority.value === value
															) || null
														);
														setOpen(false);
													}}
												>
													<status.icon
														className={cn(
															"mr-2 h-4 w-4",
															status.value === selectedStatus?.value
																? "opacity-100"
																: "opacity-60"
														)}
													/>
													{status.label === "Discard" ? (
														<button onClick={handleDiscardStatus}>
															{status.label}
														</button>
													) : (
														status.label
													)}
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
			{/* <Separator /> */}
		</>
	);
};
