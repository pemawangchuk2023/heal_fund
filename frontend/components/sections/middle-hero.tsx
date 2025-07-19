import Image from "next/image";

const MiddleHero = () => {
	return (
		<section className='relative min-h-screen overflow-hidden'>
			<div className='relative container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20'>
				<div className='grid lg:grid-cols-2 gap-8 sm:gap-12 items-center min-h-[60vh]'>
					{/* Left content */}
					<div className='space-y-6 sm:space-y-8'>
						<div className='space-y-4 sm:space-y-6'>
							<h1 className='text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight'>
								Apply For Web3
								<span className='block bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent'>
									Crowdfunding
								</span>
								Support
							</h1>
							<p className='text-base sm:text-lg md:text-xl text-foreground max-w-full sm:max-w-2xl'>
								Submit Your Fund Support Proposal With Medical Evidences And
								Attach Image via our Official Portal. Get comprehensive support
								for your health appeal to help potential donors understand your
								situation.
							</p>
						</div>
						{/* Stats */}
						<div className='flex flex-wrap justify-center sm:justify-start gap-6 sm:gap-8 pt-6 sm:pt-8'>
							<div className='text-center'>
								<div className='text-xl sm:text-2xl font-bold text-yellow-400'>
									200+
								</div>
								<div className='text-xs sm:text-sm text-foreground'>
									Appeals Funded
								</div>
							</div>
							<div className='text-center'>
								<div className='text-xl sm:text-2xl font-bold text-yellow-400'>
									Nu 18.925 M+
								</div>
								<div className='text-xs sm:text-sm text-foreground'>
									Total Raised
								</div>
							</div>
							<div className='text-center'>
								<div className='text-xl sm:text-2xl font-bold text-yellow-400'>
									10K+
								</div>
								<div className='text-xs sm:text-sm text-foreground'>Donors</div>
							</div>
						</div>
					</div>

					{/* Right content - Dashboard preview */}
					<div className='relative'>
						<div className='relative rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8'>
							<div className='relative rounded-xl sm:rounded-2xl overflow-hidden shadow-xl sm:shadow-2xl'>
								<Image
									src='/assets/dashboard.png'
									alt='HealFund Portal Dashboard'
									width={600}
									height={400}
									className='w-full h-auto object-cover'
									priority
									sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px'
								/>
							</div>
						</div>
					</div>
				</div>
				{/* Bottom section */}
				<div className='mt-12 sm:mt-16 lg:mt-20 text-center'>
					<p className='text-foreground text-base sm:text-lg md:text-xl mb-6 sm:mb-8 inline-block border-b-4 sm:border-b-8 border-yellow-500'>
						Approved by the Ministry of Health
					</p>
					<div className='flex flex-wrap justify-center items-center gap-4 sm:gap-6 lg:gap-8'>
						<div className='text-muted-foreground text-sm sm:text-base font-semibold'>
							Web3 Foundation
						</div>
						<div className='w-px h-4 sm:h-6 bg-muted-foreground'></div>
						<div className='text-muted-foreground text-sm sm:text-base font-semibold'>
							Healthcare Alliance
						</div>
						<div className='w-px h-4 sm:h-6 bg-muted-foreground'></div>
						<div className='text-muted-foreground text-sm sm:text-base font-semibold'>
							Crypto Care
						</div>
						<div className='w-px h-4 sm:h-6 bg-muted-foreground'></div>
						<div className='text-muted-foreground text-sm sm:text-base font-semibold'>
							Medical DAO
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default MiddleHero;
