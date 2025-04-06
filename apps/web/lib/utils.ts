import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

// export const UploadDropzone = generateUploadDropzone<OurFileRouter>();

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
