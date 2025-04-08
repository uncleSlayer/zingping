'use client'

import SearchFriends from '@/components/app/friends/SearchFriends'
import React from 'react'
import FriendsRequestTable from '@/components/app/friends/FriendsRequestsTable'
import ShowAllFriends from '@/components/app/friends/ShowAllFriends'

const page = () => {
  return (
    <div className='main-container mt-20'>
      <SearchFriends />
      <div className='flex gap-3 flex-col'>
        <FriendsRequestTable />
        <ShowAllFriends />
      </div>
    </div>
  )
}

export default page
