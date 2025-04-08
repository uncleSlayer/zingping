'use client'

import { Card } from "@/components/ui/card"
import { FriendRequestsSent, FriendRequestsColumns } from "../table/columns/FriendRequestSentColumn"
import { DataTable } from "../table/table/Data-table"
import { useEffect, useState } from "react"
import axios from "axios"
import { useQuery } from "@tanstack/react-query"
// import { getAllSentRequests } from '@/app/actions/friends/sentFriendRequestsAction'
import { Skeleton } from "@/components/ui/skeleton"

const FriendsRequestTable = () => {

    const { data: sentRequsts, isPending, isError } = useQuery({
        queryKey: ['all-friend-requests'],
        queryFn: async () => {

            const response = await axios("", {
                withCredentials: true,
                headers: {
                    "Content-Type": "application/json"
                }
            })

            if (response.status !== 200) return null
            else {
                console.log(response)
                const requests = response.data
                if (!requests) return
                return {}
                // return requests.map((request) => ({ receiver: request.receiver.name, receiverId: request.receiverUserId }))
            }

        }
    })

    if (isPending) return <Skeleton className="h-48 w-full" />

    return (
        <div className="flex flex-col">
            <h3 className='text-3xl my-2'> Friend request sent </h3>
            {/* {sentRequsts && <DataTable columns={FriendRequestsColumns} data={sentRequsts} />} */}
        </div >
    )
}

export default FriendsRequestTable
