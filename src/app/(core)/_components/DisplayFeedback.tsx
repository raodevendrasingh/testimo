import { FeedbackCard } from "@/components/FeedbackCard";
import { useFetchFeedback } from "@/hooks/useFetchFeedback";
import { useEffect } from "react";
import { Loader } from "lucide-react";

export const DisplayFeedback = () => {
	const { feedback, isLoading, fetchFeedback } = useFetchFeedback();

	useEffect(() => {
		fetchFeedback();
	}, [fetchFeedback]);

	const handleDeleteFeedback = (feedbackId: string) => {
		// Implement delete logic here
	};


	return (
		<div className="flex flex-col max-w-7xl mx-auto w-full flex-grow">
			<div className="flex  items-center gap-3">
				{isLoading ? (
					<span className="flex items-center gap-2">
						<Loader className="animate-spin size-4 text-gay-600" />
						<p>Loading</p>
					</span>
				) : feedback.length > 0 ? (
					feedback.map((message) => (
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
	);
};
