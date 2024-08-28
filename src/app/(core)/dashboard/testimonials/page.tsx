"use client"

import React from "react";
import { FeedbackCard } from "@/app/(core)/_components/FeedbackCard";
import { useFetchFeedback } from "@/hooks/useFetchFeedback";
import { useEffect } from "react";
import { Loader } from "lucide-react";

const TestimonialPage = () => {
	const { feedback, setFeedback, isLoading, fetchFeedback } =
		useFetchFeedback();

	useEffect(() => {
		fetchFeedback();
	}, [fetchFeedback]);

	const handleDeleteFeedback = (feedbackId: string) => {
		setFeedback(feedback.filter((message) => message._id !== feedbackId));
	};

	const actionsToExclude = ["archived", "exported"];

	const filterFeedback = (
		feedback: any[],
		actionsToExclude: string | any[]
	) => {
		return feedback.filter(
			(message) => !actionsToExclude.includes(message.action)
		);
	};
	return (
		<div className="w-full mx-auto scrollbar-hide">
			<div className="max-w-6xl mx-auto lg:ml-72 w-full ">
				<div className="max-w-5xl h-[calc(100vh-58px)] mx-auto p-3 w-full pr-16 border-r">
					<div className="flex flex-col max-w-7xl mx-auto w-full flex-grow">
						<div className="flex flex-col items-center gap-3 p-3">
							{isLoading ? (
								<span className="flex items-center gap-2">
									<Loader className="animate-spin size-4 text-gray-600" />
									<p>Loading</p>
								</span>
							) : feedback.length > 0 ? (
								filterFeedback(feedback, actionsToExclude).map((message) => (
									<FeedbackCard
										key={message._id}
										feedback={message}
										onFeedbackDelete={handleDeleteFeedback}
									/>
								))
							) : (
								<p className="py-5">No Feedbacks Received</p>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default TestimonialPage;
