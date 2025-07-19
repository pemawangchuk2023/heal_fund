"use client";
import UserAuthForm from "@/components/forms/user-auth-form";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import React from "react";

const SignIn = () => {
	const router = useRouter();
	return (
		<div className='flex-center size-full max-sm:px-6'>
			<UserAuthForm type='sign-in' />
			<Button
				variant='destructive'
				className='mt-2 mb-2 rounded-xl cursor-pointer'
				onClick={() => router.push("/")}
			>
				Back to Home
			</Button>
		</div>
	);
};

export default SignIn;
