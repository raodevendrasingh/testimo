"use client";

import React from "react";
import { FeedbackCard } from "@/app/(core)/_components/FeedbackCard";
import { useFetchTestimonials } from "@/hooks/useFetchTestimonials";
import { useEffect } from "react";
import { FeedbackSkeleton } from "@/components/TestimonialSkeleton";

const TestimonialPage = () => {
	const { testimonial, setFeedback, isLoading, fetchTestimonials } =
		useFetchTestimonials();

	useEffect(() => {
		fetchTestimonials();
	}, [fetchTestimonials]);

	const handleDeleteFeedback = (feedbackId: string) => {
		setFeedback(testimonial.filter((message) => message._id !== feedbackId));
	};

	const actionsToExclude = ["archived", "exported"];

	const filterFeedback = (
		testimonial: any[],
		actionsToExclude: string | any[]
	) => {
		return testimonial.filter(
			(message) => !actionsToExclude.includes(message.action)
		);
	};

	const filteredFeedback = filterFeedback(testimonial, actionsToExclude);

	return (
		<div className="w-full mx-auto scrollbar-hide">
			<div className="max-w-6xl mx-auto lg:ml-72 w-full ">
				<div className="max-w-5xl h-[calc(100vh-58px)] mx-auto p-3 w-full pr-16 border-r overflow-y-auto scroll-smooth">
					<div className="flex flex-col max-w-7xl mx-auto w-full flex-grow">
						<div className="flex flex-col items-center gap-3 p-3">
							{isLoading ? (
								<span className="flex flex-col items-center gap-3 w-full">
									<FeedbackSkeleton />
									<FeedbackSkeleton />
									<FeedbackSkeleton />
								</span>
							) : filteredFeedback.length > 0 ? (
								filteredFeedback.map((message) => (
									<FeedbackCard
										key={message._id}
										testimonial={message}
										onFeedbackDelete={handleDeleteFeedback}
									/>
								))
							) : (
								<div className="py-5 border w-full text-center rounded-lg">
									<span className="font-medium text-gray-500 ">
										No Testimonials Available
									</span>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default TestimonialPage;
