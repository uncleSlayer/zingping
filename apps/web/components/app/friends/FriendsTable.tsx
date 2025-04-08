'use client'

import { Card } from "@/components/ui/card"
import { FriendRequestsColumns } from "../table/columns/FriendRequestSentColumn"
import { DataTable } from "../table/table/Data-table"
import { useEffect, useState } from "react"
import axios from "axios"


const FriendsRequestTable = () => {

    const [friendRequests, setFriendRequests] = useState([{
        sender: '',
        receiver: '',
        senderId: '',
        receiverId: ''
    }])

    useEffect(() => {

        axios.get('/api/friends/request-search')
            .then((resp) => {
                setFriendRequests(resp.data.data)
            })

    }, [])

    return (
        <Card className="w-full">
            <DataTable columns={FriendRequestsColumns} data={friendRequests} />
        </Card>
    )
}

export default FriendsRequestTable