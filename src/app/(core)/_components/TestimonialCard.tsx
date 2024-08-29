import axios from "axios";
import { Testimonial } from "@/models/User";
import { CldImage } from "next-cloudinary";
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

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { timesAgo } from "@/helpers/ConvertTimeStamp";
import { useActionUpdate } from "@/hooks/useActionUpdate";
import { toast } from "sonner";
import { capitalize } from "@/helpers/CapitalizeFirstChar";

import emptyUser from "@/assets/placeholder/emptyUser.png";
import Image from "next/image";

import { Stars } from "@/components/ui/Stars";

import { Status, statuses } from "@/lib/selectOptions";
import { DeleteDialog } from "@/utils/DeleteDialogBox";
import { ExportDialog } from "@/utils/ExportCodeDialog";

type TestimonialCardProps = {
	testimonial: Testimonial;
	onTestimonialDelete: (feedbackId: string) => void;
};

export const TestimonialCard = ({
	testimonial,
	onTestimonialDelete,
}: TestimonialCardProps) => {
	const [open, setOpen] = useState(false);
	const [selectedStatus, setSelectedStatus] = useState<Status | null>(null);
	const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
	const [isExportAlertOpen, setIsExportAlertOpen] = useState(false);
	const { actionUpdate, loading, error } = useActionUpdate();

	const handleDeleteConfirm = async () => {
		try {
			const response = await axios.delete<ApiResponse>(
				`/api/delete-testimonial/${testimonial._id}`
			);
			toast.success(response.data.message);
			onTestimonialDelete(testimonial._id as string);
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
			await actionUpdate(testimonial._id as string, value);
		} else {
			await actionUpdate(testimonial._id as string, value);
		}
	};

	const matchingStatus = statuses.find(
		(status) => status.value === testimonial.action
	);

	return (
		<>
			<div
				className={cn(
					"flex flex-col xs:flex-row items-start justify-start mx-5 p-2 gap-1 w-full rounded-md h-full",
					{
						"bg-red-50": testimonial.action === "default",
						"bg-zinc-50": testimonial.action !== "default",
					}
				)}
			>
				{/* display picture */}
				<div className="p-1 flex justify-center h-full w-full xs:w-[20%]">
					{testimonial.imageUrl ? (
						<CldImage
							src={testimonial.imageUrl as string}
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
									{testimonial.name ||
										(testimonial.jobTitle && (
											<div className="flex flex-col justify-center items-center xs:items-start xs:justify-startxs:items-start xs:justify-start ">
												<span className="text-base font-semibold">
													{testimonial.name}
												</span>
												<span className="text-xs font-medium text-gray-600">
													{testimonial.jobTitle}
												</span>
											</div>
										))}

									<Stars rating={testimonial.rating} />
								</div>
								<div>
									<span className="text-xs font-light text-gray-500">
										{timesAgo(testimonial.createdAt.toString())}
									</span>
								</div>
							</div>
							<div className="flex h-full flex-col text-center xs:text-start text-sm flex-grow">
								{testimonial.content}
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
											{testimonial.action === "default" ? (
												"Select Action"
											) : matchingStatus ? (
												<>
													<matchingStatus.icon className="mr-2 h-4 w-4 shrink-0" />
													{capitalize(matchingStatus.value)}
												</>
											) : (
												capitalize(testimonial.action)
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
				testimonial={testimonial}
			/>
		</>
	);
};
