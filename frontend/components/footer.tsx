"use client";
import Image from "next/image";
import { useTheme } from "next-themes";
import { socialIcons } from "@/constants/socials";

interface FooterLinksProps {
	heading: string;
	items: string[];
	extraClasses?: string;
}

const FooterLinks = ({
	heading,
	items,
	extraClasses = "",
}: FooterLinksProps) => (
	<div className={extraClasses ? `flex-1 ${extraClasses}` : "flex-1"}>
		<h3 className='font-bold text-[20px] mb-6 md:mb-4 sm:mb-3 text-foreground inline-block border-b-8 border-yellow-500'>
			{heading}
		</h3>
		{items.map((item, index) => (
			<p
				key={index}
				className='text-[18px] my-3 sm:my-2 cursor-pointer text-foreground'
			>
				{item}
			</p>
		))}
	</div>
);

const Footer = () => {
	const { theme } = useTheme();

	return (
		<footer className='flex flex-col items-center border-t  py-8 sm:py-6'>
			<div className='w-full max-w-5xl flex md:flex-col px-16 lg:px-8 md:px-6 sm:px-4'>
				<div className='flex-1 flex flex-wrap justify-between ml-10 lg:ml-6 md:ml-0 md:mt-8 sm:mt-6'>
					<FooterLinks
						heading='Department of Financial Support, HealFund'
						items={[
							"Propose Appeal",
							"Contribute",
							"Track Appeals",
							"About Us",
						]}
					/>
					<FooterLinks
						heading='Support'
						items={[
							"Help Center",
							"Terms of Service",
							"Smart Contract Info",
							"Privacy Policy",
						]}
						extraClasses='ml-4 md:ml-0'
					/>
				</div>
			</div>
			<div className='w-full max-w-5xl mt-5 border-t px-16 lg:px-8 md:px-6 sm:px-4 mb-4'>
				<div className='flex justify-between items-center w-full mt-7 sm:mt-5'>
					<p className='font-bold text-[20px] text-foreground'>
						Department of Financial Support. All Rights Reserved
					</p>
					<div className='flex items-center gap-4 sm:gap-2 order-1 md:order-2'>
						{socialIcons.map((icon, index) => (
							<div
								className='cursor-pointer hover:scale-110 transition-transform duration-200'
								key={index}
							>
								<Image
									src={icon.src}
									width={32}
									height={32}
									alt={icon.alt}
									style={{ objectFit: "contain" }}
									className={`w-8 h-8 sm:w-8 sm:h-6 ${
										theme === "light" ? "filter invert" : ""
									}`}
								/>
							</div>
						))}
					</div>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
