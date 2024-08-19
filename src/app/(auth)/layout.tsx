import Link from "next/link";

export default async function AuthLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="flex flex-col min-h-screen">
			{/* navbar */}
			<nav className="absolute top-0 h-16 flex items-center justify-start px-12 bg-transparent">
				<span className="text-3xl font-extrabold text-black">
					<Link href="/">critiqly</Link>
				</span>
			</nav>
			{children}
		</div>
	);
}
