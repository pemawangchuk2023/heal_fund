"use client";

import { useState } from "react";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navigationLinks } from "@/constants/navigationLinks";
import { cn } from "@/lib/utils";
import ThemeToggle from "@/components/theme/theme-toggle";

const MobileNav = () => {
	const [open, setOpen] = useState(false);
	const pathname = usePathname();

	const isActive = (href: string) => {
		return pathname === href || pathname.startsWith(`${href}/`);
	};

	return (
		<Sheet open={open} onOpenChange={setOpen}>
			<SheetTrigger asChild className='md:hidden'>
				<Button variant='ghost' size='icon' className='h-10 w-10 rounded-full'>
					<Image
						src={open ? "/assets/cross.png" : "/assets/menu.png"}
						alt={open ? "close menu" : "mobile menu"}
						width={26}
						height={26}
						className='invert dark:invert-0'
					/>
				</Button>
			</SheetTrigger>
			<SheetContent side='right' className='w-full sm:max-w-sm p-0 border-l'>
				<SheetHeader className='flex justify-between items-center p-4 border-b'>
					<div className='ml-4'>
						<ThemeToggle />
					</div>
				</SheetHeader>
				<div className='py-6 px-4 overflow-y-auto max-h-[calc(100vh-160px)] space-y-3'>
					{navigationLinks.map((link, index) => (
						<Link
							key={index}
							href={link.href}
							onClick={() => setOpen(false)}
							className={cn(
								"flex items-center px-4 py-3 font-bold text-[20px] rounded-none",
								isActive(link.href)
									? "text-amber-600 dark:text-amber-400 bg-amber-500/15"
									: "hover:bg-muted/50 text-foreground/80 hover:text-foreground hover:translate-x-1"
							)}
						>
							{link.label}
						</Link>
					))}
					<div className='mt-4 space-y-2'>
						<Button
							variant='ghost'
							size='lg'
							asChild
							className='w-full justify-start rounded-none font-bold text-[20px]'
						>
							<Link href='/?scroll=contribute' onClick={() => setOpen(false)}>
								Donate Now
							</Link>
						</Button>
						<Button
							size='lg'
							asChild
							variant='outline'
							className='w-full justify-start rounded-none font-bold text-[20px]'
						>
							<Link href='/sign-in' onClick={() => setOpen(false)}>
								Start Campaign
							</Link>
						</Button>
					</div>
				</div>
			</SheetContent>
		</Sheet>
	);
};

export default MobileNav;
