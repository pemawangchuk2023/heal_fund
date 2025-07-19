"use client";

import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { faqs } from "@/constants/faq";

const FAQ = () => {
	return (
		<div className='flex min-h-screen items-center justify-center py-12 md:py-20'>
			<div className='w-full max-w-3xl mx-auto'>
				{/* Header Section */}
				<div className='text-center mb-12'>
					<CardHeader className='space-y-4'>
						<CardTitle className='text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
							Frequently Asked Questions
						</CardTitle>
						<p className='text-xl text-muted-foreground max-w-2xl mx-auto'>
							Find answers to common questions about our platform and support
							services.
						</p>
					</CardHeader>
				</div>
				<CardContent className='px-6 py-4 sm:px-8'>
					<Accordion type='single' collapsible className='w-full'>
						{faqs.map((faq, index) => (
							<AccordionItem key={index} value={`item-${index}`}>
								<AccordionTrigger className='text-left text-[22px] bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent py-4'>
									{faq.question}
								</AccordionTrigger>
								<AccordionContent className='text-[20px] text-foreground pb-4 pt-2'>
									{faq.answer}
								</AccordionContent>
							</AccordionItem>
						))}
					</Accordion>
				</CardContent>
			</div>
		</div>
	);
};

export default FAQ;
