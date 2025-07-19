import Navigation from "@/components/navigation/navigation";
import React from "react";

const RootLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<div className='flex min-h-screen flex-col'>
			<Navigation />
			{children}
		</div>
	);
};

export default RootLayout;
