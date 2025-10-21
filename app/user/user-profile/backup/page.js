import CommonLayout from '@/components/common/CommonLayout'
import UserProfile from '@/views/user-profile/UserProfile'
import React from 'react'

const Page = () => {
  return (
    <CommonLayout>
    <div className="">
     <UserProfile />
   </div>
  </CommonLayout>
  )
}

export default Page