"use client";

import {
	ChartPie,
	Clock,
	Coins,
	Loader,
	MessageSquareQuote,
	RefreshCcw,
	Star,
} from "lucide-react";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";

import { INITIAL_TESTIMONIAL_COUNT } from "@/lib/constants";
import { useFetchTestimonials } from "@/hooks/useFetchTestimonials";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export const Stats = () => {
	const router = useRouter();
	const { testimonial, isLoading, fetchTestimonials } =
		useFetchTestimonials();

	useEffect(() => {
		fetchTestimonials();
	}, [fetchTestimonials]);

	const averageRating = () => {
		let ratingSum = 0;
		testimonial.map((i) => (ratingSum += i.rating));
		const avgRating = ratingSum / testimonial.length;
		return avgRating;
	};

	const recentTestimonials = () => {
		let recentTest = 0;
		const currentDate = new Date();
		const oneWeekAgo = new Date(currentDate);
		oneWeekAgo.setDate(currentDate.getDate() - 7);

		testimonial.forEach((d) => {
			const testimonialDate = new Date(d.createdAt);
			if (testimonialDate >= oneWeekAgo) {
				recentTest++;
			}
		});
		return recentTest;
	};

	const handleRefreshStats = () => {
		fetchTestimonials();
	};

	return (
		<div className="bg-white rounded-xl border p-6">
			<div className="flex justify-between items-center">
				<h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
					<ChartPie className="size-5 text-gray-600" />
					Stats
				</h2>
				<span className="mb-4" onClick={handleRefreshStats}>
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger>
								<RefreshCcw
									size={20}
									className="text-gray-700"
								/>
							</TooltipTrigger>
							<TooltipContent>
								<p>Refresh Stats</p>
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
				</span>
			</div>
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
				{/* coins */}
				<div className="bg-gray-50 p-4 rounded-lg">
					<div className="flex items-center justify-between mb-2">
						<Coins className="size-8 text-orange-400" />
						<span className="text-2xl font-bold text-gray-800">
							{isLoading ? (
								<Loader className="animate-spin text-gray-300" />
							) : (
								INITIAL_TESTIMONIAL_COUNT - testimonial.length
							)}
						</span>
					</div>
					<h3 className="text-sm font-medium text-gray-600">
						Credits Remaining
					</h3>
				</div>
				{/* testimonials received */}
				<div className="bg-gray-50 p-4 rounded-lg">
					<div className="flex items-center justify-between mb-2">
						<MessageSquareQuote className="size-8 text-indigo-400" />
						<span className="text-2xl font-bold text-gray-800">
							{isLoading ? (
								<Loader className="animate-spin text-gray-300" />
							) : (
								testimonial.length
							)}
						</span>
					</div>
					<h3 className="text-sm font-medium text-gray-600">
						Testimonials Received
					</h3>
				</div>
				{/* average rating */}
				<div className="bg-gray-50 p-4 rounded-lg">
					<div className="flex items-center justify-between mb-2">
						<Star className="size-8 text-yellow-400" />
						<span className="text-2xl font-bold text-gray-800">
							{isLoading ? (
								<Loader className="animate-spin text-gray-300" />
							) : (
								averageRating()
							)}
						</span>
					</div>
					<h3 className="text-sm font-medium text-gray-600">
						Average Rating
					</h3>
				</div>
				{/* latest count */}
				<div className="bg-gray-50 p-4 rounded-lg">
					<div className="flex items-center justify-between mb-2">
						<Clock className="size-8 text-blue-500" />
						<span className="text-2xl font-bold text-gray-800">
							{isLoading ? (
								<Loader className="animate-spin text-gray-300" />
							) : (
								recentTestimonials()
							)}
						</span>
					</div>
					<h3 className="text-sm font-medium text-gray-600">
						Received in Past Week
					</h3>
				</div>
			</div>
		</div>
	);
};
