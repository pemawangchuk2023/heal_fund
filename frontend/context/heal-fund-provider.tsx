"use client";
import React, {
	useEffect,
	createContext,
	useState,
	useContext,
	useCallback,
} from "react";
import { ethers } from "ethers";
import { toast } from "sonner";
import {
	HealFundAbi,
	HealFundSmartContractAddress,
} from "@/context/contract/address";
import {
	HealFundContextProps,
	HealFundProviderProps,
	PatientAppeal,
} from "@/types/action";

declare global {
	interface Window {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		ethereum?: any;
	}
}

export const HealFundContext = createContext<HealFundContextProps | undefined>(
	undefined
);

const HealFundProvider = ({ children }: HealFundProviderProps) => {
	const [contract, setContract] = useState<ethers.Contract | null>(null);
	const [currentAccount, setCurrentAccount] = useState<string | null>(null);
	const [appeals, setAppeals] = useState<PatientAppeal[]>([]);

	useEffect(() => {
		const initializeContract = async () => {
			if (!window.ethereum) {
				console.error("Ethereum provider not found. Please install MetaMask.");
				return;
			}
			try {
				const provider = new ethers.BrowserProvider(window.ethereum);
				const accounts = await window.ethereum.request({
					method: "eth_accounts",
				});
				if (accounts.length === 0) {
					await window.ethereum.request({ method: "eth_requestAccounts" });
				}
				const signer = await provider.getSigner();
				const address = await signer.getAddress();
				console.log("Connected account:", address);
				setCurrentAccount(address);

				const contract = new ethers.Contract(
					HealFundSmartContractAddress,
					HealFundAbi,
					signer
				);
				console.log("Contract initialized:", contract);
				setContract(contract);

				window.ethereum.on("accountsChanged", async (newAccounts: string[]) => {
					if (newAccounts.length > 0) {
						setCurrentAccount(newAccounts[0]);
						const newSigner = await provider.getSigner();
						setContract(
							new ethers.Contract(
								HealFundSmartContractAddress,
								HealFundAbi,
								newSigner
							)
						);
					} else {
						setCurrentAccount(null);
						setContract(null);
					}
				});
			} catch (error) {
				console.error("Error initializing contract:", error);
			}
		};
		initializeContract();
	}, []);

	const submitFundSupportProposal = async (
		purpose: string,
		description: string,
		ipfsHash: string,
		targetFigure: number,
		targetDeadline: Date
	) => {
		if (!contract) {
			throw new Error("Contract is not initialized. Please try again.");
		}
		if (!currentAccount) {
			throw new Error(
				"No wallet connected. Please connect your MetaMask wallet."
			);
		}
		try {
			const deadlineTimestamp = Math.floor(
				new Date(targetDeadline).getTime() / 1000
			);
			const parsedTargetFigure = ethers.parseEther(targetFigure.toString());
			const transaction = await contract.proposeHealthAppeal(
				purpose,
				description,
				ipfsHash,
				parsedTargetFigure,
				deadlineTimestamp
			);
			const receipt = await transaction.wait();
			return receipt;
		} catch (error) {
			console.error("Error proposing health appeal:", error);
			toast.success("Failed. Please try again");
		}
	};

	const approveHealthAppeal = async (patientId: number) => {
		if (!contract || !currentAccount) {
			throw new Error("Contract or wallet not initialized.");
		}
		try {
			const tx = await contract.endorseHealthAppeal(patientId, {
				gasLimit: 500_000,
			});
			await tx.wait();
			console.log("Health appeal endorsed successfully.");
		} catch (error) {
			console.error("Error endorsing health appeal:", error);
			throw error;
		}
	};

	const rejectFundSupportRequest = async (patientId: number) => {
		if (!contract || !currentAccount) {
			throw new Error("Contract or wallet not initialized.");
		}
		try {
			const tx = await contract.rejectHealthAppeal(patientId);
			await tx.wait();
			console.log("Health appeal rejected.");
		} catch (error) {
			console.error("Error rejecting health appeal:", error);
			throw error;
		}
	};

	const contributeToPatient = async (patientId: number, amount: number) => {
		if (!contract) {
			throw new Error("Contract is not initialized.");
		}
		if (!currentAccount) {
			throw new Error(
				"No wallet connected. Please connect your MetaMask wallet."
			);
		}
		try {
			const parsedAmount = ethers.parseEther(amount.toString());
			const transaction = await contract.contributeToPatient(patientId, {
				value: parsedAmount,
			});
			await transaction.wait();
			console.log("Contribution made successfully.");
		} catch (error) {
			console.error("Error contributing to patient:", error);
			throw error;
		}
	};

	const fetchAppeals = useCallback(async () => {
		if (!contract) {
			console.error("Contract not initialized");
			return;
		}
		try {
			const totalAppeals = await contract.patientAppealCount();
			const results: PatientAppeal[] = [];

			for (let i = 0; i < Number(totalAppeals); i++) {
				const details = await contract.getPatientAppealDetails(i);
				const contributors = await contract.getContributors(i);

				const [
					patient,
					purpose,
					description,
					ipfsHash,
					targetFigure,
					targetDeadline,
					amountRaised,
					endorsed,
					completed,
					approvalTokenId,
					amountPaidOut,
					contributorCount,
					targetAchieved,
					contributionsBlocked,
				] = details;

				results.push({
					patient,
					purpose,
					description,
					ipfsHash,
					targetFigure: Number(ethers.formatEther(targetFigure)),
					targetDeadline: new Date(Number(targetDeadline) * 1000),
					amountRaised: Number(ethers.formatEther(amountRaised)),
					endorsed,
					completed,
					approvalTokenId: approvalTokenId.toString(),
					amountPaidOut: ethers.formatEther(amountPaidOut),
					contributorCount: Number(contributorCount),
					targetAchieved,
					contributionsBlocked,
					contributors,
				});
			}
			setAppeals(results);
		} catch (err) {
			console.error("Failed to fetch appeals:", err);
		}
	}, [contract]);

	return (
		<HealFundContext.Provider
			value={{
				appeals,
				submitFundSupportProposal,
				contributeToPatient,
				currentAccount,
				approveHealthAppeal,
				rejectFundSupportRequest,
				fetchAppeals,
			}}
		>
			{children}
		</HealFundContext.Provider>
	);
};

export default HealFundProvider;

export const useHealFund = (): HealFundContextProps => {
	const context = useContext(HealFundContext);
	if (!context) {
		throw new Error("useHealFund must be used within a HealFundProvider");
	}
	return context;
};
