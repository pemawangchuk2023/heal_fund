"use client";
import { useEffect, useState } from "react";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { useHealFund } from "@/context/heal-fund-provider";
import Image from "next/image";
import { PatientAppeal } from "@/types/action";

const ApprovedAppeals = () => {
	const { appeals } = useHealFund();
	const [approvedAppeals, setApprovedAppeals] = useState<PatientAppeal[]>([]);

	useEffect(() => {
		const filteredAppeals = appeals.filter((appeal) => appeal.endorsed);
		setApprovedAppeals(filteredAppeals);
	}, [appeals]);

	if (approvedAppeals.length === 0) {
		return (
			<div className='py-10 text-center'>
				<h3 className='mb-2 text-xl font-semibold text-foreground'>
					No Approved Appeals
				</h3>
				<p className='text-foreground'>
					Approved appeals will appear here once approved.
				</p>
			</div>
		);
	}

	return (
		<div className='p-4 md:p-6'>
			<h2 className='text-2xl font-bold mb-4'>Approved Appeals</h2>
			<div className='overflow-x-auto rounded-md border'>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead className='w-[50px]'>
								<Checkbox />
							</TableHead>
							<TableHead className='text-red-500 font-bold'>NAME</TableHead>
							<TableHead className='text-red-500 font-bold'>
								PUBLIC KEY
							</TableHead>
							<TableHead className='text-red-500 font-bold'>AMOUNT</TableHead>
							<TableHead className='text-red-500 font-bold'>
								TARGET DATE
							</TableHead>
							<TableHead className='text-red-500 font-bold'>STATUS</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{approvedAppeals.map((appeal, index) => (
							<TableRow key={index}>
								<TableCell>
									<Checkbox />
								</TableCell>
								<TableCell className='font-medium'>{appeal.purpose}</TableCell>
								<TableCell>
									<span className='truncate'>
										{appeal.patient.substring(0, 8)}...
										{appeal.patient.substring(appeal.patient.length - 4)}
									</span>
								</TableCell>
								<TableCell>
									<div className='flex items-center gap-1'>
										<Image
											src='/assets/ethereum.png'
											alt='ethereum'
											width={16}
											height={16}
										/>
										<span>{appeal.targetFigure}</span>
									</div>
								</TableCell>
								<TableCell>
									<div className='flex items-center gap-1'>
										<Image
											src='/assets/calendar.svg'
											alt='calendar'
											width={16}
											height={16}
										/>
										<span>
											{new Date(appeal.targetDeadline).toLocaleDateString(
												"en-US",
												{
													year: "numeric",
													month: "short",
													day: "numeric",
												}
											)}
										</span>
									</div>
								</TableCell>
								<TableCell>
									<span className='text-green-600 font-semibold'>Approved</span>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
		</div>
	);
};

export default ApprovedAppeals;
