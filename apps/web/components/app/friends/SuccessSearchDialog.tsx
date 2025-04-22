'use client'

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose
} from "@/components/ui/dialog"
import { X } from 'lucide-react'
import axios from 'axios'
import { API_HOST } from '@/config/host'
import { useQueryClient } from '@tanstack/react-query'

const SuccessSearchDialog = ({ isOpen, setIsOpen, profileInfo, toast }: { isOpen: boolean, toast: any, setIsOpen: any, profileInfo: { id: string, name: string, email: string, imageUrl: string } | null }) => {
  const queryClient = useQueryClient()

  const handleAddFriendButton = async () => {
    try {
      const response = await axios.post(
        `${API_HOST}/friend/add`,
        { email: profileInfo?.email },
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )

      if (response.status === 200) {
        toast.success(response.data.message)

        // Invalidate the friend-requests query after successfully sending a friend request
        queryClient.invalidateQueries({ queryKey: ['friend-requests'] })

        setIsOpen(false)
      } else {
        toast.error(response.data.message || 'Something went wrong')
      }
    } catch (error: any) {
      console.error('Add friend error:', error)
      toast.error(error.response?.data?.message || 'Failed to add friend')
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="w-80 rounded-lg">
        <DialogHeader className="flex flex-col justify-center items-center">
          <DialogClose onClick={() => setIsOpen(false)} className="absolute top-3 z-10 right-3 w-fit"> <X /> </DialogClose>
          <DialogTitle className="py-1">{profileInfo?.name}</DialogTitle>
          {profileInfo && (<>
            <img src={profileInfo.imageUrl} className="rounded-lg h-40 w-40 object-cover" alt="" />
            <Button onClick={handleAddFriendButton} className="mt-2">Add Friend</Button>
          </>)}
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}

export default SuccessSearchDialog
