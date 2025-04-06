'use client'

import React, { useState } from 'react'
import { Card } from "@/components/ui/card"
import { useQuery } from '@tanstack/react-query'
import { Skeleton } from '@/components/ui/skeleton'
import ChatWindow from './ChatWindow'
import { Input } from '@/components/ui/input'
import { SearchIcon } from 'lucide-react'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar'
import axios from 'axios'

const page = () => {
  const [clickedPerson, setClickedPerson] = useState<null | { id: string, name: string, email: string, imageUrl: string }>(null)

  const { error, data: friendsList, isLoading } = useQuery({
    queryKey: ['friendsList'],
    queryFn: async () => {
      const response = await axios('http://localhost:8080/friend/get/all', {
        withCredentials: true,
      })
      return response.data.data
    }
  })

  if (error) return <p>{error.message}</p>
  if (isLoading) return (
    <div className='flex gap-5 h-[80vh] justify-between p-2'>
      <Card className="text-black basis-1/5 p-2 border-none shadow-none">
        <div className='flex items-center px-2 border-none shadow-none rounded-xl relative bg-[rgb(219,220,255)]'>
          <SearchIcon className='' />
          <Input type='text' className='rounded-3xl outline-none border-none focus:outline-none focus:border-none' placeholder='Search' />
        </div>
        <div className="m-2">
          <ul>
            <li><Skeleton className="h-6 my-2 w-auto" /></li>
            <li><Skeleton className="h-6 my-2 w-auto" /></li>
          </ul>
        </div>
      </Card>

      <Card className='h-full p-2 border-2 border-slate-200 basis-4/5 rounded-lg shadow-lg'>
        <Skeleton className="h-40 rounded-lg my-2 w-auto" />
      </Card>
    </div >
  )

  return (
    <div className='flex gap-5 h-[75vh] mt-2 p-2'>
      <Card className="text-black border-none p-2 shadow-none min-w-[270px]">
        <div className='flex items-center px-2 border-none shadow-none rounded-xl relative bg-[rgb(219,220,255)]'>
          <SearchIcon className='' />
          <Input type='text' className='rounded-3xl outline-none border-none focus:outline-none focus:border-none' placeholder='Search' />
        </div>
        <div className="m-2">
          <ul>
            {
              friendsList.map((friend: { id: string, name: string, email: string, imageUrl: string }, index: number) => {
                return <li onClick={() => setClickedPerson(friend)} className='p-1 cursor-pointer dark:text-white rounded-lg' key={friend.id}>
                  <div className={`flex gap-x-2 items-center justify-start hover:bg-[rgb(238,238,248)] p-2 rounded-lg ${clickedPerson?.name === friend.name ? `bg-[rgb(238,238,248)]` : ''}`}>
                    <Avatar>
                      <AvatarImage className='' src={friend.imageUrl} alt="@shadcn" />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <p className=''> {friend.name} </p>
                  </div>
                </li>
              })
            }
          </ul>
        </div>
      </Card>

      <Card className='h-full w-full p-2 border-none shadow-none rounded-lg'>
        <ChatWindow friendInfo={clickedPerson} />
      </Card>
    </div >

  )
}

export default page
