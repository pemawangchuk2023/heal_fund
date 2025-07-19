import {
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import Image from "next/image";

const MetamaskAlert = () => {
	return (
		<div className='w-full p-6 md:p-5'>
			<CardHeader className='flex flex-col items-center text-center mb-3'>
				<CardTitle className='text-3xl font-extrabold tracking-tight text-primary'>
					MetaMask Required
				</CardTitle>
			</CardHeader>
			<CardContent className='flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12'>
				<div className='flex-shrink-0'>
					<Image
						src='/assets/metamask.png'
						alt='MetaMask Fox Logo'
						width={150}
						height={150}
						className='object-contain'
					/>
				</div>
				<div className='text-center md:text-left space-y-4 max-w-xl'>
					<CardDescription className='text-lg text-foreground text-justify capitalize'>
						To fully experience this application, please ensure you have the{" "}
						<span className='font-semibold text-primary text-red-500 font-extrabold'>
							MetaMask browser extension installed
						</span>{" "}
						and your wallet connected.
					</CardDescription>
				</div>
			</CardContent>
		</div>
	);
};

export default MetamaskAlert;
