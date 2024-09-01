import Image from "next/image";
import Link from "next/link";
import remonial_wordmark_dark from "@/assets/brand/remonial_wordmark_dark.png";

export default async function AuthLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="flex flex-col min-h-screen">
			{/* navbar */}
			<nav className="absolute z-20 top-0 h-16 flex items-center justify-start px-12 bg-transparent">
				<Link href="/">
					<Image
						src={remonial_wordmark_dark}
						alt="remonials"
						width={200}
						height={100}
						className="aspect-auto pt-3"
					/>
				</Link>
			</nav>
			{children}
		</div>
	);
}
