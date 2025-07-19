"use client";
import { ArrowRight, Sparkles } from "lucide-react";
import { stats } from "@/constants/stats";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useState, useEffect } from "react";

const Hero = () => {
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const timer = setTimeout(() => {
			setIsLoading(false);
		}, 1500);
		return () => clearTimeout(timer);
	}, []);

	if (isLoading) {
		return (
			<div className='relative min-h-[calc(100vh-2rem)] w-full'>
				<div className='relative z-10 w-full px-4 sm:px-6 py-8 sm:py-12'>
					<div className='flex flex-col md:flex-row items-center gap-8 min-h-[500px]'>
						{/* Left Content Skeleton */}
						<div className='flex-1 space-y-6 w-full md:max-w-[45%]'>
							<div>
								<div className='inline-flex items-center gap-2 rounded-full px-3 py-1 sm:px-4 sm:py-2 mb-4 sm:mb-6'>
									<Skeleton className='w-6 h-6 sm:w-10 sm:h-10 rounded-full' />
									<Skeleton className='h-4 w-[200px] sm:w-[300px]' />
								</div>

								<div className='space-y-2'>
									<Skeleton className='h-8 sm:h-10 w-[250px] sm:w-[350px]' />
									<Skeleton className='h-8 sm:h-10 w-[200px] sm:w-[280px]' />
									<Skeleton className='h-8 sm:h-10 w-[150px] sm:w-[200px]' />
								</div>

								<div className='mt-2 sm:mt-4 space-y-2'>
									<Skeleton className='h-5 sm:h-6 w-[280px] sm:w-[400px]' />
								</div>
							</div>

							<div className='flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2 sm:pt-4'>
								<Skeleton className='h-10 sm:h-12 w-[150px] sm:w-[180px] rounded-md' />
								<Skeleton className='h-10 sm:h-12 w-[140px] sm:w-[170px] rounded-md' />
							</div>
						</div>

						{/* Right Content Skeleton */}
						<div className='flex-1 relative w-full md:max-w-[45%] mt-8 md:mt-0'>
							<div className='absolute -top-4 right-0 z-10'>
								<Skeleton className='h-10 sm:h-12 w-[200px] sm:w-[250px] rounded-2xl' />
							</div>

							<div className='grid gap-3 sm:gap-4 mt-8 sm:mt-12'>
								{[1, 2, 3].map((index) => (
									<div key={index} className='rounded-2xl p-4 sm:p-6 border-2'>
										<div className='flex items-center gap-3 sm:gap-4'>
											<Skeleton className='w-10 h-10 sm:w-12 sm:h-12 rounded-full' />
											<div className='space-y-2'>
												<Skeleton className='h-6 sm:h-8 w-[60px] sm:w-[80px]' />
												<Skeleton className='h-3 sm:h-4 w-[120px] sm:w-[150px]' />
											</div>
										</div>
									</div>
								))}
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className='relative min-h-[calc(100vh-2rem)] w-full'>
			<div className='relative z-10 w-full px-4 sm:px-6 py-8 sm:py-12'>
				<div className='flex flex-col md:flex-row items-center gap-8 min-h-[500px]'>
					{/* Left Content */}
					<div className='flex-1 space-y-6 w-full md:max-w-[45%]'>
						<div>
							<div className='inline-flex items-center gap-2 rounded-full px-3 py-1 sm:px-4 sm:py-2 mb-4 sm:mb-6'>
								<Sparkles className='w-6 h-6 sm:w-10 sm:h-10 text-green-500 mr-2 sm:mr-4' />
								<span className='text-xs sm:text-sm font-medium text-foreground'>
									Powered By Ethereum Blockchain And Leverages Alchemy&apos;s
									Web3 Infrastructure
								</span>
							</div>
							<h1 className='text-3xl sm:text-4xl font-bold text-foreground'>
								Support Health
								<span className='block bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent'>
									Causes
								</span>
								Instantly
							</h1>
							<p className='text-base sm:text-xl text-foreground mt-2 sm:mt-4 max-w-md'>
								Revolutionary Ethereum blockchain-powered platform for Bhutanese
							</p>
						</div>
						{/* CTA Buttons */}
						<div className='flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2 sm:pt-4'>
							<Button
								size='lg'
								className='px-4 py-2 sm:px-6 sm:py-3 cursor-pointer text-white font-semibold bg-emerald-500 hover:bg-emerald-600 hover:shadow-xl transition-all duration-300 group'
							>
								Start Your Appeal
								<ArrowRight className='w-4 h-4 sm:w-5 sm:h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300' />
							</Button>
							<Button
								variant='outline'
								size='lg'
								className='px-4 py-2 sm:px-6 sm:py-3 font-semibold cursor-pointer border-2 text-foreground'
							>
								Explore Appeals
								<ArrowRight className='w-4 h-4 sm:w-5 sm:h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300' />
							</Button>
						</div>
					</div>

					{/* Right Content - Stats Cards */}
					<div className='flex-1 relative w-full md:max-w-[45%] mt-8 md:mt-0'>
						{/* Floating Success Card */}
						<div className='absolute -top-4 right-0 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-2xl px-4 py-2 sm:px-6 sm:py-3 shadow-2xl z-10'>
							<div className='flex items-center gap-2 sm:gap-3 text-white'>
								<div className='w-2 h-2 sm:w-3 sm:h-3 bg-white rounded-full'></div>
								<span className='text-xs sm:text-sm font-medium'>
									Life-Saving Funds Just Delivered!
								</span>
							</div>
						</div>
						<div className='grid gap-3 sm:gap-4 mt-8 sm:mt-12'>
							{stats.map((stat, index) => {
								const Icon = stat.icon;
								return (
									<div key={index} className='rounded-2xl p-4 sm:p-6 border-2'>
										<div className='flex items-center gap-3 sm:gap-4'>
											<div className='p-2 sm:p-3 rounded-full bg-gradient-to-r from-purple-500/20 to-blue-500/20'>
												<Icon
													className={`w-5 h-5 sm:w-6 sm:h-6 ${stat.color}`}
												/>
											</div>
											<div>
												<div className='text-xl sm:text-2xl font-bold text-foreground'>
													{stat.number}
												</div>
												<div className='text-xs sm:text-sm text-foreground'>
													{stat.label}
												</div>
											</div>
										</div>
									</div>
								);
							})}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Hero;
