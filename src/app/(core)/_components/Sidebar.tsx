"use client";

import { ReactNode } from "react";
import ProfilePage from "../dashboard/profile/page";
import Link from "next/link";
import {
	ArrowUpRight,
	LucideIcon,
	User2,
	Archive,
	Rows3,
	ChartArea,
	FolderInput,
	LayoutTemplate,
    Braces,
} from "lucide-react";
import { cn } from "@/lib/utils";
import TestimonialPage from "../dashboard/testimonials/page";
import ArchivesPage from "../dashboard/archives/page";
import InsightsPage from "../dashboard/insights/page";
import ExportsPage from "../dashboard/exports/page";
import CustomizePage from "../dashboard/customize/page";
import ComponentsPage from "../dashboard/components/page";

type Tabs = {
	title: string;
	href: string;
	icon: LucideIcon;
	content: ReactNode;
	disabled?: boolean;
};

export const tabsData: Tabs[] = [
	{
		title: "Profile",
		href: "/profile",
		icon: User2,
		content: <ProfilePage />,
	},
	{
		title: "Testimonials",
		href: "/testimonials",
		icon: Rows3,
		content: <TestimonialPage />,
	},
	{
		title: "Exports",
		href: "/exports",
		icon: FolderInput,
		content: <ExportsPage />,
	},
	{
		title: "Archives",
		href: "/archives",
		icon: Archive,
		content: <ArchivesPage />,
	},
    {
		title: "Components",
		href: "/components",
		icon: Braces,
		content: <ComponentsPage />,
	},
    {
		title: "Customize Page",
		href: "/customize-page",
		icon: LayoutTemplate,
		content: <CustomizePage />,
		disabled: true,
	},
	{
		title: "Insights",
		href: "/insights",
		icon: ChartArea,
		content: <InsightsPage />,
		disabled: true,
	},
];

type SidebarProps = {
	selectedTab: number;
	setSelectedTab: (index: number) => void;
};

const Sidebar: React.FC<SidebarProps> = ({ selectedTab, setSelectedTab }) => {
	return (
		<div>
			<main className="absolute w-56 lg:flex flex-col hidden justify-between left-20 h-[calc(100vh-58px)] z-10 border-x">
				<aside className="py-3 flex flex-col justify-start gap-2 ">
					{tabsData.map((tab, idx) => (
						<ul key={idx} className="flex flex-col justify-start gap-1 w-full ">
							<li className="px-3">
								<button
									onClick={() => !tab.disabled && setSelectedTab(idx)}
									className={cn(
										"flex w-48 items-center rounded-md py-2 px-3 text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-800 focus:bg-slate-100 aria-[current=page]:bg-green-50 aria-[current=page]:text-slate-700",
										tab.disabled && "cursor-not-allowed opacity-50"
									)}
									disabled={tab.disabled}
								>
									<span className="w-1/5">
										<tab.icon
											className={cn(
												"mr-2 h-4 w-4",
												selectedTab === idx ? "opacity-100" : "opacity-60"
											)}
										/>
									</span>
									<div className="flex w-4/5 text-left gap-0 overflow-hidden truncate text-sm">
										{tab.title}
									</div>
								</button>
							</li>
						</ul>
					))}
				</aside>
				<div className="m-3 p-3 h-44 w-48 select-none border rounded-xl flex flex-col items-center gap-3 justify-start relative">
					<div className="w-full flex flex-col items-center justify-start gap-3">
						<div className="font-semibold text-base text-left w-full text-slate-800">
							Upgrade to a Plan
						</div>

						<div className="text-sm text-left w-full text-slate-600">
							Unlock Higher Limits to Receive More Testimonials
						</div>
					</div>

					<div className="flex items-center gap-1">
						<Link href="#" className="w-full absolute bottom-4 left-[10px]">
							<div className="w-[90%] flex justify-center items-center gap-1 border-2 border-b-4 active:border-b-2 border-gray-300 rounded-lg px-2 py-1.5 font-medium text-sm bg-white transition-all duration-75">
								<span>Upgrade</span>
								<span>
									<ArrowUpRight className="size-4" />
								</span>
							</div>
						</Link>
					</div>
				</div>
			</main>
		</div>
	);
};

export default Sidebar;
