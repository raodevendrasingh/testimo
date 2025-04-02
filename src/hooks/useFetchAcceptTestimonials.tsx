import type { ApiResponse } from "@/types/ApiResponse";
import axios, { type AxiosError } from "axios";
import { useCallback, useState } from "react";
import { toast } from "sonner";

export const useFetchAcceptTestimonials = () => {
	const [isAcceptingTestimonials, setIsAcceptingFeedback] = useState<boolean>(false);
	const [isSwitchLoading, setIsSwitchLoading] = useState<boolean>(false);

	const fetchAcceptTestimonial = useCallback(async () => {
		setIsSwitchLoading(true);
		try {
			const response = await axios.get<ApiResponse>("/api/accept-testimonials");
			setIsAcceptingFeedback(response.data.isAcceptingTestimonials || false);
		} catch (error) {
			const axiosError = error as AxiosError<ApiResponse>;
			toast.error("Error", {
				description: axiosError.response?.data.message || "Failed to fetch testimonial settings",
			});
		} finally {
			setIsSwitchLoading(false);
		}
	}, []);

	const handleSwitchChange = async () => {
		setIsSwitchLoading(true);
		try {
			const response = await axios.post<ApiResponse>("/api/accept-testimonials", {
				acceptFeedback: !isAcceptingTestimonials,
			});
			setIsAcceptingFeedback(!isAcceptingTestimonials);
			toast.success(response.data.message);
		} catch (error) {
			const axiosError = error as AxiosError<ApiResponse>;
			toast.error("Error", {
				description: axiosError.response?.data.message || "Failed to update testimonial settings",
			});
		} finally {
			setIsSwitchLoading(false);
		}
	};

	return {
		isAcceptingTestimonials,
		isSwitchLoading,
		fetchAcceptTestimonial,
		handleSwitchChange,
	};
};
