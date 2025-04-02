"use client";

import type { Testimonial } from "@/models/Testimonial";
import type { ApiResponse } from "@/types/ApiResponse";
import axios, { type AxiosError } from "axios";
import { useCallback, useState } from "react";
import { toast } from "sonner";

export const useFetchTestimonials = () => {
	const [testimonial, setTestimonial] = useState<Testimonial[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const fetchTestimonials = useCallback(async (refresh = false) => {
		setIsLoading(true);
		try {
			const response = await axios.get<ApiResponse>("/api/get-testimonials");
			setTestimonial(response.data.testimonial || []);
			if (refresh) {
				toast("Testimonial Refreshed");
			}
		} catch (error) {
			const axiosError = error as AxiosError<ApiResponse>;
			toast.error("Error", {
				description: axiosError.response?.data.message || "Failed to fetch testimonial",
			});
		} finally {
			setIsLoading(false);
		}
	}, []);

	return { testimonial, isLoading, setTestimonial, fetchTestimonials };
};
