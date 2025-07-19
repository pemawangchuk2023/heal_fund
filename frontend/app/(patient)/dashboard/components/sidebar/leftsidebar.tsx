"use client";
import type React from "react";
import ThemeToggle from "@/components/theme/theme-toggle";
import { ScrollArea } from "@/components/ui/scroll-area";
import { navItems } from "@/constants/navitems";
import { cn } from "@/lib/utils";
import { ChevronRight, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import SignOutButton from "@/app/(patient)/dashboard/components/sidebar/sign-out-button";

type LeftSidebarProps = {
	isCollapsed: boolean;
	setIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
};

const LeftSidebar = ({ isCollapsed, setIsCollapsed }: LeftSidebarProps) => {
	const pathname = usePathname();

	return (
		<aside
			className={cn(
				"flex h-screen border-r transition-all duration-300 flex-shrink-0 flex-col bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
				isCollapsed ? "w-16" : "w-72"
			)}
		>
			{/* Header */}
			<div className='p-4 border-b bg-background/50'>
				<div className='flex items-center justify-between'>
					{!isCollapsed && (
						<Link href='/dashboard' className='group'>
							<h2 className='text-lg font-bold text-foreground group-hover:text-primary transition-colors'>
								HealFund Portal
							</h2>
						</Link>
					)}
					<div className='flex items-center gap-1'>
						{!isCollapsed && <ThemeToggle />}
						<button
							onClick={() => setIsCollapsed(!isCollapsed)}
							className='p-2 hover:bg-muted rounded-lg transition-all duration-200 hover:scale-105 active:scale-95'
							aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
						>
							{isCollapsed ? (
								<ChevronRight className='h-4 w-4' />
							) : (
								<ChevronLeft className='h-4 w-4' />
							)}
						</button>
					</div>
				</div>
			</div>

			{/* Navigation */}
			<ScrollArea className='flex-1 px-2'>
				<div className='py-4 space-y-1'>
					{navItems.map((item) => {
						const isActive = pathname === item.href;
						return (
							<Link key={item.href} href={item.href} className='block'>
								<div
									className={cn(
										"flex items-center p-3 rounded-xl transition-all duration-200 group relative",
										isActive
											? "bg-primary/10 text-primary border border-primary/20 shadow-sm"
											: "hover:bg-muted hover:scale-[1.02] active:scale-[0.98]",
										isCollapsed && "justify-center p-2"
									)}
								>
									<item.icon
										className={cn(
											"h-5 w-5 flex-shrink-0 transition-colors",
											isActive
												? "text-primary"
												: "text-muted-foreground group-hover:text-foreground",
											isCollapsed && "h-6 w-6"
										)}
									/>

									{!isCollapsed && (
										<>
											<span className='ml-3 font-medium transition-colors'>
												{item.name}
											</span>
											{isActive && (
												<ChevronRight className='h-4 w-4 ml-auto text-primary' />
											)}
										</>
									)}

									{/* Tooltip for collapsed state */}
									{isCollapsed && (
										<div className='absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground text-sm rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50'>
											{item.name}
										</div>
									)}
								</div>
							</Link>
						);
					})}
				</div>
			</ScrollArea>

			{/* Sign Out Section */}
			<div
				className={cn(
					"p-4 border-t bg-background/50 mt-auto",
					isCollapsed && "p-2"
				)}
			>
				<SignOutButton isCollapsed={isCollapsed} />
			</div>
		</aside>
	);
};

export default LeftSidebar;
