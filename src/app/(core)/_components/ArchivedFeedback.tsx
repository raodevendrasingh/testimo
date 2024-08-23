import { FeedbackCard } from "@/app/(core)/_components/FeedbackCard";
import { useFetchFeedback } from "@/hooks/useFetchFeedback";
import { useEffect } from "react";
import { Loader } from "lucide-react";

export const ArchivedFeedback = () => {
	const { feedback, setFeedback, isLoading, fetchFeedback } =
		useFetchFeedback();

	useEffect(() => {
		fetchFeedback();
	}, [fetchFeedback]);

	const handleDeleteFeedback = (feedbackId: string) => {
		setFeedback(feedback.filter((message) => message._id !== feedbackId));
	};

	return (
		<div className="flex flex-col max-w-7xl mx-auto w-full flex-grow">
			<div className="flex flex-col items-center gap-3 p-3">
				{isLoading ? (
					<span className="flex items-center gap-2">
						<Loader className="animate-spin size-4 text-gray-600" />
						<p>Loading</p>
					</span>
				) : feedback.length > 0 ? (
					feedback
						.filter((message) => message.action === "archived") 
						.map((message) => (
							<FeedbackCard
								key={message._id as string}
								feedback={message}
								onFeedbackDelete={handleDeleteFeedback}
							/>
						))
				) : (
					<p className="py-5">No Archived Feedbacks</p>
				)}
			</div>
		</div>
	);
};
