"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { LogOutIcon } from "lucide-react";
import { useSidebar } from "@/context/SidebarContext";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import remonial_wordmark_dark from "@/assets/brand/remonial_wordmark_dark.png";
import Image from "next/image";

export const HomeNav = (): JSX.Element => {
	const { toggleSidebar, isSidebarOpen } = useSidebar();

	return (
		<header className="w-full h-14 text-zinc-800 bg-white z-20 sticky border-b top-0">
			<div className="container mx-auto px-4 py-2.5">
				<div className="flex items-center justify-between">
					<div className="flex gap-2 items-center">
						<button
							className={`relative block size-10 self-center lg:hidden
                            ${
															isSidebarOpen
																? "visible opacity-100 [&_span:nth-child(1)]:w-6 [&_span:nth-child(1)]:translate-y-0 [&_span:nth-child(1)]:rotate-45 [&_span:nth-child(3)]:w-0 [&_span:nth-child(2)]:-rotate-45 "
																: ""
														}
                    `}
							aria-expanded={isSidebarOpen ? "true" : "false"}
							aria-label="Toggle navigation"
							onClick={toggleSidebar}
						>
							<div className="absolute top-1/2 left-1/2 w-6 -translate-x-1/2 -translate-y-1/2 -mt-1 transform">
								<span
									aria-hidden="true"
									className="absolute block h-0.5 w-9/12 -translate-y-2 transform rounded-full bg-zinc-900 transition-all duration-300"
								></span>
								<span
									aria-hidden="true"
									className="absolute block h-0.5 w-6 transform rounded-full bg-zinc-900 transition duration-300"
								></span>
								<span
									aria-hidden="true"
									className="absolute block h-0.5 w-1/2 origin-top-left translate-y-2 transform rounded-full bg-zinc-900 transition-all duration-300"
								></span>
							</div>
						</button>
						<Link href="/">
							<Image
								src={remonial_wordmark_dark}
								alt="remonials"
								width={160}
								height={40}
								priority
								className="w-40 h-12 -mt-1.5"
							/>
						</Link>
						<span className="inline-flex -mt-1.5 items-center gap-x-1.5 py-1 px-2 rounded-md text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-800/30 dark:text-blue-500">
							Beta
						</span>
					</div>
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger asChild>
								<Button size="sm" variant="outline" onClick={() => signOut()}>
									<LogOutIcon className="size-4 text-red-600" />
								</Button>
							</TooltipTrigger>
							<TooltipContent>
								<p>Logout</p>
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
				</div>
			</div>
		</header>
	);
};
