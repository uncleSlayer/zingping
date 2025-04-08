'use client'

import { columns } from '../table/columns/ShowAllFriendsColumn'
import { DataTable } from '../table/table/Data-table'
// import { getAllFriends } from '@/app/actions/friends/getAllFriendAction'
import { useQuery } from '@tanstack/react-query'
import { Skeleton } from "@/components/ui/skeleton"
import axios from 'axios'

const ShowAllFriends = () => {

    const { data: friends, isPending, isError } = useQuery({
        queryKey: ['friends'],
        queryFn: async function () {
            const response = await axios("http://localhost:8080/friends", {
                withCredentials: true,
                headers: {
                    "Content-Type": "application/json"
                }
            })
            if (response.status !== 200) {
                return null
            } else {

                console.log(response.data)
                // const friendList: { id: string, name: string }[] = []

                return {}
                // response.data?.FriendRequestSent.map((request) => {
                //   friendList.push({
                //     id: request.id,
                //     name: request.receiver.name
                //   })
                // })

                // response.data?.FriendRequestReceived.map((request) => {
                //   friendList.push({
                //     id: request.id,
                //     name: request.sender.name
                //   })
                // })

                // return friendList

            }
        }
    })

    if (isPending) return <Skeleton className='w-full h-48 my-2' />
    // {
    //     friends && (<DataTable data={friends} columns={columns} />)
    // }

    if (isError) return <h3>Something went wrong...</h3>

    return <div>
        <h3 className='text-3xl my-2'> Friends </h3>
        {/* {
            friends && (<DataTable data={friends} columns={columns} />)
        } */}
    </div>
}

export default ShowAllFriends
