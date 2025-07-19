"use client";
import AdminContent from "@/app/(patient)/dashboard/components/display/admin-content";
import ApprovedAppeals from "@/app/(patient)/dashboard/components/display/approved-appeals";
import HealFundProvider from "@/context/heal-fund-provider";

const Admin = () => {
	return (
		<HealFundProvider>
			<div className='flex flex-col min-h-screen gap-4'>
				<AdminContent />
				<ApprovedAppeals />
			</div>
		</HealFundProvider>
	);
};

export default Admin;
