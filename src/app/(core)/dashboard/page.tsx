"use client";

import { useSession, signIn, signOut } from "next-auth/react";

const DashboardPage = () => {
	const { data: session } = useSession();
	if (session) {
		return (
			<>
				<div className="p-5">
					<span className="font-serif text-3xl">feedbloom | Dashboard</span>
					<br />
					Signed in as <span className="italic ">{session.user.email}</span> <br />
					<button
						onClick={() => signOut()}
						className="px-3 py-2 bg-zinc-800 rounded-lg text-white"
					>
						Sign out
					</button>
				</div>
			</>
		);
	}
	return (
		<>
			<div className="p-5">
				<span className="font-serif text-3xl">feedbloom | Dashboard</span>
				Not signed in
				<br />
				<button
					onClick={() => signIn()}
					className="px-3 py-2 bg-zinc-800 rounded-lg text-white"
				>
					Sign in
				</button>
			</div>
		</>
	);
};

export default DashboardPage;
