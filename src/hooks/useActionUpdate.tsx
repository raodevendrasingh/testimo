import type { ApiResponse } from "@/types/ApiResponse";
import axios, { type AxiosError } from "axios";
import { useState } from "react";
import { toast } from "sonner";

export const useActionUpdate = () => {
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);

	const actionUpdate = async (feedbackId: string, action: string) => {
		setLoading(true);
		setError(null);

		try {
			const response = await axios.post<ApiResponse>("/api/update-action", {
				feedbackId,
				action,
			});

			if (action !== "exported") {
				toast.success(response.data.message);
			}
		} catch (error) {
			const axiosError = error as AxiosError<ApiResponse>;
			toast.error("Error", {
				description: axiosError.response?.data.message || "Failed to update feedbak action!",
			});
		} finally {
			setLoading(false);
		}
	};

	return { actionUpdate, loading, error };
};
