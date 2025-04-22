'use client'
import * as z from 'zod'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import axios from 'axios'
import { useState } from 'react'
import SuccessSearchDialog from "./SuccessSearchDialog";
import { Loader } from 'lucide-react'
import { toast } from 'sonner'
import { API_HOST } from '@/config/host'

const contactFormSchema = z.object({
    email: z.string().email()
})

const SearchForm = () => {
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const searchedUserDefaultValue = { id: '', name: '', email: '', imageUrl: '' }
    const [isLoading, setIsLoading] = useState(false)
    const [searchedUser, setSearchedUser] = useState<{
        id: string,
        name: string,
        email: string,
        imageUrl: string
    }>(searchedUserDefaultValue)

    const contactForm = useForm<z.infer<typeof contactFormSchema>>({
        resolver: zodResolver(contactFormSchema),
        defaultValues: { email: '' }
    })

    const onContactFormSubmit = async (data: z.infer<typeof contactFormSchema>) => {
        try {
            setIsLoading(true)
            const response = await axios.get(`${API_HOST}/friend/search`, {
                params: { email: data.email },
                withCredentials: true,
                headers: { 'Content-Type': 'application/json' }
            })

            if (response.status === 200) {
                setSearchedUser(response.data.data)
                setIsDialogOpen(true)
            } else {
                toast.error("User not found")
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Something went wrong")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <>
            <Form {...contactForm}>
                <form onSubmit={contactForm.handleSubmit(onContactFormSubmit)}>
                    <FormField
                        control={contactForm.control}
                        name='email'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input {...field} type='text' className='my-2' placeholder='abc@xyz.com' />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button disabled={isLoading} type='submit' variant='default' className='my-2'>
                        {isLoading ? (<><Loader className='mr-2 h-4 w-4 animate-spin' /> Searching</>) : 'Search'}
                    </Button>
                </form>
            </Form>
            <SuccessSearchDialog 
                profileInfo={searchedUser} 
                toast={toast} 
                setIsOpen={setIsDialogOpen} 
                isOpen={isDialogOpen} 
            />
        </>
    )
}

export default SearchForm