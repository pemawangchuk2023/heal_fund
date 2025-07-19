"use client";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CopyIcon } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

interface UserCardProps {
	user: {
		email: string;
		name: string;
		age: number;
		sex: string;
		cid: string;
		publicKey: string;
		location: string;
		contactNumber: number;
	};
}

const UserCard = ({ user }: UserCardProps) => {
	const copyToClipboard = (text: string) => {
		navigator.clipboard.writeText(text);
		toast.success("Copied to clipboard");
	};

	return (
		<div className='w-full'>
			<CardHeader className='flex flex-row items-center gap-4 pb-4'>
				<div className='space-y-1'>
					<CardTitle className='text-lg font-semibold'>{user.name}</CardTitle>
					<div className='flex items-center gap-2 text-sm text-muted-foreground'>
						<Badge variant='outline' className='font-normal'>
							{user.age} years
						</Badge>
						<Badge variant='outline' className='font-normal'>
							{user.sex}
						</Badge>
					</div>
				</div>
			</CardHeader>
			<CardContent className='space-y-4'>
				{/* Personal Information */}
				<div className='space-y-2'>
					<h3 className='text-sm font-medium text-muted-foreground flex items-center gap-2'>
						Personal Information
					</h3>
					<div className='grid grid-cols-4 gap-4'>
						<div className='space-y-1'>
							<p className='text-xs text-muted-foreground'>Citizen ID</p>
							<div className='flex items-center gap-1'>
								<p className='text-sm font-medium'>{user.cid}</p>
								<Button
									variant='ghost'
									size='icon'
									className='h-4 w-4 cursor-pointer'
									onClick={() => copyToClipboard(user.cid)}
								>
									<CopyIcon className='h-3 w-3' />
								</Button>
							</div>
						</div>
						<div className='space-y-1'>
							<p className='text-xs text-muted-foreground'>Age</p>
							<p className='text-sm font-medium'>{user.age}</p>
						</div>
						<div className='space-y-1'>
							<p className='text-xs text-muted-foreground'>Sex</p>
							<p className='text-sm font-medium'>{user.sex}</p>
						</div>
					</div>
				</div>
				{/* Contact Information */}
				<div className='space-y-2'>
					<h3 className='text-sm font-medium text-muted-foreground flex items-center gap-2'>
						Contact Information
					</h3>
					<div className='space-y-1'>
						<p className='text-xs text-muted-foreground'>Email</p>
						<div className='flex items-center gap-1'>
							<p className='text-sm font-medium'>{user.email}</p>
							<Button
								variant='ghost'
								size='icon'
								className='h-4 w-4 cursor-pointer'
								onClick={() => copyToClipboard(user.email)}
							>
								<CopyIcon className='h-3 w-3' />
							</Button>
						</div>
					</div>
					<div className='space-y-1'>
						<p className='text-xs text-muted-foreground'>Phone</p>
						<div className='flex items-center gap-1'>
							<p className='text-sm font-medium'>{user.contactNumber}</p>
						</div>
					</div>
					<div className='space-y-1'>
						<p className='text-xs text-muted-foreground'>Location</p>
						<div className='flex items-center gap-1'>
							<p className='text-sm font-medium'>{user.location}</p>
						</div>
					</div>
				</div>
				{/* Wallet Information */}
				<div className='space-y-2'>
					<h3 className='text-sm font-medium text-muted-foreground flex items-center gap-2'>
						<Image
							src='/assets/metamask.png'
							alt='metamask'
							height={75}
							width={75}
						/>
						Wallet Address
					</h3>
					<div className='flex items-center gap-2'>
						<p className='text-sm font-mono truncate'>{user.publicKey}</p>
						<Button
							variant='ghost'
							size='icon'
							className='h-6 w-6 cursor-pointer'
							onClick={() => copyToClipboard(user.publicKey)}
						>
							<CopyIcon className='h-3 w-3' />
						</Button>
					</div>
				</div>
			</CardContent>
		</div>
	);
};

export default UserCard;
