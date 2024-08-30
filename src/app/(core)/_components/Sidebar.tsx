"use client";

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
import Link from "next/link";
import { useSidebar } from "@/context/SidebarContext";

type Tab = {
	title: string;
	icon: LucideIcon;
	disabled?: boolean;
};

export const tabsData: Tab[] = [
	{ title: "Profile", icon: User2 },
	{ title: "Testimonials", icon: Rows3 },
	{ title: "Exports", icon: FolderInput },
	{ title: "Archives", icon: Archive },
	{ title: "Components", icon: Braces },
	{ title: "Customize Page", icon: LayoutTemplate, disabled: true },
	{ title: "Insights", icon: ChartArea, disabled: true },
];

type SidebarProps = {
	isOpen: boolean;
	selectedTab: number;
	setSelectedTab: (index: number) => void;
	toggleSidebar: () => void;
};

const Sidebar: React.FC<SidebarProps> = ({ selectedTab, setSelectedTab }) => {
	const { isSidebarOpen, toggleSidebar } = useSidebar();

	return (
		<>
			{isSidebarOpen && (
				<div
					className="fixed inset-0 z-20 lg:hidden"
					onClick={toggleSidebar}
				></div>
			)}
			<aside
				className={`fixed left-0 top-14 h-[calc(100vh-3.5rem)] w-64 bg-white border-r transition-transform duration-300 ease-in-out z-30 ${
					isSidebarOpen ? "translate-x-0" : "-translate-x-full"
				} lg:translate-x-0`}
			>
				<nav className="h-full flex flex-col justify-between py-4">
					<ul className="space-y-2 px-3">
						{tabsData.map((tab, idx) => (
							<li key={idx}>
								<button
									onClick={() => !tab.disabled && setSelectedTab(idx)}
									className={cn(
										"flex w-full items-center rounded-md py-2.5 px-3 text-sm text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-800 focus:bg-slate-100",
										tab.disabled && "cursor-not-allowed opacity-50",
										selectedTab === idx && "bg-slate-100 text-slate-800"
									)}
									disabled={tab.disabled}
								>
									<tab.icon
										className={cn(
											"mr-3 size-5",
											selectedTab === idx ? "opacity-100" : "opacity-60"
										)}
									/>
									<span className="truncate">{tab.title}</span>
								</button>
							</li>
						))}
					</ul>
					<div className="px-3 ">
						<div className="p-4 h-40 border rounded-xl">
							<h3 className="font-semibold text-base mb-2">
								Upgrade to Premium
							</h3>
							<p className="text-xs text-slate-600 mb-3">
								Unlock Higher Limits to Receive More Testimonials
							</p>
							<div className="flex items-center gap-1">
								<Link
									href="#"
									className="w-full absolute bottom-8 left-[10px] px-3"
								>
									<div className="w-[90%] flex justify-center items-center gap-1 border-2 border-b-4 active:border-b-2 border-gray-300 rounded-lg px-2 py-1.5 font-medium text-sm bg-white transition-all duration-75">
										<span>Upgrade</span>
										<span>
											<ArrowUpRight className="size-4" />
										</span>
									</div>
								</Link>
							</div>
						</div>
					</div>
				</nav>
			</aside>
		</>
	);
};

export default Sidebar;
