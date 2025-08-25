"use client";

import { useEffect, useState } from "react";
import { useHealFund } from "@/context/heal-fund-provider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { EyeIcon } from "lucide-react";
import Image from "next/image";
import MetamaskAlert from "@/components/forms/metamask-alert";

const ContributeToPatient = () => {
	const { appeals, fetchAppeals, contributeToPatient } = useHealFund();
	const [amounts, setAmounts] = useState<{ [key: number]: string }>({});
	const [loadingIds, setLoadingIds] = useState<number[]>([]);

	useEffect(() => {
		fetchAppeals();
	}, [fetchAppeals]);

	const endorsedAppeals = appeals.filter(
		(appeal) => appeal.endorsed && !appeal.completed
	);

	const handleContribution = async (patientId: number) => {
		const amount = amounts[patientId];
		if (!amount || !Number(amount) || Number(amount) < 0.02) {
			toast.warning("You Have to Contribute a Minimum of 0.02 ETH");
			return;
		}
		try {
			setLoadingIds((prev) => [...prev, patientId]);
			await contributeToPatient(patientId, Number.parseFloat(amount));
			toast.success("The contribution was successful!");
			setAmounts((prev) => ({ ...prev, [patientId]: "" }));
		} catch (error) {
			console.error("Contribution failed:", error);
			toast.error("Transaction failed. Check the deadline. Try again.");
		} finally {
			setLoadingIds((prev) => prev.filter((id) => id !== patientId));
		}
	};

	if (endorsedAppeals.length === 0) {
		return (
			<div className='container py-6'>
				<p className='text-center text-sm text-red-500 font-semibold'>
					No endorsed health appeals available for contribution. Please check
					installing Metamask Extensions
				</p>
			</div>
		);
	}

	return (
		<div className='w-full space-y-6 text-center items-center justify-center'>
			<MetamaskAlert />
			<h1 className='text-xl font-semibold inline-block border-b-8 border-yellow-500'>
				Support Endorsed Appeals
			</h1>
			<div className='rounded-md border overflow-x-auto'>
				<Table className='text-sm'>
					<TableCaption>Endorsed health appeals awaiting support.</TableCaption>
					<TableHeader>
						<TableRow>
							<TableHead className='min-w-[120px] text-green-500 font-extrabold'>
								Purpose
							</TableHead>
							<TableHead className='min-w-[80px] text-center text-green-500 font-extrabold'>
								Info
							</TableHead>
							<TableHead className='min-w-[80px] text-green-500 font-extrabold'>
								Target
							</TableHead>
							<TableHead className='min-w-[80px] text-green-500 font-extrabold'>
								Raised
							</TableHead>
							<TableHead className='min-w-[120px] text-green-500 font-extrabold'>
								Progress
							</TableHead>
							<TableHead className='min-w-[120px] text-green-500 font-extrabold'>
								Deadline
							</TableHead>
							<TableHead className='min-w-[200px] text-right text-green-500 font-extrabold'>
								Contribution Amount
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{endorsedAppeals.map((appeal, index) => {
							const progressValue =
								appeal.targetFigure > 0
									? (appeal.amountRaised / appeal.targetFigure) * 100
									: 0;
							const patientId = index;
							return (
								<TableRow key={patientId}>
									<TableCell>{appeal.purpose}</TableCell>
									<TableCell className='text-center'>
										<Dialog>
											<DialogTrigger asChild>
												<Button
													variant='destructive'
													size='icon'
													className='h-6 w-6 cursor-pointer'
												>
													<EyeIcon className='h-4 w-4' />
													<span className='sr-only'>View full description</span>
												</Button>
											</DialogTrigger>
											<DialogContent className='w-full sm:max-w-lg md:max-w-3xl'>
												<DialogHeader>
													<DialogTitle>{appeal.purpose}</DialogTitle>
													<DialogDescription className='text-sm text-foreground text-justify'>
														{appeal.description}
													</DialogDescription>
												</DialogHeader>
											</DialogContent>
										</Dialog>
									</TableCell>
									<TableCell>{appeal.targetFigure} ETH</TableCell>
									<TableCell>{appeal.amountRaised} ETH</TableCell>
									<TableCell>
										<div className='flex items-center gap-1'>
											<Progress value={progressValue} className='w-[80px]' />
											<span className='text-xs text-red-500 font-extrabold italic'>
												{progressValue.toFixed(0)} %
											</span>
										</div>
									</TableCell>
									<TableCell>
										<span className='text-xs'>
											{appeal.targetDeadline.toDateString()}
										</span>
									</TableCell>
									<TableCell className='text-right'>
										<div className='flex items-center space-x-1 justify-end'>
											<Input
												type='number'
												placeholder='ETH'
												value={amounts[patientId] || ""}
												onChange={(e) =>
													setAmounts((prev) => ({
														...prev,
														[patientId]: e.target.value,
													}))
												}
												className='w-[100px] h-8 text-xs'
											/>
											<Button
												size='sm'
												className='h-8 px-2 cursor-pointer'
												onClick={() => handleContribution(patientId)}
												disabled={loadingIds.includes(patientId)}
											>
												{loadingIds.includes(patientId) ? (
													<div className='flex items-center justify-center gap-2'>
														<Image
															src='/assets/loader.gif'
															alt='Loading...'
															width={24}
															height={24}
															className='h-6 w-6'
														/>
														<span>Processing Contribution...</span>
													</div>
												) : (
													<>Contribute</>
												)}
											</Button>
										</div>
									</TableCell>
								</TableRow>
							);
						})}
					</TableBody>
				</Table>
			</div>
		</div>
	);
};

export default ContributeToPatient;
