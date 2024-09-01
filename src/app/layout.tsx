import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/context/AuthProvider";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Remonials",
	description: "Collecting Testimonials and Endorsements made easy",
	icons: {
		icon: [
			{ url: "/favicon-light.ico" },
			{ url: "/favicon-dark.ico" },
			{ url: "/favicon-light-16x16.png", sizes: "16x16" },
			{ url: "/favicon-dark-16x16.png", sizes: "16x16" },
			{ url: "/favicon-light-32x32.png", sizes: "32x32" },
			{ url: "/favicon-dark-32x32.png", sizes: "32x32" },
			{ url: "/android-chrome-light-192x192.png", sizes: "192x192" },
			{ url: "/android-chrome-dark-192x192.png", sizes: "192x192" },
			{ url: "/android-chrome-light-512x512.png", sizes: "512x512" },
			{ url: "/android-chrome-dark-512x512.png", sizes: "512x512" },
		],
		apple: [
			{ url: "/apple-touch-icon-light.png" },
			{ url: "/apple-touch-icon-dark.png" },
		],
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<AuthProvider>
				<body className={inter.className}>
					{children}
					<Toaster position="top-center" />
				</body>
			</AuthProvider>
		</html>
	);
}
