"use client";

import { TestimonialCard } from "@/app/(core)/_components/TestimonialCard";
import { useFetchTestimonials } from "@/hooks/useFetchTestimonials";
import { useEffect } from "react";
import { TestimonialSkeleton } from "@/components/TestimonialSkeleton";

const ArchivesPage = () => {
	const { testimonial, setFeedback, isLoading, fetchTestimonials } =
		useFetchTestimonials();

	useEffect(() => {
		fetchTestimonials();
	}, [fetchTestimonials]);

	const handleTestimonialDelete = (feedbackId: string) => {
		setFeedback(testimonial.filter((message) => message._id !== feedbackId));
	};

	const archivedFeedback = testimonial.filter(
		(message) => message.action === "archived"
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
						) : archivedFeedback.length > 0 ? (
							archivedFeedback.map((message) => (
								<TestimonialCard
									key={message._id as string}
									testimonial={message}
									onTestimonialDelete={handleTestimonialDelete}
								/>
							))
						) : (
							<div className="py-5 border w-full text-center rounded-lg">
								<span className="font-medium text-gray-500 ">
									No Archived Items
								</span>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default ArchivesPage;
