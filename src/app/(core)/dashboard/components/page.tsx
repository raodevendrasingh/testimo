"use client";

import { StarsCodeBlock } from "@/utils/StarsCodeBlock";

const ComponentsPage = () => {
	return (
		<div className="w-full mx-auto scrollbar-hide">
			<div className="max-w-6xl mx-auto lg:ml-72 w-full">
				<div className="flex gap-2 max-w-5xl h-[calc(100vh-58px)] mx-auto p-3 w-full pr-16 border-r">
					{/* stars block */}
					<StarsCodeBlock />
				</div>
			</div>
		</div>
	);
};

export default ComponentsPage;
