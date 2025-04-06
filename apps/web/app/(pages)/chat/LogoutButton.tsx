'use client'

import { Button } from '@/components/ui/button'
import axios from 'axios'
import React from 'react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

const LogoutButton = () => {

    const router = useRouter()

    return (
        <Button type='button' onClick={async () => {
            const response = await axios("http://localhost:8080/auth/logout", {
                withCredentials: true,
            })

            if (response.status === 200) {
                toast("User logged out successfully")
                setTimeout(() => {
                    router.push("/login")
                }, 1000);
            } else {
                toast("Something went wrong")
            }

        }} variant="outline" size="sm">Logout</Button>
    )
}

export default LogoutButton