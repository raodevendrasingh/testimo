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
import { useToast } from "@/components/ui/use-toast";

import { Button } from "./ui/button";
import { X } from "lucide-react";
import { Feedback } from "@/models/User";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";

type FeedbackCardProps = {
	feedback: Feedback;
	onFeedbackDelete: (feedbackId: string) => void;
};

export const FeedbackCard = ({
	feedback,
	onFeedbackDelete,
}: FeedbackCardProps) => {
	const { toast } = useToast();

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
			const axiosError = error as AxiosError<ApiResponse>;
			toast({
				title: "Error",
				description: "Failed to delete message",
				variant: "destructive",
			});
		}
	};
	return (
		<Card>
			<CardHeader>
				<CardTitle>Card Title</CardTitle>
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
								This action cannot be undone. This will permanently delete your
								account and remove your data from our servers.
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
				<CardDescription>Card Description</CardDescription>
			</CardHeader>
			<CardContent>
				<p>Card Content</p>
			</CardContent>
		</Card>
	);
};
