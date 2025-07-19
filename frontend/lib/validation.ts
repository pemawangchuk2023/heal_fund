import { z } from "zod";

export const SignInSchema = z.object({
	email: z
		.string()
		.min(1, { message: "Email is required" })
		.email({ message: "Please provide a valid email address." }),

	password: z
		.string()
		.min(6, { message: "Password must be at least 6 characters long." })
		.max(100, { message: "Password cannot exceed 100 characters." }),
});

export const SignUpSchema = SignInSchema.extend({
	name: z.string().min(1, { message: "Name is required" }),
	age: z.coerce.number().min(1, { message: "Age must be a positive number" }),
	sex: z.string().min(1, "Mention your gender"),
	cid: z.coerce.number().min(11, {
		message: "The CID must be a positive number and 11 characters",
	}),
	publicKey: z.string().length(42, {
		message: "Public key of ETH Address must be exactly 42 characters long",
	}),
	location: z.string().min(1, { message: "Location is required" }),
	contactNumber: z.coerce
		.number()
		.min(1, { message: "Contact number is required" }),
});
export const UserSchema = z.object({
	patient: z.string().min(1, { message: "The UserId is required" }),
});

export const proposalSchema = z.object({
	purpose: z
		.string()
		.min(1, "Purpose is required")
		.max(100, "Purpose must be 100 characters or less"),
	description: z
		.string()
		.min(1, "Description is required")
		.max(2000, "Description must be 2000 characters or less"),
	targetFigure: z
		.number()
		.positive("Target amount must be greater than 0")
		.min(0.02, "Minimum target is 0.02 ETH"),
	targetDeadline: z
		.date()
		.refine((date) => date > new Date(), "Deadline must be in the future"),
});

export const GetUserSchema = z.object({
	userId: z.string().min(1, { message: "The UserId is required" }),
});
