"use client";

import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type * as z from "zod";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "sonner";
import { Calendar } from "@/components/ui/calendar";
import type { MDXEditorMethods } from "@mdxeditor/editor";
import { cn } from "@/lib/utils";
import { useHealFund } from "@/context/heal-fund-provider";
import { proposalSchema } from "@/lib/validation";
import Image from "next/image";
import { useRouter } from "next/navigation";
import FileUpload from "@/app/(patient)/dashboard/components/pinata/file-upload";

// Dynamic import for Editor component
const Editor = dynamic(
	() => import("@/app/(patient)/dashboard/components/editor/editor"),
	{
		ssr: false,
	}
);

// Define form data type based on schema
type FormData = z.infer<typeof proposalSchema>;

const SubmitProposal = () => {
	const router = useRouter();
	const editorRef = useRef<MDXEditorMethods>(null);

	const { submitFundSupportProposal, currentAccount } = useHealFund();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [ipfsHash, setIpfsHash] = useState<string>("");

	const form = useForm<FormData>({
		resolver: zodResolver(proposalSchema),
		defaultValues: {
			purpose: "",
			description: "",
			targetFigure: 0.02,
			targetDeadline: new Date(),
		},
	});

	// Handle form submission
	const onSubmit = async (data: FormData) => {
		if (!currentAccount) {
			toast.error("Please connect your wallet");
			return;
		}
		if (!ipfsHash) {
			toast.error("Please upload a file first");
			return;
		}
		setIsSubmitting(true);

		try {
			await submitFundSupportProposal(
				data.purpose,
				data.description,
				ipfsHash,
				data.targetFigure,
				data.targetDeadline
			);
			toast.success("You have successfully submitted the proposal");
			await new Promise((resolve) => setTimeout(resolve, 1000));
			router.push("/dashboard/admin");
			form.reset();
		} catch (error) {
			console.error("Error proposing health appeal:", error);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className='min-h-screen py-8 px-4 sm:px-6 lg:px-8'>
			<div className='max-w-4xl mx-auto'>
				{/* Header Section */}
				<div className='text-center mb-8 lg:mb-12'>
					<h1 className='text-3xl sm:text-4xl lg:text-5xl font-bold text-yellow-500 mb-4'>
						Apply for Web3 Crowdfunding Support via Official Portal
					</h1>
					<p className='text-xl text-foreground max-w-2xl mx-auto capitalize'>
						Submit your fund support proposal with medical evidences and attach
						image
					</p>
				</div>
				{/* Main Form Card */}
				<div className='border-0'>
					<CardHeader className='pb-8'>
						<CardTitle className='text-2xl font-semibold flex items-center gap-2'>
							Appeal Details
						</CardTitle>
						<CardDescription className='text-foreground font-bold capitalize'>
							Provide comprehensive information about your health appeal to help
							potential donors understand your situation.
						</CardDescription>
					</CardHeader>
					<CardContent className='space-y-8'>
						<Form {...form}>
							<form
								onSubmit={(e) => {
									console.log("Form submission triggered");
									form.handleSubmit(onSubmit)(e);
								}}
								className='space-y-8'
							>
								{/* Purpose Field */}
								<FormField
									control={form.control}
									name='purpose'
									render={({ field }) => (
										<FormItem className='space-y-3'>
											<FormLabel className='text-foreground font-medium flex items-center gap-2'>
												Purpose of Seeking Fund Support
											</FormLabel>
											<FormControl>
												<Input
													placeholder='e.g., Emergency Surgery, Cancer Treatment, Bone Marrow Transplant'
													className='h-12 text-foreground border-2 rounded-none'
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								{/* Description Field */}
								<FormField
									control={form.control}
									name='description'
									render={({ field }) => (
										<FormItem className='space-y-3'>
											<FormLabel className='text-foreground font-medium flex items-center gap-2 capitalize'>
												Write your application for fund support here
											</FormLabel>
											<FormControl>
												<Card className='border-2'>
													<CardContent className='p-0'>
														<div className='min-h-[250px] sm:min-h-[300px] lg:min-h-[400px]'>
															<Editor
																editorRef={editorRef}
																value={field.value}
																fieldChange={field.onChange}
															/>
														</div>
													</CardContent>
												</Card>
											</FormControl>
											<p className='text-sm text-muted-foreground'>
												Provide a detailed explanation of your medical
												situation, treatment needed, and why you need financial
												assistance.
											</p>
											<FormMessage />
										</FormItem>
									)}
								/>

								{/* Target Figure and Deadline Row */}
								<div className='grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8'>
									{/* Target Figure Field */}
									<FormField
										control={form.control}
										name='targetFigure'
										render={({ field }) => (
											<FormItem className='space-y-3'>
												<FormLabel className='text-foreground font-medium flex items-center gap-2'>
													<Image
														src='/assets/ethereum.png'
														alt='ethereum'
														width={45}
														height={45}
													/>
													Target Amount (ETH)
												</FormLabel>
												<FormControl>
													<div className='relative'>
														<Input
															type='number'
															step='0.01'
															placeholder='e.g., 1.0'
															className='h-12 text-foreground border-2 rounded-none pl-12'
															{...field}
															onChange={(e) =>
																field.onChange(
																	Number.parseFloat(e.target.value)
																)
															}
														/>
													</div>
												</FormControl>
												<p className='text-sm text-muted-foreground'>
													Enter the amount of ETH you need to raise for your
													medical expenses.
												</p>
												<FormMessage />
											</FormItem>
										)}
									/>
									{/* The image upload here */}
									<div>
										<FormItem className='space-y-3'>
											<FormLabel className='text-foreground flex items-center gap-2'>
												<Image
													src='/assets/upload.svg'
													alt='upload'
													width={45}
													height={45}
												/>
												Image and File Upload
											</FormLabel>
										</FormItem>
										<FileUpload onUploadComplete={setIpfsHash} />
									</div>
									{/* Target Deadline Field */}
									<FormField
										control={form.control}
										name='targetDeadline'
										render={({ field }) => (
											<FormItem className='space-y-3'>
												<FormLabel className='text-foreground font-medium flex items-center gap-2'>
													<Image
														src='/assets/calendar.svg'
														alt='calendar'
														width={45}
														height={45}
													/>
													Target Deadline
												</FormLabel>
												<FormControl>
													<Popover>
														<PopoverTrigger asChild>
															<Button
																variant='outline'
																className={cn(
																	"w-full h-12 justify-start text-left font-normal cursor-pointer rounded-none",
																	!field.value && "text-foreground"
																)}
															>
																{field.value
																	? field.value.toLocaleDateString("en-US", {
																			weekday: "short",
																			year: "numeric",
																			month: "short",
																			day: "numeric",
																	  })
																	: "Select deadline date"}
															</Button>
														</PopoverTrigger>
														<PopoverContent
															className='w-auto p-0'
															align='start'
															side='top'
														>
															<Calendar
																mode='single'
																selected={field.value}
																onSelect={field.onChange}
																disabled={(date) => date < new Date()}
																autoFocus
															/>
														</PopoverContent>
													</Popover>
												</FormControl>
												<p className='text-sm text-muted-foreground'>
													Choose when you need to reach your funding goal.
												</p>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>
								{/* Account Status Warning */}
								{!currentAccount && (
									<Card className='border-destructive/50 bg-destructive/5'>
										<CardContent className='pt-6'>
											<div className='flex items-center gap-3'>
												<div className='w-2 h-2 bg-destructive rounded-full'></div>
												<p className='text-sm text-destructive font-medium'>
													Please connect your wallet to submit a health appeal
													proposal.
												</p>
											</div>
										</CardContent>
									</Card>
								)}
								{/* Submit Button */}
								<div className='flex flex-col sm:flex-row gap-4 pt-6'>
									<Button
										type='submit'
										variant='outline'
										disabled={isSubmitting || !currentAccount || !ipfsHash}
										className='flex-1 sm:flex-none h-12 px-8 border-2 text-orange-500 font-extrabold rounded-none cursor-pointer'
									>
										{isSubmitting ? (
											<>
												<div className='flex items-center justify-center gap-2'>
													<Image
														src='/assets/loader.gif'
														alt='Loading...'
														width={24}
														height={24}
														className='h-6 w-6'
													/>
													<span>Processing Transaction...</span>
												</div>
											</>
										) : (
											<>Submit Health Appeal</>
										)}
									</Button>

									<Button
										type='button'
										variant='destructive'
										onClick={() => form.reset()}
										className='h-12 px-6 text-foreground cursor-pointer rounded-none border-2 hover:bg-muted/50'
										disabled={isSubmitting}
									>
										Reset Form
									</Button>
								</div>
							</form>
						</Form>
					</CardContent>
				</div>
				{/* Footer Info */}
				<div className='mt-8 text-center'>
					<p className='text-sm text-foreground font-bold'>
						Your fund support request will be reviewed and made available to
						contributors once submitted.You can log out and see at the website
					</p>
				</div>
			</div>
		</div>
	);
};

export default SubmitProposal;
