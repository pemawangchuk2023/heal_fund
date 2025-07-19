import DesktopNavbar from "@/components/navigation/desktop-navbar";
import MobileNav from "@/components/navigation/mobile-navbar";
import React from "react";

const Navigation = () => {
	return (
		<nav className='pt-4 top-0 z-50 w-full border-b border-muted/50 bg-background/90 backdrop-blur'>
			<div className='w-full max-w-7xl'>
				{/* Desktop and Mobile Nav bars */}
				<div className='flex h-16 items-center justify-between px-4'>
					<DesktopNavbar />
				</div>
				<div className='md:hidden h-2 flex items-center justify-between px-2'>
					<MobileNav />
				</div>
			</div>
		</nav>
	);
};
export default Navigation;
