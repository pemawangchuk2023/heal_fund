export const faqs = [
	{
		question: "What is HealFund?",
		answer:
			"HealFund is a decentralized crowdfunding platform built on the blockchain, designed to help patients raise funds for their medical appeals.",
	},
	{
		question: "Who can create a medical appeal on HealFund?",
		answer:
			"Any patient can propose a health appeal by providing details such as the purpose, description, supporting documents (via IPFS hash), a target funding amount, and a deadline.",
	},
	{
		question: "What is the role of the 'Authority' in HealFund?",
		answer:
			"The 'Authority' is the deployer of the HealFund contract. They are responsible for reviewing, endorsing, or rejecting patient appeals, and for manually disbursing funds if needed.",
	},
	{
		question: "How does a medical appeal get approved for funding?",
		answer:
			"After a patient proposes an appeal, the 'Authority' must endorse it. Only endorsed appeals are eligible to receive contributions from donors.",
	},
	{
		question: "What is an 'endorsement token'?",
		answer:
			"When the 'Authority' endorses a health appeal, a unique 'endorsement token' (represented by approvalTokenId) is issued to the patient, signifying the appeal's official approval.",
	},
	{
		question: "Can an appeal be rejected? What happens then?",
		answer:
			"Yes, the 'Authority' can reject an appeal if it has not yet been endorsed. Once rejected, the appeal is marked as completed, and no further contributions can be made to it.",
	},
	{
		question: "How can I contribute to a patient's appeal?",
		answer:
			"You can contribute ETH to an endorsed appeal using the `contributeToPatient` function. Ensure the appeal is endorsed, not rejected, and its deadline has not passed.",
	},
	{
		question: "Is there a minimum contribution amount?",
		answer:
			"Yes, there is a minimum contribution of `0.02 ETH` per transaction to any appeal.",
	},
	{
		question:
			"What happens if my contribution exceeds the appeal's target amount?",
		answer:
			"If your contribution would cause the total amount raised to exceed the target, the excess amount will be automatically refunded to you, and only the amount needed to reach the target will be accepted.",
	},
	{
		question: "When are the raised funds disbursed to the patient?",
		answer:
			"Funds are automatically disbursed to the patient once the appeal's target funding amount is achieved. The 'Authority' also has an option for manual disbursement if the target is met.",
	},
	{
		question: "Can the contract operations be paused?",
		answer:
			"Yes, the 'Authority' has the ability to pause or resume all contract operations using the `stopContract` function in case of emergencies or maintenance.",
	},
	{
		question: "How can I check the status of an appeal or my contribution?",
		answer:
			"You can use view functions like `getPatientAppealDetails` to check the overall status of an appeal, `getContributorAmount` to see your specific contribution, and `getContributors` to list all donors for an appeal.",
	},
	{
		question: "What happens if an appeal's deadline passes?",
		answer:
			"Once the `targetDeadline` has passed, no new contributions can be made to that appeal.",
	},
];
