import CommonLayout from '@/components/common/CommonLayout'
import FriendsList from '@/views/user-profile/FriendsList'
import React from 'react'

const Page = () => {
  return (
    <CommonLayout>
    <div className="">
     <FriendsList />
   </div>
  </CommonLayout>
  )
}

export default Page