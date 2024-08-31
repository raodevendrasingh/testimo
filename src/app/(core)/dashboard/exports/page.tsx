"use client";

import { TestimonialCard } from "@/app/(core)/_components/TestimonialCard";
import { useFetchTestimonials } from "@/hooks/useFetchTestimonials";
import { useEffect } from "react";
import { TestimonialSkeleton } from "@/components/TestimonialSkeleton";

const ExportsPage = () => {
	const { testimonial, setTestimonial, isLoading, fetchTestimonials } =
		useFetchTestimonials();

	useEffect(() => {
		fetchTestimonials();
	}, [fetchTestimonials]);

	const handleTestimonialDelete = (testimonialId: string) => {
		setTestimonial(testimonial.filter((message) => message._id !== testimonialId));
	};

	const exportedTestimonials = testimonial.filter(
		(message) => message.action === "exported"
	);

	return (
		// <div className="w-full mx-auto scrollbar-hide">
		// 	<div className="max-w-6xl mx-auto lg:ml-72 w-full">
		// 		<div className="max-w-5xl h-[calc(100vh-58px)] mx-auto p-3 w-full pr-16 border-r overflow-y-auto scroll-smooth">
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
						) : exportedTestimonials.length > 0 ? (
							exportedTestimonials.map((message) => (
								<TestimonialCard
									key={message._id as string}
									testimonial={message}
									onTestimonialDelete={handleTestimonialDelete}
								/>
							))
						) : (
							<div className="py-5 border w-full text-center rounded-lg">
								<span className="font-medium text-gray-500 ">
									No Exported Items
								</span>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
		// </div>
	);
};

export default ExportsPage;
