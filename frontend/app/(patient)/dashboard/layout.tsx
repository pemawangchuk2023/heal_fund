"use client";

import LeftSidebar from "@/app/(patient)/dashboard/components/sidebar/leftsidebar";
import { useState } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
	const [isCollapsed, setIsCollapsed] = useState(false);

	return (
		<div className='flex overflow-hidden'>
			{/* Left Sidebar */}
			<div className='fixed top-0 left-0 h-screen z-50 transition-all duration-300'>
				<LeftSidebar
					isCollapsed={isCollapsed}
					setIsCollapsed={setIsCollapsed}
				/>
			</div>

			{/* Right Sidebar */}
			{/* <div className='fixed top-0 right-0 h-screen w-64 z-40 border-l'>
				<RightSidebar />
			</div> */}

			{/* Main Content */}
			<main
				className={`
					transition-all duration-300 flex-1 overflow-y-auto
					${isCollapsed ? "ml-20" : "ml-72"} mr-12
				`}
			>
				{children}
			</main>
		</div>
	);
}
