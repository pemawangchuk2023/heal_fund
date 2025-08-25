"use server";

import { GetUserSchema, SignInSchema, SignUpSchema } from "@/lib/validation";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import connectToDatabase from "@/lib/mongoose";
import {
	GetUserParams,
	UserAuthCredentials,
	UserSignInCredentials,
} from "@/types/action";
import User, { IUser } from "@/database/user.model";
import {
	action,
	ActionResponse,
	ErrorResponse,
	handleError,
} from "@/lib/handlers/error";

export async function signUpWithCredentials({
	params,
	schema = SignUpSchema,
}: {
	params: UserAuthCredentials;
	schema?: typeof SignUpSchema;
}): Promise<
	ActionResponse<{
		id: string;
		email: string;
		name: string;
		age: number;
		sex: string;
		cid: string;
		publicKey: string;
		location: string;
		contactNumber: string;
	}>
> {
	try {
		const validatedResult = schema.safeParse(params);
		if (!validatedResult.success) {
			return handleError(new Error("Validation failed"));
		}
		const { password, ...patientData } = validatedResult.data;

		await connectToDatabase();
		const session = await mongoose.startSession();
		session.startTransaction();

		try {
			const existingUser = await User.exists({
				email: patientData.email,
			}).session(session);

			if (existingUser) {
				return handleError(new Error("The user already exists"));
			}

			const hashedPassword = await bcrypt.hash(password, 10);

			const [newUser] = await User.create(
				[{ ...patientData, password: hashedPassword }],
				{ session }
			);

			await session.commitTransaction();

			return {
				success: true,
				data: {
					id: newUser._id.toString(),
					email: newUser.email,
					name: newUser.name,
					age: newUser.age,
					sex: newUser.sex,
					cid: newUser.cid,
					publicKey: newUser.publicKey,
					location: newUser.location,
					contactNumber: newUser.contactNumber,
				},
			};
		} catch (error) {
			await session.abortTransaction();
			return handleError(error);
		} finally {
			session.endSession();
		}
	} catch (error) {
		return handleError(error);
	}
}

export async function signInWithCredentials(
	params: Pick<UserSignInCredentials, "email" | "password">
): Promise<
	ActionResponse<{
		role: "admin" | "user";
		id: string;
		email: string;
		name: string;
	}>
> {
	const validationResult = SignInSchema.safeParse(params);

	if (!validationResult.success) {
		return handleError(new Error("Validation failed"));
	}

	const { email, password } = validationResult.data;

	try {
		await connectToDatabase();

		const user = await User.findOne({ email });
		console.log("The signed user is", { user });
		if (!user) {
			return handleError(new Error("User not found"));
		}
		const passwordMatch = await bcrypt.compare(password, user.password);
		if (!passwordMatch) {
			return handleError(new Error("Incorrect password"));
		}
		return {
			success: true,
			data: {
				id: user._id.toString(),
				email: user.email,
				name: user.name,
				role: "admin",
			},
		};
	} catch (error) {
		return handleError(error);
	}
}
export async function getCurrentUser(
	params: GetUserParams
): Promise<ActionResponse<{ user: IUser }>> {
	console.log("getCurrentUser called with params:", params);

	const validationResult = await action({ params, schema: GetUserSchema });

	if (validationResult instanceof Error) {
		return handleError(validationResult) as ErrorResponse;
	}
	const { userId } = params;
	try {
		await connectToDatabase();
		const user = await User.findById(userId);
		if (!user) throw new Error("User not found");
		return {
			success: true,
			data: {
				user: JSON.parse(JSON.stringify(user)),
			},
		};
	} catch (error) {
		return handleError(error) as ErrorResponse;
	}
}
