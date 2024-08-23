"use client";

import { useState, useCallback } from "react";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { toast } from "sonner";
import { User } from "@/models/User";

export const useFetchUserDetail = () => {
	const [userDetail, setUserDetail] = useState<User[]>([]);
	const [isUserLoading, setIsUserLoading] = useState<boolean>(false);

	const fetchUserData = useCallback(async (refresh: boolean = false) => {
		setIsUserLoading(true);
		try {
			const response = await axios.get<ApiResponse>("/api/get-user-details");
			setUserDetail(response.data.user || []);
		} catch (error) {
			const axiosError = error as AxiosError<ApiResponse>;
			toast.error("Error", {
				description:
					axiosError.response?.data.message || "Failed to Fetch User Data",
			});
		} finally {
			setIsUserLoading(false);
		}
	}, []);
	// console.log(userDetail);

	return { userDetail, isUserLoading, setUserDetail, fetchUserData };
};
