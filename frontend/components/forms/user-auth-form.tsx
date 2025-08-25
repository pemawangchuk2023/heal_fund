"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { Button } from "@/components/ui/button";
import { SignUpSchema, SignInSchema } from "@/lib/validation";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
	signInWithCredentials,
	signUpWithCredentials,
} from "@/lib/actions/user.action";
import { signIn } from "next-auth/react";

// Define types for both forms
type SignUpFormValues = z.infer<typeof SignUpSchema>;
type SignInFormValues = z.infer<typeof SignInSchema>;
type UserAuthFormValues = SignUpFormValues | SignInFormValues;

interface UserAuthFormProps {
	type: "sign-up" | "sign-in";
}

const UserAuthForm = ({ type }: UserAuthFormProps) => {
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();
	const isSignUp = type === "sign-up";

	// Use different schemas and default values based on type
	const form = useForm<UserAuthFormValues>({
		resolver: zodResolver(isSignUp ? SignUpSchema : SignInSchema),
		defaultValues: isSignUp
			? {
					name: "",
					age: 0,
					sex: "",
					email: "",
					password: "",
					cid: 0,
					publicKey: "",
					location: "",
					contactNumber: 0,
			  }
			: {
					email: "",
					password: "",
			  },
	});
	const onSubmit = async (values: UserAuthFormValues) => {
		setIsLoading(true);

		try {
			if (isSignUp) {
				const user = await signUpWithCredentials({
					params: values as SignUpFormValues,
				});
				if (!user) {
					return null;
				}
				router.push("/sign-in");
			} else {
				// First, verify credentials via your server action
				const result = await signInWithCredentials(values as SignInFormValues);
				if (!result.success) {
					throw new Error("Invalid email or password");
				}

				// Then, start session using Auth.js
				const res = await signIn("credentials", {
					email: values.email,
					password: values.password,
					redirect: false,
				});

				if (res?.error) {
					throw new Error(res.error);
				}

				router.push("/dashboard");
			}
		} catch (error) {
			form.setError("root", {
				message:
					error instanceof Error
						? error.message
						: `${isSignUp ? "Registration" : "Sign in"} failed`,
			});
		} finally {
			setIsLoading(false);
		}
	};
	return (
		<div className='w-full'>
			{/* Subtle Background Elements */}
			<div className='absolute inset-0 overflow-hidden pointer-events-none'>
				<div className='absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-blue-400/10 to-purple-600/10 rounded-full blur-2xl animate-pulse'></div>
				<div className='absolute -bottom-20 -left-20 w-40 h-40 bg-gradient-to-br from-pink-400/10 to-orange-600/10 rounded-full blur-2xl animate-pulse delay-1000'></div>
			</div>

			<div className='relative z-10 w-full p-4'>
				{/* Dynamic Header */}
				<div className='text-center mb-6'>
					<div className='inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg mb-3'>
						<div className='w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center'>
							<div className='w-3 h-3 bg-white rounded-sm'></div>
						</div>
					</div>
					<h1 className='text-xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-purple-900 dark:from-white dark:via-blue-100 dark:to-purple-100 bg-clip-text text-transparent mb-2'>
						{isSignUp ? "Create Account" : "Welcome Back"}
					</h1>
					<p className='text-sm text-foreground/80 font-medium'>
						{isSignUp
							? "Join our health contribution platform"
							: "Sign in to your account"}
					</p>
				</div>

				{/* Form Container */}
				<div className='w-full p-4'>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
							{/* Sign In Fields */}
							{!isSignUp && (
								<div className='space-y-4'>
									<div className='flex items-center space-x-2 mb-3'>
										<div className='w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center'>
											<div className='w-4 h-4 bg-white/90 rounded-sm'></div>
										</div>
										<div>
											<h2 className='text-base font-semibold text-foreground'>
												Account Credentials
											</h2>
										</div>
									</div>
									<div className='space-y-3'>
										{/* Email */}
										<FormField
											control={form.control}
											name='email'
											render={({ field }) => (
												<FormItem>
													<FormLabel className='text-sm font-medium text-foreground'>
														Email Address
													</FormLabel>
													<FormControl>
														<Input
															type='email'
															placeholder='pemawangchuk@ymail.com'
															className='h-10 text-sm'
															{...field}
														/>
													</FormControl>
													<FormMessage className='text-red-500 text-xs' />
												</FormItem>
											)}
										/>
										{/* Password */}
										<FormField
											control={form.control}
											name='password'
											render={({ field }) => (
												<FormItem>
													<FormLabel className='text-sm font-medium text-foreground'>
														Password
													</FormLabel>
													<FormControl>
														<Input
															type='password'
															placeholder='Enter your password'
															className='h-10 text-sm'
															{...field}
														/>
													</FormControl>
													<FormMessage className='text-red-500 text-xs' />
												</FormItem>
											)}
										/>
									</div>
								</div>
							)}

							{/* Sign Up Fields */}
							{isSignUp && (
								<>
									{/* Personal Information */}
									<div className='space-y-4'>
										<div className='flex items-center space-x-2 mb-3'>
											<div className='w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center'>
												<div className='w-4 h-4 bg-white/90 rounded-sm'></div>
											</div>
											<div>
												<h2 className='text-base font-semibold text-foreground'>
													Personal Information
												</h2>
											</div>
										</div>
										<div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
											{/* Name */}
											<FormField
												control={form.control}
												name='name'
												render={({ field }) => (
													<FormItem>
														<FormLabel className='text-sm font-medium text-foreground'>
															Full Name
														</FormLabel>
														<FormControl>
															<Input
																placeholder='Enter Your Full Name'
																className='h-9 text-sm'
																{...field}
															/>
														</FormControl>
														<FormMessage className='text-red-500 text-xs' />
													</FormItem>
												)}
											/>
											{/* Age */}
											<FormField
												control={form.control}
												name='age'
												render={({ field }) => (
													<FormItem>
														<FormLabel className='text-sm font-medium text-foreground'>
															Age
														</FormLabel>
														<FormControl>
															<Input
																type='number'
																placeholder='Enter Your Age'
																className='h-9 text-sm'
																{...field}
															/>
														</FormControl>
														<FormMessage className='text-red-500 text-xs' />
													</FormItem>
												)}
											/>
											{/* Sex */}
											<FormField
												control={form.control}
												name='sex'
												render={({ field }) => (
													<FormItem>
														<FormLabel className='text-sm font-medium text-foreground'>
															Sex
														</FormLabel>
														<FormControl>
															<Input
																placeholder='Enter Your Sex'
																className='h-9 text-sm'
																{...field}
															/>
														</FormControl>
														<FormMessage className='text-red-500 text-xs' />
													</FormItem>
												)}
											/>
											{/* Email */}
											<FormField
												control={form.control}
												name='email'
												render={({ field }) => (
													<FormItem>
														<FormLabel className='text-sm font-medium text-foreground'>
															Email Address
														</FormLabel>
														<FormControl>
															<Input
																type='email'
																placeholder='pemawangchuk@ymail.com'
																className='h-9 text-sm'
																{...field}
															/>
														</FormControl>
														<FormMessage className='text-red-500 text-xs' />
													</FormItem>
												)}
											/>
										</div>
									</div>

									{/* Account Security */}
									<div className='space-y-4'>
										<div className='flex items-center space-x-2 mb-3'>
											<div className='w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center'>
												<div className='w-4 h-4 bg-white/90 rounded-sm'></div>
											</div>
											<div>
												<h2 className='text-base font-semibold text-foreground'>
													Account Security
												</h2>
											</div>
										</div>
										<div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
											{/* Password */}
											<FormField
												control={form.control}
												name='password'
												render={({ field }) => (
													<FormItem>
														<FormLabel className='text-sm font-medium text-foreground'>
															Password
														</FormLabel>
														<FormControl>
															<Input
																type='password'
																placeholder='Create strong password'
																className='h-9 text-sm'
																{...field}
															/>
														</FormControl>
														<FormMessage className='text-red-500 text-xs' />
													</FormItem>
												)}
											/>
											{/* CID */}
											<FormField
												control={form.control}
												name='cid'
												render={({ field }) => (
													<FormItem>
														<FormLabel className='text-sm font-medium text-foreground'>
															Citizen ID
														</FormLabel>
														<FormControl>
															<Input
																placeholder='11505443318'
																className='h-9 text-sm'
																maxLength={11}
																{...field}
															/>
														</FormControl>
														<FormMessage className='text-red-500 text-xs' />
													</FormItem>
												)}
											/>
											{/* Public Key - Full width */}
											<div className='sm:col-span-2'>
												<FormField
													control={form.control}
													name='publicKey'
													render={({ field }) => (
														<FormItem>
															<FormLabel className='text-sm font-medium text-foreground'>
																Wallet Address
															</FormLabel>
															<FormControl>
																<Input
																	placeholder='0x7A853a6480F4D7dB79AE91c16c960dBbB6710d25'
																	className='h-9 text-sm w-3/4'
																	{...field}
																/>
															</FormControl>
															<FormMessage className='text-red-500 text-xs' />
														</FormItem>
													)}
												/>
											</div>
										</div>
									</div>

									{/* Contact Information */}
									<div className='space-y-4'>
										<div className='flex items-center space-x-2 mb-3'>
											<div className='w-8 h-8 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center'>
												<div className='w-4 h-4 bg-white/90 rounded-sm'></div>
											</div>
											<div>
												<h2 className='text-base font-semibold text-foreground'>
													Contact Details
												</h2>
											</div>
										</div>
										<div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
											{/* Location */}
											<FormField
												control={form.control}
												name='location'
												render={({ field }) => (
													<FormItem>
														<FormLabel className='text-sm font-medium text-foreground'>
															Location
														</FormLabel>
														<FormControl>
															<Input
																placeholder='Thimphu, Bhutan'
																className='h-9 text-sm'
																{...field}
															/>
														</FormControl>
														<FormMessage className='text-red-500 text-xs' />
													</FormItem>
												)}
											/>
											{/* Contact Number */}
											<FormField
												control={form.control}
												name='contactNumber'
												render={({ field }) => (
													<FormItem>
														<FormLabel className='text-sm font-medium text-foreground'>
															Phone Number
														</FormLabel>
														<FormControl>
															<Input
																placeholder='+975-17-123456'
																className='h-9 text-sm'
																{...field}
															/>
														</FormControl>
														<FormMessage className='text-red-500 text-xs' />
													</FormItem>
												)}
											/>
										</div>
									</div>
								</>
							)}

							{/* Error Message */}
							{form.formState.errors.root && (
								<div className='text-red-500 text-sm text-center'>
									{form.formState.errors.root.message}
								</div>
							)}

							{/* Submit Button */}
							<div className='pt-4 text-center'>
								<Button
									type='submit'
									variant='destructive'
									disabled={isLoading}
									className='w-fit h-10 text-sm rounded-none font-semibold cursor-pointer'
								>
									{isLoading
										? isSignUp
											? "Registering..."
											: "Signing in..."
										: isSignUp
										? "Register"
										: "Sign In"}
								</Button>
							</div>

							{/* Toggle Link */}
							<div className='text-center text-sm text-foreground/70'>
								{isSignUp ? (
									<>
										Already have an account?{" "}
										<Link
											href='/sign-in'
											className='text-blue-600 hover:underline font-medium'
										>
											Sign in
										</Link>
									</>
								) : (
									<>
										{"Don't have an account?"}{" "}
										<Link
											href='/sign-up'
											className='text-blue-600 hover:underline font-medium'
										>
											Sign up
										</Link>
									</>
								)}
							</div>
						</form>
					</Form>
				</div>
			</div>
		</div>
	);
};

export default UserAuthForm;
