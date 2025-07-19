"use client";

import {
	MDXEditor,
	type MDXEditorMethods,
	UndoRedo,
	BoldItalicUnderlineToggles,
	toolbarPlugin,
	headingsPlugin,
	listsPlugin,
	linkPlugin,
	quotePlugin,
	markdownShortcutPlugin,
	linkDialogPlugin,
	CreateLink,
	InsertImage,
	InsertTable,
	tablePlugin,
	imagePlugin,
	InsertThematicBreak,
	diffSourcePlugin,
	Separator,
	ListsToggle,
} from "@mdxeditor/editor";
import { useTheme } from "next-themes";
import { type Ref, useState, useEffect } from "react";
import DOMPurify from "dompurify";
import markdownIt from "markdown-it";
import "@mdxeditor/editor/style.css";
import { Button } from "@/components/ui/button";
import { Eye, Edit3 } from "lucide-react";

const md = new markdownIt();

interface Props {
	value: string;
	editorRef: Ref<MDXEditorMethods> | null;
	fieldChange: (value: string) => void;
}

const Editor = ({ value, editorRef, fieldChange }: Props) => {
	const { resolvedTheme } = useTheme();
	const [preview, setPreview] = useState(false);
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	// Sanitize and render Markdown for preview
	const sanitizedHTML = DOMPurify.sanitize(md.render(value));

	if (!mounted) {
		return (
			<div className='w-full h-96 bg-muted animate-pulse rounded-lg border' />
		);
	}

	return (
		<div className='w-full space-y-4'>
			{/* Header with toggle button */}
			<div className='flex items-center justify-between'>
				<div className='flex items-center space-x-2'>
					<h3 className='text-xl font-semibold text-foreground'>
						{preview ? "Preview" : "Editor"}
					</h3>
				</div>
				<Button
					onClick={() => setPreview(!preview)}
					variant='outline'
					size='sm'
					className='flex items-center space-x-2 rounded-none cursor-pointer'
				>
					{preview ? (
						<>
							<Edit3 className='h-4 w-4' />
							<span>Edit</span>
						</>
					) : (
						<>
							<Eye className='h-4 w-4' />
							<span>Preview</span>
						</>
					)}
				</Button>
			</div>

			{/* Editor/Preview Container */}
			<div className='relative'>
				{preview ? (
					<div className='min-h-[400px] w-full rounded-none border'>
						<div className='p-6'>
							<div
								className='prose prose-slate max-w-none dark:prose-invert prose-headings:text-foreground prose-p:text-foreground prose-strong:text-foreground prose-code:text-foreground prose-pre:bg-muted prose-pre:text-foreground prose-blockquote:text-muted-foreground prose-blockquote:border-l-border prose-th:text-foreground prose-td:text-foreground prose-a:text-primary hover:prose-a:text-primary/80'
								dangerouslySetInnerHTML={{ __html: sanitizedHTML }}
							/>
							{!value.trim() && (
								<div className='flex items-center justify-center h-32 text-red-500'>
									<p>Nothing to preview yet. Start writing in the editor!</p>
								</div>
							)}
						</div>
					</div>
				) : (
					<div className='editor-container rounded-none border'>
						<MDXEditor
							key={resolvedTheme}
							markdown={value}
							ref={editorRef}
							onChange={fieldChange}
							className={`mdx-editor ${
								resolvedTheme === "dark" ? "dark-theme" : "light-theme"
							}`}
							plugins={[
								headingsPlugin(),
								listsPlugin(),
								linkPlugin(),
								linkDialogPlugin(),
								quotePlugin(),
								markdownShortcutPlugin(),
								tablePlugin(),
								imagePlugin(),
								diffSourcePlugin({
									viewMode: "rich-text",
									diffMarkdown: value,
								}),
								toolbarPlugin({
									toolbarContents: () => (
										<div className='flex items-center space-x-1 p-2'>
											<UndoRedo />
											<Separator />
											<BoldItalicUnderlineToggles />
											<Separator />
											<ListsToggle />
											<Separator />
											<CreateLink />
											<InsertImage />
											<Separator />
											<InsertTable />
											<InsertThematicBreak />
										</div>
									),
								}),
							]}
						/>
					</div>
				)}
			</div>
		</div>
	);
};

export default Editor;
