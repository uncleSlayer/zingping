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

const SuccessSearchDialog = ({ isOpen, setIsOpen, profileInfo, toast }: { isOpen: boolean, toast: any, setIsOpen: any, profileInfo: { id: string, name: string, email: string, imageUrl: string } | null }) => {

  const handleAddFriendButton = async () => {
    try {

      const resp = await axios.post('/api/friends/add', { email: profileInfo?.email })

      if (resp.status === 200) {
        console.log(resp.data);
        
        toast({
          title: resp.data.message
        }) 
        setIsOpen(false)
      }

    } catch (error) {
      toast({
        title: 'Something went wrong',
      })
      console.log(error);
    }
  }

  return (
    <Dialog open={isOpen}>
      <DialogContent className="w-80 rounded-lg">
        <DialogHeader className="flex flex-col justify-center items-center">
          <DialogClose onClick={() => setIsOpen(false)} className="absolute top-3 z-10 right-3 w-fit"> <X /> </DialogClose>
          <DialogTitle className="py-1">{profileInfo?.name}</DialogTitle>
          {profileInfo && (<>
            <img src={profileInfo.imageUrl} className="rounded-lg h-40 w-40" alt="" />
            <Button onClick={handleAddFriendButton} className="mt-2">Add Friend</Button>
          </>)}
        </DialogHeader>
      </DialogContent>
    </Dialog >
  )
}

export default SuccessSearchDialog
