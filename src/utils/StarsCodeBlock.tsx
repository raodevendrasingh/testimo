"use client";

export const StarBlock = `/* 
    Paste this code on the following path
    @/components/ui/Stars 
*/

export const Stars = ({ rating }: { rating: number }) => {
    return (
        <span className="text-yellow-300 text-base flex">
            {Array.from({ length: rating }).map((_, index) => (
                <span key={index} className="text-xl">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="size-6"
                    >
                        <path
                        fillRule="evenodd"
                        d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
                        clipRule="evenodd"
                        />
                    </svg>
                </span>
            ))}
        </span>
    );
};`;

import { Stars } from "@/components/ui/Stars";
import { ExportStarDialog } from "@/utils/ExportStarDialog";
import { useState } from "react";

export const StarsCodeBlock = () => {
	const [isStarDialogOpen, setIsStarDialogOpen] = useState(false);
	return (
		<>
			<div
				className="flex items-start justify-start p-2 h-32 w-44 bg-slate-50 rounded-md border cursor-pointer"
				onClick={() => setIsStarDialogOpen(true)}
			>
				<div className="flex flex-col justify-evenly gap-2 pt-1 pb-2 w-full h-full">
					<div className="flex gap-2 text-lg">Stars</div>
					<Stars rating={4} />
				</div>
			</div>
			<ExportStarDialog
				isOpen={isStarDialogOpen}
				onOpenChange={setIsStarDialogOpen}
			/>
		</>
	);
};
