"use client";

import { TestimonialCard } from "@/app/(core)/_components/TestimonialCard";
import { TestimonialSkeleton } from "@/components/TestimonialSkeleton";
import { useFetchTestimonials } from "@/hooks/useFetchTestimonials";
import type { Testimonial } from "@/models/Testimonial";
import React from "react";
import { useEffect } from "react";

const TestimonialPage = () => {
	const { testimonial, setTestimonial, isLoading, fetchTestimonials } = useFetchTestimonials();

	useEffect(() => {
		fetchTestimonials();
	}, [fetchTestimonials]);

	const handleTestimonialDelete = (testimonialId: string) => {
		setTestimonial(testimonial.filter((message) => message._id !== testimonialId));
	};

	const actionsToExclude = ["archived", "exported"];

	const filterTestimonials = (testimonial: Testimonial[], actionsToExclude: string[]) => {
		return testimonial.filter((message) => !actionsToExclude.includes(message.action));
	};

	const filteredTestimonials = filterTestimonials(testimonial, actionsToExclude);

	return (
		<div className="w-full mx-auto">
			<div className="max-w-5xl mx-auto">
				<div className="flex flex-col max-w-7xl mx-auto w-full grow">
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
									key={message._id as string}
									testimonial={message}
									onTestimonialDelete={handleTestimonialDelete}
								/>
							))
						) : (
							<div className="py-5 border w-full text-center rounded-lg">
								<span className="font-medium text-gray-500 ">No Testimonials Available</span>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default TestimonialPage;
