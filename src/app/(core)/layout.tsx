import { HomeNav } from "@/app/(core)/_components/HomeNav";

export default async function CoreLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="flex flex-col min-h-screen">
            <HomeNav/>
			{children}
		</div>
	);
}
