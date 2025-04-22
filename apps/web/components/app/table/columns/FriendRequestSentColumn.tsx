"use client"
import { Button } from "@/components/ui/button"
import { ColumnDef } from "@tanstack/react-table"
import axios from "axios"
import { useQueryClient } from "@tanstack/react-query"

export type FriendRequestsSent = {
  receiver: string,
  receiverId: string
}

const handleAcceptButton = async (receiver: string, queryClient: any) => {
  const response = await axios.post('/api/friends/request-response', {
    type: 'accept',
    receiverId: receiver
  }, { headers: { 'Content-Type': 'application/json' } })

  if (response.status === 200) {
    queryClient.invalidateQueries({ queryKey: ["friend-requests"] });
  }
}

const handleRejectButton = async (receiver: string, queryClient: any) => {
  const response = await axios.post('/api/friends/request-response', {
    type: 'reject',
    receiverId: receiver
  }, { headers: { 'Content-Type': 'application/json' } })

  if (response.status === 200) {
    queryClient.invalidateQueries({ queryKey: ["friends"] });
  }
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
      const queryClient = useQueryClient();

      return (
        <>
          <Button onClick={() => {
            handleAcceptButton(receiver, queryClient)
          }} className="mr-2">Accept</Button>
          <Button onClick={() => {
            handleRejectButton(receiver, queryClient)
          }} variant='destructive'>Reject</Button>
        </>
      )
    },
  },
]
