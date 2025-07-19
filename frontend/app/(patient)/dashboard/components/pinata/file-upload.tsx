"use client";

import type React from "react";

import { useState, useCallback, useMemo } from "react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import type { FileUploadProps } from "@/types/action";

const FileUpload = ({ onUploadComplete }: FileUploadProps) => {
	const [file, setFile] = useState<File | null>(null);
	const [imageUrl, setImageUrl] = useState<string | null>(null);
	const [ipfsUrl, setIpfsUrl] = useState<string>("");
	const [uploading, setUploading] = useState<boolean>(false);

	// Handle file selection via dropzone
	const onDrop = useCallback((acceptedFiles: File[]) => {
		const selectedFile = acceptedFiles[0];
		if (selectedFile) {
			setFile(selectedFile);
			if (selectedFile.type.startsWith("image/")) {
				const url = URL.createObjectURL(selectedFile);
				setImageUrl(url);
			} else {
				setImageUrl(null);
			}
		}
	}, []);

	const {
		getRootProps,
		getInputProps,
		isDragActive,
		isDragAccept,
		isDragReject,
	} = useDropzone({
		onDrop,
		accept: {
			"image/*": [".jpg", ".png", ".gif", ".svg", ".webp"],
			"application/pdf": [".pdf"],
		},
		maxSize: 100 * 1024 * 1024,
		multiple: false,
	});

	const dropzoneStyles = useMemo(
		() =>
			cn(
				"border-2 border-dashed border-muted-foreground p-6 flex flex-col items-center justify-center text-center rounded-md",
				isDragActive && "border-primary bg-primary/10",
				isDragAccept && "border-green-500 bg-green-500/10",
				isDragReject && "border-destructive bg-destructive/10"
			),
		[isDragActive, isDragAccept, isDragReject]
	);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const selectedFile = e.target?.files?.[0];
		if (selectedFile) {
			setFile(selectedFile);
			if (selectedFile.type.startsWith("image/")) {
				const url = URL.createObjectURL(selectedFile);
				setImageUrl(url);
			} else {
				setImageUrl(null);
			}
		}
	};

	const uploadFile = async () => {
		try {
			if (!file) {
				alert("No file selected");
				return;
			}
			setUploading(true);
			const data = new FormData();
			data.set("file", file);
			const uploadRequest = await fetch("/api/files", {
				method: "POST",
				body: data,
			});
			const signedUrl = await uploadRequest.json();
			setIpfsUrl(signedUrl);
			onUploadComplete(signedUrl);
			setUploading(false);
		} catch (e) {
			console.log(e);
			setUploading(false);
			alert("Trouble uploading file");
		}
	};

	// Clear selected file and revoke URL
	const handleClear = () => {
		if (imageUrl) {
			URL.revokeObjectURL(imageUrl);
		}
		setImageUrl(null);
		setFile(null);
		setIpfsUrl("");
		onUploadComplete("");
	};

	return (
		<div className='w-full max-w-md mx-auto mt-8'>
			<CardContent className='p-6'>
				<div className='space-y-4'>
					<h2 className='text-xl font-semibold text-red-500 text-center'>
						Upload Medical Evidence in PDF or Image Format
					</h2>
					<div {...getRootProps()} className={dropzoneStyles}>
						<input {...getInputProps()} onChange={handleChange} />
						<div className='space-y-2 cursor-pointer'>
							<Image
								src='/assets/upload.png'
								alt='Upload icon'
								width={48}
								height={48}
								className='mx-auto'
							/>
							<p className='text-sm font-medium text-foreground'>
								JPG, PNG, GIF, SVG, WEBP, PDF (Max 100MB)
							</p>
							<p className='text-sm text-muted-foreground'>
								Drag and drop or click to browse
							</p>
						</div>
					</div>
					{file && (
						<div className='mt-4'>
							<p className='text-sm font-medium text-foreground mb-2'>
								Selected File:
							</p>
							{imageUrl && file.type.startsWith("image/") ? (
								<Image
									src={imageUrl}
									alt='Selected image'
									width={300}
									height={300}
									className='w-full h-auto rounded-md object-contain'
								/>
							) : (
								<p className='text-sm text-foreground'>
									{file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
								</p>
							)}
						</div>
					)}
					<div className='space-y-2 mt-4'>
						<Button
							variant='outline'
							className='w-full cursor-pointer border-2 rounded-none bg-green-500 cursor-pointer'
							onClick={uploadFile}
							disabled={uploading || !file}
						>
							{uploading ? "Uploading..." : "Upload to IPFS"}
						</Button>
						{file && (
							<Button
								variant='outline'
								className='w-full text-red-500 cursor-pointer'
								onClick={handleClear}
							>
								Clear File
							</Button>
						)}
					</div>
					{ipfsUrl && (
						<div className='mt-4'>
							<p className='text-sm font-medium text-foreground'>IPFS URL:</p>
							<Link
								href={ipfsUrl}
								target='_blank'
								rel='noopener noreferrer'
								className='text-sm text-blue-500 break-all'
							>
								{ipfsUrl}
							</Link>
						</div>
					)}
				</div>
			</CardContent>
		</div>
	);
};

export default FileUpload;
