import { HomeNav } from "@/app/(core)/_components/HomeNav";

export default async function CoreLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<main className="flex flex-col">
            <HomeNav/>
			{children}
		</main>
	);
}
