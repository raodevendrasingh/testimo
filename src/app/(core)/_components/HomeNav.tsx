"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { LogOutIcon } from "lucide-react";

export const HomeNav = (): JSX.Element => {

	return (
		<header className="w-full text-zinc-800 bg-white z-20 sticky border-b top-0">
			<div className="container mx-auto px-4 py-2.5">
				<div className="flex items-center justify-between">
					<div className="flex gap-2 items-center">
						<Link href="/" className="flex items-center space-x-2">
							<span className="text-3xl font-bold">critiqly</span>
						</Link>
						<span className="inline-flex items-center gap-x-1.5 py-1 px-2 rounded-md text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-800/30 dark:text-blue-500">
							Beta
						</span>
					</div>

					<button
						onClick={() => signOut()}
						className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-md text-white text-sm"
					>
						<LogOutIcon className="size-4 text-rose-500" />
					</button>
				</div>
			</div>
		</header>
	);
};
