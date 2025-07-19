import type { Metadata } from "next";
import "./globals.css";
import ThemeProvider from "@/components/theme/theme-provider";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
	title: "HealFund Application",
	description:
		"The smart contract designed for the patient who looks for the fund support",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='en'>
			<body className={`antialiased`}>
				<ThemeProvider
					attribute='class'
					defaultTheme='system'
					enableSystem
					disableTransitionOnChange
				>
					<Toaster />
					{children}
				</ThemeProvider>
			</body>
		</html>
	);
}
