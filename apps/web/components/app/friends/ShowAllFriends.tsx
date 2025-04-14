'use client'

import { columns } from '../table/columns/ShowAllFriendsColumn'
import { DataTable } from '../table/table/Data-table'
import { useQuery } from '@tanstack/react-query'
import { Skeleton } from "@/components/ui/skeleton"
import axios from 'axios'
import { API_HOST } from '@/config/host'

const ShowAllFriends = () => {
    const { data: friends, isPending, isError } = useQuery({
        queryKey: ['friends'],
        queryFn: async () => {
            const response = await axios.get(`${API_HOST}/friend/get/all`, {
                withCredentials: true,
                headers: {
                    "Content-Type": "application/json"
                }
            })
            
            if (response.status !== 200) {
                throw new Error('Failed to fetch friends')
            }

            return response.data.data || []
        }
    })

    if (isPending) return <Skeleton className='w-full h-48 my-2' />

    if (isError) return <h3>Something went wrong...</h3>

    return (
        <div>
            <h3 className='text-3xl my-2'>Friends</h3>
            {friends && <DataTable data={friends} columns={columns} />}
        </div>
    )
}

export default ShowAllFriends