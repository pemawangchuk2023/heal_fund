"use client";

import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Copy, Wallet, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import { Input } from "@/components/ui/input";

declare global {
	interface Window {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		ethereum?: any;
	}
}

const WalletConnection = () => {
	const [currentAccount, setCurrentAccount] = useState<string | null>(null);
	const [isConnecting, setIsConnecting] = useState(false);
	const [isChecking, setIsChecking] = useState(true);

	const connectWallet = async () => {
		if (!window.ethereum) {
			toast.error("Please install MetaMask to connect your wallet.");
			return;
		}
		setIsConnecting(true);
		try {
			const provider = new ethers.BrowserProvider(window.ethereum);
			await window.ethereum.request({ method: "eth_requestAccounts" });
			const signer = await provider.getSigner();
			const address = await signer.getAddress();
			setCurrentAccount(address);
			toast.success("Successfully connected to your wallet.");
		} catch (error) {
			console.error("Error connecting wallet:", error);
			toast.error("Failed to connect to your wallet. Please try again.");
		} finally {
			setIsConnecting(false);
		}
	};

	const disconnectWallet = async () => {
		if (window.ethereum?.request) {
			try {
				await window.ethereum.request({
					method: "wallet_revokePermissions",
					params: [{ eth_accounts: {} }],
				});
			} catch (err) {
				console.log("It could not revoke permissions:", err);
			}
		}
		setCurrentAccount(null);
		toast.success("Your wallet has been disconnected successfully.");
	};

	const copyAddress = async () => {
		if (!currentAccount) return;
		try {
			await navigator.clipboard.writeText(currentAccount);
			toast.success("Copied!", {
				description: "You have copied the address successfully!",
				icon: <CheckCircle className='h-5 w-5 text-green-500' />,
				duration: 3000,
			});
		} catch {
			toast.error("Failed to copy the wallet address. Try again.");
		}
	};

	useEffect(() => {
		const checkConnection = async () => {
			if (window.ethereum) {
				try {
					const provider = new ethers.BrowserProvider(window.ethereum);
					const accounts = await provider.listAccounts();
					if (accounts.length > 0) {
						setCurrentAccount(accounts[0].address);
					}
				} catch (error) {
					console.error("Error checking wallet connection:", error);
				}
			}
			setIsChecking(false);
		};
		checkConnection();

		// listen for account changes
		const handleAccountsChanged = (accounts: string[]) => {
			if (accounts.length === 0) {
				setCurrentAccount(null);
				toast("Account disconnected in MetaMask.", { icon: <AlertCircle /> });
			} else {
				setCurrentAccount(accounts[0]);
				toast("Account changed.", { icon: <CheckCircle /> });
			}
		};
		if (window.ethereum?.on) {
			window.ethereum.on("accountsChanged", handleAccountsChanged);
		}
		return () => {
			if (window.ethereum?.removeListener) {
				window.ethereum.removeListener(
					"accountsChanged",
					handleAccountsChanged
				);
			}
		};
	}, []);

	if (isChecking) {
		return (
			<div className='flex min-h-screen items-center justify-center p-4 bg-background'>
				<Card className='w-full max-w-sm'>
					<CardContent className='flex items-center justify-center p-6'>
						<Loader2 className='h-6 w-6 animate-spin' />
						<span className='ml-2'>Checking wallet connection...</span>
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<div className='flex min-h-screen items-center justify-center p-4 bg-background'>
			<div className='w-full max-w-sm'>
				<CardHeader className='text-center'>
					<div className='flex items-center justify-center mb-2'>
						<Image
							src='/assets/metamask.png'
							alt='metamask'
							height={125}
							width={125}
						/>
					</div>
					<CardTitle className='text-2xl font-bold'>
						Wallet Connection
					</CardTitle>
					<CardDescription className='text-muted-foreground'>
						{currentAccount
							? "Your Wallet Is Connected"
							: "Connect your wallet to get started"}
					</CardDescription>
				</CardHeader>
				<CardContent className='space-y-6'>
					{currentAccount ? (
						<div className='space-y-4'>
							<div className='flex items-center justify-center'>
								<Badge
									variant='default'
									className='flex text-base items-center gap-2 px-3 py-2 text-green-500 font-bold'
								>
									<CheckCircle className='h-4 w-4' />
									Connected
								</Badge>
							</div>
							<Separator />
							<div className='space-y-2'>
								<label
									htmlFor='wallet-address'
									className='text-sm font-bold text-foreground'
								>
									Public Key / Wallet Address
								</label>
								<div className='flex items-center space-x-2'>
									<Input
										id='wallet-address'
										type='text'
										value={currentAccount}
										readOnly
										className='flex-1 rounded-none border-red'
									/>
									<Button variant='ghost' size='icon' onClick={copyAddress}>
										<Copy className='h-4 w-4' />
									</Button>
								</div>
							</div>
							<Button
								variant='destructive'
								onClick={disconnectWallet}
								className='w-full rounded-none'
							>
								Disconnect Wallet
							</Button>
						</div>
					) : (
						<div className='space-y-4'>
							<div className='flex items-center justify-center'>
								<Badge
									variant='secondary'
									className='flex items-center gap-2 px-3 py-2 text-orange-500'
								>
									<AlertCircle className='h-4 w-4' />
									Not Connected
								</Badge>
							</div>
							<Separator />
							<div className='text-center font-semibold text-yellow-600'>
								Connect your MetaMask wallet to access Web3 features
							</div>
							<Button
								onClick={connectWallet}
								disabled={isConnecting}
								className='w-full'
								variant='default'
							>
								{isConnecting ? (
									<>
										<Loader2 className='mr-2 h-4 w-4 animate-spin' />
										Connecting...
									</>
								) : (
									<>
										<Wallet className='mr-2 h-4 w-4' />
										Connect Wallet
									</>
								)}
							</Button>
						</div>
					)}
				</CardContent>
			</div>
		</div>
	);
};

export default WalletConnection;
