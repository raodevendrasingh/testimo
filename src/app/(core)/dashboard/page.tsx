"use client";

import { useSidebar } from "@/context/SidebarContext";
import { useState } from "react";
import Sidebar from "../_components/Sidebar";
import ArchivesPage from "./archives/page";
import ComponentsPage from "./components/page";
import CustomizePage from "./customize/page";
import ExportsPage from "./exports/page";
import InsightsPage from "./insights/page";
import ProfilePage from "./profile/page";
import TestimonialPage from "./testimonials/page";

const tabComponents = [
	ProfilePage,
	TestimonialPage,
	ExportsPage,
	ArchivesPage,
	ComponentsPage,
	CustomizePage,
	InsightsPage,
];

const DashboardPage: React.FC = () => {
	const { isSidebarOpen, toggleSidebar } = useSidebar();
	const [selectedTab, setSelectedTab] = useState<number>(0);

	const SelectedComponent = tabComponents[selectedTab];

	return (
		<div className="flex h-[calc(100vh-3.5rem)]">
			<Sidebar
				isOpen={isSidebarOpen}
				selectedTab={selectedTab}
				setSelectedTab={setSelectedTab}
				toggleSidebar={toggleSidebar}
			/>
			<main className="flex-1 overflow-auto lg:ml-64">
				<SelectedComponent />
			</main>
		</div>
	);
};

export default DashboardPage;
