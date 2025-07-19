import SubmitProposal from "@/app/(patient)/dashboard/components/proposal/submit-proposal";
import HealFundProvider from "@/context/heal-fund-provider";
import React from "react";

const Appeal = () => {
	return (
		<HealFundProvider>
			<div>
				<SubmitProposal />
			</div>
		</HealFundProvider>
	);
};

export default Appeal;
