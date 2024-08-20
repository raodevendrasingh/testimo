"use client";

import { useState, useCallback } from "react";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { Feedback } from "@/models/User";
import { toast } from "sonner";

export const useFetchFeedback = () => {
	const [feedback, setFeedback] = useState<Feedback[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const fetchFeedback = useCallback(async (refresh: boolean = false) => {
		setIsLoading(true);
		try {
			const response = await axios.get<ApiResponse>("/api/get-feedback");
			setFeedback(response.data.feedback || []);
			if (refresh) {
				toast.success("Feedbacks Refreshed", {
					description: "Showing latest feedbacks",
				});
			}
		} catch (error) {
			const axiosError = error as AxiosError<ApiResponse>;
			toast.error("Error", {
				description:
					axiosError.response?.data.message || "Failed to fetch feedback",
			});
		} finally {
			setIsLoading(false);
		}
	}, []);
	// console.log(feedback);

	return { feedback, isLoading, fetchFeedback };
};
