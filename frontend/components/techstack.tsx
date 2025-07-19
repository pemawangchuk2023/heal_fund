import Image from "next/image";
import { CardContent } from "@/components/ui/card";
import { technologies } from "@/constants/techstack";

const TechStack = () => {
	return (
		<div className='w-full py-6 md:py-8 lg:py-10 text-foreground'>
			<div className='container mx-auto px-4 md:px-6 lg:px-8 max-w-5xl'>
				<div className='p-4 md:p-6 lg:p-8'>
					<CardContent className='flex flex-col items-center text-center space-y-6 p-0'>
						<h2 className='text-xl md:text-2xl font-bold inline-block border-b-4 border-yellow-500'>
							Tech Stack Behind This Project
						</h2>
						<p className='text-sm md:text-base text-foreground max-w-2xl'>
							The web3 decentralized crowdfunding platform was developed and
							deployed to the Ethereum Blockchain. The smart contract is not yet
							audited.
						</p>
						<div className='grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 md:gap-3 w-full'>
							{technologies.map((tech) => (
								<div
									key={tech.alt}
									className='group flex flex-col items-center justify-center p-2 cursor-pointer'
								>
									<Image
										src={tech.src}
										alt={tech.alt}
										width={40}
										height={40}
										className='h-10 w-10 object-contain'
									/>
									<span className='mt-1 text-xs md:text-sm font-medium text-foreground'>
										{tech.alt}
									</span>
								</div>
							))}
						</div>
					</CardContent>
				</div>
			</div>
		</div>
	);
};

export default TechStack;
