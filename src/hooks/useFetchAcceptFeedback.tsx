import { useState, useCallback } from "react";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { toast } from "sonner";

export const useFetchAcceptFeedback = () => {
	const [isAcceptingFeedback, setIsAcceptingFeedback] =
		useState<boolean>(false);
	const [isSwitchLoading, setIsSwitchLoading] = useState<boolean>(false);

	const fetchAcceptFeedback = useCallback(async () => {
		setIsSwitchLoading(true);
		try {
			const response = await axios.get<ApiResponse>("/api/accept-feedback");
			setIsAcceptingFeedback(response.data.isAcceptingFeedback || false);
		} catch (error) {
			const axiosError = error as AxiosError<ApiResponse>;
			toast.error("Error", {
				description:
					axiosError.response?.data.message ||
					"Failed to fetch feedback settings",
			});
		} finally {
			setIsSwitchLoading(false);
		}
	}, []);

	const handleSwitchChange = async () => {
		setIsSwitchLoading(true);
		try {
			const response = await axios.post<ApiResponse>("/api/accept-feedback", {
				acceptFeedback: !isAcceptingFeedback,
			});
			setIsAcceptingFeedback(!isAcceptingFeedback);
			toast.success(response.data.message);
		} catch (error) {
			const axiosError = error as AxiosError<ApiResponse>;
			toast.error("Error", {
				description:
					axiosError.response?.data.message ||
					"Failed to update feedback settings",
			});
		} finally {
			setIsSwitchLoading(false);
		}
	};

	return {
		isAcceptingFeedback,
		isSwitchLoading,
		fetchAcceptFeedback,
		handleSwitchChange,
	};
};
