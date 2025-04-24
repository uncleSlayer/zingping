'use client'

import { Button } from '@/components/ui/button'
import axios from 'axios'
import React from 'react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { API_HOST } from '@/config/host'

const LogoutButton = () => {

    const router = useRouter()

    return (
        <Button type='button' onClick={async () => {
            const response = await axios(`${API_HOST}/auth/logout`, {
                withCredentials: true,
            })

            if (response.status === 200) {
                toast("User logged out successfully")
                setTimeout(() => {
                    window.location.href = "/login"
                }, 1000);
            } else {
                toast("Something went wrong")
            }

        }} variant="outline" size="sm">Logout</Button>
    )
}

export default LogoutButton