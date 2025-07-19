"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import PriceDisplayCard from "@/components/eth/price-display-card";
import Footer from "@/components/footer";
import ContributeToPatient from "@/components/forms/contribute-to-patients";
import Hero from "@/components/sections/hero";
import MiddleHero from "@/components/sections/middle-hero";
import HealFundProvider from "@/context/heal-fund-provider";
import TechStack from "@/components/techstack";

const ScrollHandler = () => {
	const searchParams = useSearchParams();

	useEffect(() => {
		const scrollTarget = searchParams.get("scroll");
		if (scrollTarget === "contribute") {
			const section = document.getElementById("contribute");
			if (section) {
				section.scrollIntoView({ behavior: "smooth", block: "start" });
			}
		}
	}, [searchParams]);

	return null;
};

const HomePage = () => {
	return (
		<div>
			<Hero />
			<PriceDisplayCard />
			<MiddleHero />
			<HealFundProvider>
				<div id='contribute'>
					<ContributeToPatient />
				</div>
			</HealFundProvider>
			<Footer />
			<Suspense fallback={null}>
				<ScrollHandler />
			</Suspense>
			<TechStack />
		</div>
	);
};

export default HomePage;
