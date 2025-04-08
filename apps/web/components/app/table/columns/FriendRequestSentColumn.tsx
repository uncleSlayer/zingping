"use client"
import { Button } from "@/components/ui/button"
import { ColumnDef } from "@tanstack/react-table"
import axios from "axios"

export type FriendRequestsSent = {
  receiver: string,
  receiverId: string
}

const handleAcceptButton = async (receiver: string) => {

  axios.post('/api/friends/request-response', {
    type: 'accept',
    receiverId: receiver
  }, { headers: { 'Content-Type': 'application/json' } })

}

const handleRejectButton = async (receiver: string) => {

  axios.post('/api/friends/request-response', {
    type: 'reject',
    receiverId: receiver
  }, { headers: { 'Content-Type': 'application/json' } })

}

export const FriendRequestsColumns: ColumnDef<FriendRequestsSent>[] = [
  {
    accessorKey: "receiver",
    header: "Sent to",
  },
  {
    header: 'Respond',
    id: "actions",
    cell: ({ row }) => {
      const receiver = row.original.receiverId

      return (
        <>
          <Button onClick={() => {
            handleAcceptButton(receiver)
          }} className="mr-2">Accept</Button>
          <Button onClick={() => {
            handleRejectButton(receiver)
          }} variant='destructive'>Reject</Button>
        </>
      )
    },
  },
]
