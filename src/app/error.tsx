"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ErrorPage({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	useEffect(() => {
		console.error(error);
	}, [error]);

	return (
		<div className="flex flex-col items-center justify-center min-h-screen p-4">
			<h2 className="text-2xl font-bold mb-4">Something went wrong!</h2>
			<Button onClick={() => reset()} className="mb-4">
				Try again
			</Button>
			<Link href="/">
				<Button variant="outline">Return home</Button>
			</Link>
		</div>
	);
}
