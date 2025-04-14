'use client'

import {
    generateUploadButton,
} from "@uploadthing/react";
import type { UploadRouter } from "@/app/api/uploadthing/core";

export const UploadButton = generateUploadButton<UploadRouter>();

import React from 'react'
import { toast } from "sonner";

const ProfilePictureUploadButtonComponent = ({
    setProfileImageUrl
}: {
    setProfileImageUrl: React.Dispatch<React.SetStateAction<string>>
}) => {
    return (
        <UploadButton
            appearance={{
                button({ ready, isUploading }) {
                    return {
                        color: "white",
                        backgroundColor: "black",
                        ...(ready && { color: "white" }),
                        ...(isUploading && { color: "white", backgroundColor: "black" }),
                    };
                },
                container: {
                    marginTop: "1rem",
                },
                allowedContent: {
                    color: "#a1a1aa",
                },
            }}
            endpoint="profilePicture"
            onClientUploadComplete={(res) => {
                setProfileImageUrl(res[0].ufsUrl)
            }}
            onUploadError={(error: Error) => {
                toast(error.message)
            }}
        />
    )
}

export default ProfilePictureUploadButtonComponent