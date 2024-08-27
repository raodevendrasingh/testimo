"use client";

import { useState } from "react";
import Sidebar, { tabsData } from "../_components/Sidebar";

const DashboardPage = () => {
	const [selectedTab, setSelectedTab] = useState<number>(0);

	return (
		<div className="flex">
			<Sidebar selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
			<main className="flex-grow mx-auto w-full">
				<div>{tabsData[selectedTab].content}</div>
			</main>
		</div>
	);
};

export default DashboardPage;
