"use client";

import { motion } from "framer-motion";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { Navbar } from "@/components/Navbar";
import ShimmerButton from "@/components/magicui/shimmer-button";
import Link from "next/link";

export default function HomePage() {
	return (
		<AuroraBackground>
			<Navbar />
			<motion.div
				initial={{ opacity: 0.0, y: 40 }}
				whileInView={{ opacity: 1, y: 0 }}
				transition={{
					delay: 0.3,
					duration: 0.8,
					ease: "easeInOut",
				}}
				className="relative flex flex-col gap-4 items-center justify-center px-4"
			>
				<div className="text-3xl md:text-7xl font-bold text-white text-center">
					Simplify reviews, amplify your brand
				</div>
				<div className="font-extralight text-base md:text-4xl text-neutral-200 py-4">
					Make every opinion count
				</div>
				<Link href="/sign-up">
					<ShimmerButton className="shadow-2xl">
						<span className="whitespace-pre-wrap text-center text-sm font-medium leading-none tracking-tight text-white dark:from-white dark:to-slate-900/10 lg:text-lg">
							Get Started
						</span>
					</ShimmerButton>
				</Link>
			</motion.div>
		</AuroraBackground>
	);
}
