"use client";

import Footer from "@/components/Footer";
import { MarqueeSection } from "@/components/MarqueeSection";
import { Navbar } from "@/components/Navbar";
import ShimmerButton from "@/components/magicui/shimmer-button";
import Link from "next/link";

export default function HomePage() {
	return (
		<>
			<Navbar />
			<div className="relative min-h-screen select-none flex w-full flex-col items-center justify-center overflow-hidden bg-black">
				<div className="absolute inset-0 z-0 bg-[#000000] bg-[radial-gradient(#ffffff33_1px,#0f0f0f_1px)] bg-[size:25px_25px]" />
				<div className="relative z-10 flex flex-col items-center max-w-5xl w-full px-4 text-center">
					<h1 className="mb-6 text-5xl md:text-7xl lg:text-8xl font-bold text-transparent bg-clip-text bg-linear-to-r from-blue-400 via-indigo-500 to-rose-500 flex flex-col">
						<span className="sm:whitespace-nowrap">Authentic Praise</span>
						<span className="sm:whitespace-nowrap">Effortlessly Captured</span>
					</h1>
					<p className="mb-10 text-2xl md:text-3xl lg:text-4xl font-medium text-gray-300">
						Collecting and sharing praise has never been easier.
					</p>
					<Link href="/sign-up">
						<ShimmerButton className="shadow-2xl hover:scale-105 transition-all duration-300">
							<span className="px-2 py-1 whitespace-pre-wrap text-center text-sm font-medium leading-none tracking-tight text-white dark:from-white dark:to-slate-900/10 lg:text-lg">
								Get Started
							</span>
						</ShimmerButton>
					</Link>
					<p className="mt-6 text-sm text-gray-400">No credit card required</p>
				</div>
			</div>
			<MarqueeSection />
			<Footer />
		</>
	);
}
