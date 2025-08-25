import WalletConnection from "@/components/wallet/wallet-connection";
import User from "@/database/user.model";
import { auth } from "@/auth";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Mail,
	MapPin,
	Phone,
	Calendar,
	UserIcon,
	Key,
	Fingerprint,
} from "lucide-react";

const Dashboard = async () => {
	const session = await auth();
	if (!session?.user?.id) {
		return (
			<div className='min-h-screen flex items-center justify-center'>
				<p className='text-center text-lg text-muted-foreground'>
					You must be logged in to view your dashboard.
				</p>
			</div>
		);
	}

	const user = await User.findById(session.user.id);

	return (
		<div className='min-h-screen py-12'>
			<div className='container mx-auto px-4 lg:px-8'>
				{user && (
					<div className='grid grid-cols-1 lg:grid-cols-3 gap-8 items-start'>
						{/* Left Column: User Details (2/3 width on large screens) */}
						<div className='lg:col-span-2'>
							<div className='overflow-hidden'>
								<CardHeader className='p-6 border-b-4'>
									<div className='flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left'>
										<CardTitle className='text-2xl font-bold text-foreground'>
											Welcome
											<span className='text-yellow-500 ml-3'>{user.name}</span>
										</CardTitle>
									</div>
								</CardHeader>
								<CardContent className='p-6 grid grid-cols-1 md:grid-cols-2 gap-8 border-b-4'>
									{/* Personal Information Section */}
									<div className='space-y-4'>
										<h3 className='text-lg font-semibold text-foreground border-b pb-2 mb-4'>
											Personal Information
										</h3>
										<div className='flex items-center gap-3 text-foreground'>
											<Mail className='h-5 w-5 text-primary' />
											<span>
												<span className='font-medium'>Email:</span> {user.email}
											</span>
										</div>
										<div className='flex items-center gap-3 text-foreground'>
											<Calendar className='h-5 w-5 text-primary' />
											<span>
												<span className='font-medium'>Age:</span> {user.age}
											</span>
										</div>
										<div className='flex items-center gap-3 text-gray-700 dark:text-gray-300'>
											<UserIcon className='h-5 w-5 text-primary' />
											<span>
												<span className='font-medium'>Sex:</span> {user.sex}
											</span>
										</div>
										<div className='flex items-center gap-3 text-foreground'>
											<MapPin className='h-5 w-5 text-primary' />
											<span>
												<span className='font-medium'>Location:</span>{" "}
												{user.location}
											</span>
										</div>
										<div className='flex items-center gap-3 text-foreground'>
											<Phone className='h-5 w-5 text-primary' />
											<span>
												<span className='font-medium'>Contact:</span>{" "}
												{user.contactNumber}
											</span>
										</div>
									</div>

									{/* Technical Information Section */}
									<div className='space-y-4'>
										<h3 className='text-lg font-semibold text-foreground border-b pb-2 mb-4'>
											Technical Details
										</h3>
										<div className='flex items-start gap-3 text-foreground'>
											<Fingerprint className='h-5 w-5 text-primary mt-1' />
											<div className='flex flex-col'>
												<span className='font-medium'>CID:</span>
												<span className='font-mono text-sm break-all'>
													{user.cid}
												</span>
											</div>
										</div>
										<div className='flex items-start gap-3 text-foreground'>
											<Key className='h-5 w-5 text-primary mt-1' />
											<div className='flex flex-col'>
												<span className='font-medium'>Public Key:</span>
												<span className='font-mono text-sm break-all'>
													{user.publicKey}
												</span>
											</div>
										</div>
									</div>
								</CardContent>
							</div>
						</div>

						{/* Right Column: Wallet Connection */}
						<div>
							<WalletConnection />
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default Dashboard;
