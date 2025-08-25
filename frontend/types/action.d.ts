export interface UserAuthCredentials {
	name: string;
	password: string;
	email: string;
	age: number;
	sex: string;
	cid: number;
	publicKey: string;
	location: string;
	contactNumber: number;
}
export interface IUser {
	name: string;
	age: number;
	sex: string;
	email: string;
	password: string;
	cid: number;
	publicKey: string;
	location: string;
	contactNumber: number;
}

interface UserSignInCredentials {
	email: string;
	password: string;
}
interface SignOutButtonProps {
	isCollapsed?: boolean;
	className?: string;
}
// 2. The interface for the smart contract context

interface UserAppeal {
	patient: string;
	purpose: string;
	description: string;
	targetFigure: number;
	targetDeadline: Date;
	amountRaised: number;
	endorsed: boolean;
	completed: boolean;
	approvalTokenId: string;
	amountPaidOut: string;
	contributorCount: number;
	contributors: string[];
}
interface HealFundContextProps {
	appeals: PatientAppeal[];
	submitFundSupportProposal: (
		purpose: string,
		description: string,
		ipfshash: string,
		targetFigure: number,
		targetDeadline: Date
	) => Promise<void>;
	contributeToPatient: (patientId: number, amount: number) => Promise<void>;
	approveHealthAppeal: (patientId: number) => Promise<void>;
	rejectFundSupportRequest: (patientId: number) => Promise<void>;
	fetchAppeals: () => Promise<void>;
	currentAccount: string | null;
}

interface HealFundProviderProps {
	children: React.ReactNode;
}

interface GetUserParams {
	userId: string;
}

export interface PatientAppeal {
	patient: string;
	purpose: string;
	description: string;
	ipfsHash: string;
	targetFigure: number;
	targetDeadline: Date;
	amountRaised: number;
	endorsed: boolean;
	rejected: boolean;
	completed: boolean;
	approvalTokenId: string;
	amountPaidOut: string;
	contributorCount: number;
	targetAchieved: boolean;
	contributionsBlocked: boolean;
	contributors: string[];
}
interface FileUploadProps {
	onUploadComplete: (ipfsHash: string) => void;
}
