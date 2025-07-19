import DesktopNavbar from "@/components/navigation/desktop-navbar";
import React from "react";

const Navigation = () => {
	return (
		<nav className='pt-8 top-0 z-50 w-full border-b border-muted/50 bg-background/90 backdrop-blur'>
			<div className='w-full max-w-7xl'>
				{/* Desktop and Mobile Nav bars */}
				<div className='flex h-16 items-center justify-between px-4'>
					<DesktopNavbar />
					{/* <MobileNavbar /> */}
				</div>
			</div>
		</nav>
	);
};
export default Navigation;
