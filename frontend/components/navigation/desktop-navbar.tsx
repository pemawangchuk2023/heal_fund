"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuList,
	NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import { navigationLinks } from "@/constants/navigationLinks";
import ThemeToggle from "@/components/theme/theme-toggle";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

const DesktopNavbar = () => {
	const { theme } = useTheme();
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) return null;

	const logo = theme === "dark" ? "/assets/logo2.png" : "/assets/logo.png";

	return (
		<nav className='hidden md:flex items-center justify-between w-full px-6 py-4 bg-background/80 backdrop-blur-md border-b border-border/40 sticky top-0 z-50'>
			{/* Logo */}
			<div className='flex items-center gap-3'>
				<Link href='/' className='flex items-center gap-3 group'>
					<div className='relative'>
						<Image
							src={logo}
							alt='Heal Fund logo'
							width={125}
							height={125}
							className='rounded-xl'
						/>
					</div>
				</Link>
			</div>

			{/* Navigation Links */}
			<NavigationMenu>
				<NavigationMenuList className='gap-1'>
					{navigationLinks.map((link, index) => (
						<NavigationMenuItem key={index}>
							<NavigationMenuLink asChild>
								<Link
									href={link.href}
									className='group inline-flex h-10 w-max items-center justify-center px-4 py-2 text-[20px] font-bold'
								>
									{link.label}
								</Link>
							</NavigationMenuLink>
						</NavigationMenuItem>
					))}
				</NavigationMenuList>
			</NavigationMenu>

			{/* Right Side Actions */}
			<div className='flex items-center gap-3'>
				<Button variant='ghost' size='lg' asChild className='font-bold'>
					<Link href='/?scroll=contribute' className='text-[20px]'>
						Donate Now
					</Link>
				</Button>
				<Button
					size='sm'
					asChild
					variant='destructive'
					className='rounded-none py-6 font-bold'
				>
					<Link href='/sign-in'>Start Campaign</Link>
				</Button>
				<div className='h-6' />
				<ThemeToggle />
			</div>
		</nav>
	);
};

export default DesktopNavbar;
