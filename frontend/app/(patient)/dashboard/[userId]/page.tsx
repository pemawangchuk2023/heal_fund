import UserCard from "@/app/(patient)/dashboard/components/card/user-card";
import { getCurrentUser } from "@/lib/actions/user.action";

interface UserDashboardProps {
	params: {
		userId: string;
	};
}

const UserDashboard = async ({
	params,
}: {
	params: Promise<UserDashboardProps["params"]>;
}) => {
	const { userId } = await params;
	const result = await getCurrentUser({ userId });

	return (
		<div className='min-h-screen'>
			<div className='container mx-auto px-4 py-8 lg:px-8'>
				{/* Header Section */}
				<div className='mb-12'>
					<div className='flex flex-col space-y-2 text-center items-center justify-center'>
						<p className='text-xl text-foreground'>Your Personal Information</p>
					</div>
				</div>
				{result.success && (
					<div className='grid grid-cols-1 xl:grid-cols-12 gap-8 lg:gap-12'>
						<div className='xl:col-span-5'>
							<UserCard
								user={{
									email: result.data.user.email,
									name: result.data.user.name,
									age: result.data.user.age,
									sex: result.data.user.sex,
									cid: result.data.user.cid,
									publicKey: result.data.user.publicKey,
									location: result.data.user.location,
									contactNumber: result.data.user.contactNumber,
								}}
							/>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default UserDashboard;
