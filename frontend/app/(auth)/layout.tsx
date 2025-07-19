import type React from "react";
import ThemeToggle from "@/components/theme/theme-toggle";

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<main className='relative flex min-h-screen w-full font-inter'>
			{/* Theme Toggle - Top Right */}
			<div className='absolute top-4 right-4 z-50'>
				<ThemeToggle />
			</div>
			{/* Auth Content */}
			<div className='flex-1 flex items-center justify-center'>{children}</div>
		</main>
	);
}
