"use client";

import { User } from "next-auth";
import { useSession, signIn, signOut } from "next-auth/react";
import Image from "next/image";
import emptyLogo from "@/assets/emptyLogo.png";

const DashboardPage = () => {
	const { data: session } = useSession();

	const user = session?.user as User;

	return (
		<>
			<div className="w-full bg-gray-100 border-b h-44 px-5 md:px-12 lg:px-28">
				<div className="flex justify-between items-center h-full">
					<div className="flex items-center gap-5">
						<div>
							<Image src={emptyLogo} alt="" width={112} />
						</div>
						<div className="flex flex-col gap-2">
							<div className="text-4xl md:text-5xl">{user?.username || user?.email}</div>
                            <div className="text-base">Lorem ipsum dolor sit amet.</div>
						</div>
					</div>
					<div className="p-3">Toggle</div>
				</div>
			</div>
		</>
	);
};

export default DashboardPage;
