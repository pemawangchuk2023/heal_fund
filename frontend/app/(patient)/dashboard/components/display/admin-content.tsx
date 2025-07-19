"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Copy, MoreHorizontal, User, Check, X, CheckCircle } from "lucide-react"
import Image from "next/image"
import { toast } from "sonner"
import { useHealFund } from "@/context/heal-fund-provider"
import Link from "next/link"
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const AdminContent = () => {
	const {
		appeals,
		approveHealthAppeal,
		rejectFundSupportRequest,
		fetchAppeals,
		currentAccount,
	} = useHealFund()
	const [loading, setLoading] = useState(true)
	const [hasFetched, setHasFetched] = useState(false)
	const [selectedDescription, setSelectedDescription] = useState("")
	const [isDescriptionDialogOpen, setIsDescriptionDialogOpen] = useState(false)
	const router = useRouter()

	useEffect(() => {
		if (!hasFetched && currentAccount) {
			const loadAppeals = async () => {
				try {
					console.log("Starting to fetch appeals...")
					await fetchAppeals()
					console.log("Finished fetching appeals")
					setHasFetched(true)
					setLoading(false)
				} catch (error) {
					console.error("Failed to load appeals:", error)
					setLoading(false)
				}
			}
			loadAppeals()
		}
	}, [fetchAppeals, currentAccount, hasFetched])

	const copyAddress = async (address: string) => {
		if (address) {
			try {
				await navigator.clipboard.writeText(address)
				toast.success("Copied!", {
					description: "You Have Copied Successfully!",
					icon: <CheckCircle className="h-5 w-5 text-green-500" />,
					duration: 3000,
				})
			} catch {
				toast.error("Failed to copy the wallet address. Try again")
			}
		}
	}

	const handleDescriptionClick = (description: string) => {
		setSelectedDescription(description)
		setIsDescriptionDialogOpen(true)
	}

	const handleApprove = async (index: number) => {
		try {
			await approveHealthAppeal(index)
			toast.success("Appeal Approved!", {
				description: "The appeal has been successfully approved.",
				duration: 3000,
			})
			await fetchAppeals()
		} catch (error) {
			toast.error("Failed to approve appeal. Try again.")
			console.error("Error approving appeal:", error)
		}
	}

	const handleReject = async (index: number) => {
		try {
			await rejectFundSupportRequest(index)
			toast.success("Appeal Rejected!", {
				description: "The appeal has been successfully rejected.",
				duration: 3000,
			})
			router.push("/dashboard/appeal")
		} catch (error) {
			toast.error("Failed to reject appeal. Try again.")
			console.error("Error rejecting appeal:", error)
		}
	}

	// Filter out approved appeals
	const pendingAppeals = appeals.filter((appeal) => !appeal.endorsed)

	if (loading) {
		return (
			<div className="flex min-h-screen w-full items-center justify-center bg-background">
				<div className="text-center">
					<Image
						src="/assets/loader.gif"
						alt="loader"
						width={300}
						height={300}
						className="mx-auto animate-spin"
						unoptimized={true}
						priority={true}
					/>
					<p className="mt-4 text-foreground">Fetching the latest appeals...</p>
				</div>
			</div>
		)
	}
	return (
		<div className="flex w-full flex-col mb-2">
			<div className="container mx-auto flex-1 space-y-6 p-4 md:p-8">
				<h1 className="text-2xl font-bold tracking-tight md:text-3xl">
					Pending Health Appeals
				</h1>
				{pendingAppeals.length === 0 ? (
					<Card className="flex flex-col items-center justify-center py-20 text-center shadow-sm">
						<CardContent className="flex flex-col items-center justify-center p-0">
							<User className="mx-auto mb-4 size-16 text-gray-400" />
							<h3 className="mb-2 text-xl font-semibold text-foreground">
								No Pending Proposals Found
							</h3>
							<p className="text-muted-foreground">
								New proposals will appear here when submitted.
							</p>
						</CardContent>
					</Card>
				) : (
					<Card className="overflow-hidden shadow-sm">
						<CardHeader className="px-6 py-4">
							<CardTitle className="text-lg font-semibold">
								Appeals Overview
							</CardTitle>
						</CardHeader>
						<CardContent className="p-0">
							<div className="overflow-x-auto">
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead className="w-[50px]">
												<Checkbox />
											</TableHead>
											<TableHead className="text-xs uppercase tracking-wider text-muted-foreground">
												NAME
											</TableHead>
											<TableHead className="text-xs uppercase tracking-wider text-muted-foreground">
												DESCRIPTION
											</TableHead>
											<TableHead className="text-xs uppercase tracking-wider text-muted-foreground">
												PUBLIC KEY
											</TableHead>
											<TableHead className="text-xs uppercase tracking-wider text-muted-foreground">
												AMOUNT
											</TableHead>
											<TableHead className="text-xs uppercase tracking-wider text-muted-foreground">
												TARGET DATE
											</TableHead>
											<TableHead className="text-xs uppercase tracking-wider text-muted-foreground">
												UPLOADED FILE
											</TableHead>
											<TableHead className="text-right text-xs uppercase tracking-wider text-muted-foreground">
												ACTIONS
											</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{pendingAppeals.map((appeal, index) => (
											<TableRow
												key={index}
												className="hover:bg-muted/50 transition-colors"
											>
												<TableCell>
													<Checkbox />
												</TableCell>
												<TableCell className="font-medium">
													{appeal.purpose}
												</TableCell>
												<TableCell>
													<Button
														variant="destructive"
														size="sm"
														onClick={() =>
															handleDescriptionClick(appeal.description)
														}
														className="border-2 border-green-500 rounded-2 cursor-pointer"
													>
														Read Application
													</Button>
												</TableCell>
												<TableCell>
													<div className="flex items-center gap-2">
														<span className="truncate max-w-[100px] md:max-w-[150px]">
															{appeal.patient.substring(0, 8)}...
															{appeal.patient.substring(
																appeal.patient.length - 4
															)}
														</span>
														<Button
															variant="ghost"
															size="icon"
															className="size-6 cursor-pointer"
															onClick={() => copyAddress(appeal.patient)}
														>
															<Copy className="size-4" />
															<span className="sr-only">Copy PK</span>
														</Button>
													</div>
												</TableCell>
												<TableCell>
													<div className="flex items-center gap-1">
														<Image
															src="/assets/ethereum.png"
															alt="ethereum"
															width={16}
															height={16}
														/>
														<span>{appeal.targetFigure}</span>
													</div>
												</TableCell>
												<TableCell>
													<div className="flex items-center gap-1">
														<Image
															src="/assets/calendar.svg"
															alt="calendar"
															width={16}
															height={16}
														/>
														<span>
															{new Date(
																appeal.targetDeadline
															).toLocaleDateString("en-US", {
																year: "numeric",
																month: "short",
																day: "numeric",
															})}
														</span>
													</div>
												</TableCell>
												<TableCell>
													<div className="flex items-center gap-2">
														{appeal.ipfsHash ? (
															<>
																<Link
																	href={`https://ipfs.io/ipfs/${appeal.ipfsHash}`}
																	target="_blank"
																	rel="noopener noreferrer"
																	className="truncate text-blue-600 hover:underline max-w-[100px] md:max-w-[150px]"
																	title={appeal.ipfsHash}
																>
																	{appeal.ipfsHash.substring(0, 8)}...
																	{appeal.ipfsHash.substring(
																		appeal.ipfsHash.length - 4
																	)}
																</Link>
																<Button
																	variant="ghost"
																	size="icon"
																	className="size-6 cursor-pointer"
																	onClick={() => copyAddress(appeal.ipfsHash)}
																>
																	<Copy className="size-4" />
																	<span className="sr-only">
																		Copy IPFS Hash
																	</span>
																</Button>
															</>
														) : (
															<span className="text-gray-500">
																No file uploaded
															</span>
														)}
													</div>
												</TableCell>
												<TableCell className="text-right">
													<DropdownMenu>
														<DropdownMenuTrigger asChild>
															<Button
																variant="ghost"
																size="icon"
																className="size-8"
															>
																<MoreHorizontal className="size-4" />
																<span className="sr-only">Actions</span>
															</Button>
														</DropdownMenuTrigger>
														<DropdownMenuContent align="end">
															<DropdownMenuItem
																onClick={() => handleApprove(index)}
																className="flex items-center gap-2 text-green-600 cursor-pointer"
															>
																<Check className="size-4" /> Approve
															</DropdownMenuItem>
															<DropdownMenuItem
																onClick={() => handleReject(index)}
																className="flex items-center gap-2 text-red-600 cursor-pointer"
															>
																<X className="size-4" /> Reject
															</DropdownMenuItem>
														</DropdownMenuContent>
													</DropdownMenu>
												</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							</div>
						</CardContent>
					</Card>
				)}
			</div>
			{/* Description Dialog */}
			<Dialog
				open={isDescriptionDialogOpen}
				onOpenChange={setIsDescriptionDialogOpen}
			>
				<DialogContent className="w-full sm:max-w-lg md:max-w-2xl">
					<DialogHeader>
						<DialogTitle>Appeal Description</DialogTitle>
						<DialogDescription>
							Full details of the health appeal.
						</DialogDescription>
					</DialogHeader>
					<div className="prose prose-sm max-h-[300px] w-full overflow-y-auto">
						<p>{selectedDescription}</p>
					</div>
				</DialogContent>
			</Dialog>
		</div>
	)
}

export default AdminContent
