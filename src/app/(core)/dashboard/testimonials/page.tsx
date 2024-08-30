"use client";

import React from "react";
import { TestimonialCard } from "@/app/(core)/_components/TestimonialCard";
import { useFetchTestimonials } from "@/hooks/useFetchTestimonials";
import { useEffect } from "react";
import { TestimonialSkeleton } from "@/components/TestimonialSkeleton";

const TestimonialPage = () => {
	const { testimonial, setFeedback, isLoading, fetchTestimonials } =
		useFetchTestimonials();

	useEffect(() => {
		fetchTestimonials();
	}, [fetchTestimonials]);

	const handleTestimonialDelete = (feedbackId: string) => {
		setFeedback(testimonial.filter((message) => message._id !== feedbackId));
	};

	const actionsToExclude = ["archived", "exported"];

	const filterTestimonials = (
		testimonial: any[],
		actionsToExclude: string | any[]
	) => {
		return testimonial.filter(
			(message) => !actionsToExclude.includes(message.action)
		);
	};

	const filteredTestimonials = filterTestimonials(
		testimonial,
		actionsToExclude
	);

	return (
		<div className="w-full mx-auto">
			<div className="max-w-5xl mx-auto">
				<div className="flex flex-col max-w-7xl mx-auto w-full flex-grow">
					<div className="flex flex-col items-center gap-3 p-4">
						{isLoading ? (
							<span className="flex flex-col items-center gap-3 w-full">
								<TestimonialSkeleton />
								<TestimonialSkeleton />
								<TestimonialSkeleton />
							</span>
						) : filteredTestimonials.length > 0 ? (
							filteredTestimonials.map((message) => (
								<TestimonialCard
									key={message._id}
									testimonial={message}
									onTestimonialDelete={handleTestimonialDelete}
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
	);
};

export default TestimonialPage;
