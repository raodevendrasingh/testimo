import { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";
import { useDebounceCallback } from "usehooks-ts";
import { ApiResponse } from "@/types/ApiResponse";

export const useCheckUsername = (initialUsername: string = "") => {
	const [username, setUsername] = useState<string>(initialUsername);
	const [usernameMsg, setUsernameMsg] = useState<string>("");
	const [isCheckingUsername, setIsCheckingUsername] = useState<boolean>(false);

	const debouncedSetUsername = useDebounceCallback(setUsername, 500);

	useEffect(() => {
		const checkUsernameUniqueness = async () => {
			if (username.length >= 4 && username.length <= 16) {
				setIsCheckingUsername(true);
				setUsernameMsg("");

				try {
					const url = `/api/check-username?username=${username}`;
					const response = await axios.get<ApiResponse>(url);
					setUsernameMsg(response.data.message);
				} catch (error) {
					const axiosError = error as AxiosError<ApiResponse>;
					setUsernameMsg(
						axiosError.response?.data.message ?? "Error checking username"
					);
				} finally {
					setIsCheckingUsername(false);
				}
			} else if (username.length < 4) {
				setUsernameMsg("");
			}
		};
		checkUsernameUniqueness();
	}, [username]);

	return {
		username,
		setUsername: debouncedSetUsername,
		usernameMsg,
		isCheckingUsername,
	};
};
