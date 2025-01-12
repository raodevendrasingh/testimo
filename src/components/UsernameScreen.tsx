"use client";

import { useCheckUsername } from "@/hooks/useCheckUsername";
import { Check, Loader, X } from "lucide-react";
import { useEffect } from "react";
import { Control, FieldValues, useWatch } from "react-hook-form";
import { FormField, FormItem, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export const UsernameScreen: React.FC<{
	control: Control<FieldValues>;
}> = ({ control }) => {
	const { setUsername, usernameMsg, isCheckingUsername } = useCheckUsername();

	const username = useWatch({
		control,
		name: "username",
		defaultValue: "",
	});

	useEffect(() => {
		setUsername(username);
	}, [username, setUsername]);

	return (
		<div className="flex flex-col items-center h-[180px]">
			<div className="flex items-center">
				<div className="flex flex-col items-center w-full">
					<div className="flex items-center justify-center w-full">
						<span className="select-none px-2.5 py-2 border-l border-y border-gray-300 rounded-l-lg text-base bg-gray-50 text-gray-700">
							remonial.live/
						</span>
						<FormField
							control={control}
							name="username"
							render={({ field }) => (
								<FormItem className="relative">
									<FormControl>
										<Input
											{...field}
											maxLength={16}
											aria-label="Claim your username"
											placeholder="username"
											title="Claim your username!"
											className={cn(
												"flex h-10 w-full rounded-r-lg border bg-background px-3 py-2 ring-offset-gray-700",
												"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0",
												"disabled:cursor-not-allowed disabled:opacity-50",
												"rounded-l-none",
												"!py-2 !h-auto !text-base",
												"border-gray-300 hover:border-gray-600 focus:border-gray-500 focus:ring-gray-500"
											)}
										/>
									</FormControl>
								</FormItem>
							)}
						/>
					</div>
					<div className="py-2 w-full">
						<div className="flex flex-col justify-start overflow-hidden text-xs">
							{username && username.length >= 4 && (
								<>
									{isCheckingUsername ? (
										<span className="flex items-center gap-1">
											<Loader className="animate-spin size-4 text-gray-600" />
											<span className="text-slate-700">
												Checking...
											</span>
										</span>
									) : usernameMsg ===
									  "Username is available" ? (
										<span className="flex items-center gap-1">
											<Check className="size-4 text-green-500" />
											<span className="text-green-500">
												{usernameMsg}
											</span>
										</span>
									) : usernameMsg ===
									  "Username is already taken" ? (
										<span className="flex items-center gap-1">
											<X className="size-4 text-red-500" />
											<span className="text-red-500">
												{usernameMsg}
											</span>
										</span>
									) : null}
								</>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
