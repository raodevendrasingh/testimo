import Image from "next/image";
import Link from "next/link";
import testimo_wordmark_dark from "@/assets/brand/testimo_wordmark_dark.png";

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className="flex flex-col min-h-screen">
			<nav className="absolute z-20 top-0 h-16 flex items-center justify-start px-12 bg-transparent">
				<Link href="/">
					<Image
						src={testimo_wordmark_dark}
						alt="testimo"
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
