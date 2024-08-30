"use client";

import React, { useState } from "react";
import { HomeNav } from "@/app/(core)/_components/HomeNav";

export default function CoreLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);

	const toggleSidebar = () => {
		setIsSidebarOpen((prev) => !prev);
	};

	return (
		<main className="flex flex-col h-screen">
			<HomeNav toggleSidebar={toggleSidebar} />
			<div className="flex-1 overflow-hidden">
                {children}
			</div>
		</main>
	);
}
