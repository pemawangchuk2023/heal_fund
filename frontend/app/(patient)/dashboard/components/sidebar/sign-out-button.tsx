"use client";

import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface SignOutButtonProps {
	isCollapsed: boolean;
}

const SignOutButton = ({ isCollapsed }: SignOutButtonProps) => {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);

	const handleSignOut = async () => {
		try {
			setIsLoading(true);
			await signOut({ redirect: false });
			router.push("/sign-in");
		} catch (error) {
			console.error("Sign out error:", error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Button
			variant='ghost'
			className={cn(
				"flex items-center w-full p-3 rounded-xl cursor-pointer transition-colors text-foreground",
				isCollapsed && "justify-center"
			)}
			onClick={handleSignOut}
			disabled={isLoading}
		>
			<LogOut className='h-5 w-5 flex-shrink-0' />
			{!isCollapsed && (
				<span className='ml-3 font-medium text-[18px]'>
					{isLoading ? "Signing Out..." : "Sign Out"}
				</span>
			)}
		</Button>
	);
};

export default SignOutButton;
