import { type ZodSchema } from "zod";

export type ActionResponse<T = unknown> =
	| { success: true; data: T }
	| ErrorResponse;

export type ErrorResponse = {
	success: false;
	message: string;
};

export function handleError(error: unknown): ErrorResponse {
	if (error instanceof Error) {
		return { success: false, message: error.message };
	}
	return { success: false, message: "Something went wrong. Please try again" };
}

export async function action<T>({
	params,
	schema,
}: {
	params: unknown;
	schema: ZodSchema<T>;
}): Promise<ActionResponse<T>> {
	const result = schema.safeParse(params);
	if (!result.success) {
		return handleError(new Error("Validation failed"));
	}
	return { success: true, data: result.data };
}
