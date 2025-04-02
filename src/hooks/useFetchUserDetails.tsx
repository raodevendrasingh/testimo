"use client";

import type { User } from "@/models/User";
import type { ApiResponse } from "@/types/ApiResponse";
import axios, { type AxiosError } from "axios";
import { useCallback, useState } from "react";
import { toast } from "sonner";

export const useFetchUserDetail = () => {
	const [userDetail, setUserDetail] = useState<User[]>([]);
	const [isUserLoading, setIsUserLoading] = useState<boolean>(false);

	const fetchUserData = useCallback(async (refresh = false) => {
		setIsUserLoading(true);
		try {
			const response = await axios.get<ApiResponse>("/api/get-user-details");
			setUserDetail(response.data.user || []);
		} catch (error) {
			const axiosError = error as AxiosError<ApiResponse>;
			toast.error("Error", {
				description: axiosError.response?.data.message || "Failed to Fetch User Data",
			});
		} finally {
			setIsUserLoading(false);
		}
	}, []);

	return { userDetail, isUserLoading, setUserDetail, fetchUserData };
};
