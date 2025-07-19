"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Heart, CheckCircle } from "lucide-react";

// Mock data based on the HealFund smart contract structure
const supportedPatients = [
	{
		id: 1,
		patient: "0x742d35Cc6634C0532925a3b8D4C9db4C4C4b8c4d",
		patientName: "Sarah Johnson",
		purpose: "Heart Surgery",
		description: "Emergency cardiac bypass surgery needed urgently",
		targetFigure: 5.0,
		amountRaised: 5.2,
		endorsed: true,
		completed: true,
		contributorCount: 23,
		amountPaidOut: 5.2,
		completedDate: "2024-01-15",
	},
	{
		id: 2,
		patient: "0x8ba1f109551bD432803012645Hac136c22C4c4d",
		patientName: "Michael Chen",
		purpose: "Cancer Treatment",
		description: "Chemotherapy and radiation therapy for stage 3 cancer",
		targetFigure: 8.5,
		amountRaised: 9.1,
		endorsed: true,
		completed: true,
		contributorCount: 45,
		amountPaidOut: 9.1,
		completedDate: "2024-01-10",
	},
];

const RightSidebar = () => {
	const formatEth = (amount: number) => `${amount.toFixed(2)} ETH`;
	const formatDate = (dateString: string) =>
		new Date(dateString).toLocaleDateString();

	return (
		<aside className='w-fit h-screen border-l flex-shrink-0'>
			{/* Header */}
			<div className='p-4 border-b'>
				<div className='flex items-center gap-2'>
					<div className='p-2 bg-green-100 dark:bg-green-900 rounded-lg'>
						<Heart className='h-4 w-4 text-green-600 dark:text-green-400' />
					</div>
					<div>
						<h2 className='text-sm font-bold text-foreground'>
							Recently Supported Patients
						</h2>
					</div>
				</div>
			</div>

			{/* Supported Patients List */}
			<ScrollArea className='h-[calc(100vh-80px)]'>
				<div className='p-3 space-y-3'>
					{supportedPatients.map((patient) => (
						<Card key={patient.id}>
							<CardHeader className='pb-2 p-3'>
								<div className='flex items-start justify-between'>
									<Badge
										variant='secondary'
										className='bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-xs px-1 py-0'
									>
										<CheckCircle className='h-2 w-2 mr-1' />
										Done
									</Badge>
								</div>
							</CardHeader>
							<CardContent className='pt-0 p-3 space-y-2'>
								<p className='text-xs text-muted-foreground line-clamp-2'>
									{patient.description}
								</p>

								<div className='space-y-1'>
									<div className='flex justify-between text-xs'>
										<span>Raised: {formatEth(patient.amountRaised)}</span>
										<span>Target: {formatEth(patient.targetFigure)}</span>
									</div>
									<Progress
										value={(patient.amountRaised / patient.targetFigure) * 100}
										className='h-1'
									/>
								</div>

								<div className='flex items-center justify-between text-xs text-muted-foreground'>
									<div className='flex items-center gap-1'>
										<span>{patient.contributorCount}</span>
									</div>
									<div className='flex items-center gap-1'>
										<span>{formatDate(patient.completedDate)}</span>
									</div>
								</div>

								<div className='pt-1 border-t'>
									<div className='flex justify-between text-xs'>
										<span className='text-muted-foreground'>Paid:</span>
										<span className='font-medium text-green-600'>
											{formatEth(patient.amountPaidOut)}
										</span>
									</div>
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			</ScrollArea>
		</aside>
	);
};

export default RightSidebar;
