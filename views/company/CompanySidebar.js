import Link from 'next/link'
import React from 'react'

const CompanySidebar = () => {
  return (
    <div className="w-full lg:w-1/4 mb-1 lg:mb-0 lg:pr-6">
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="flex flex-col items-center pt-6 pb-4">
          <div className="w-20 h-20 rounded-full overflow-hidden bg-blue-100 mb-5">
            <img src="/common-avator.jpg" alt="Profile" className="w-full h-full object-cover" />
          </div>
          
          <h2 className="text-xl font-bold mb-5">Uddin</h2>
          
          <div className="flex justify-between items-center w-full px-8 border-b border-b-gray-100 pb-5">
            <div className="text-center">
              <div className="font-bold text-lg">5</div>
              <div className="text-gray-500 text-sm">Post</div>
            </div>
            
            <div className="h-10 w-px bg-gray-200"></div>
            
            <div className="text-center relative">
              <div className="font-bold text-lg">2.5K</div>
              <div className="text-gray-500 text-sm">Followers</div>
              <div className="absolute -top-1 right-3 w-2 h-2 bg-red-500 rounded-full"></div>
            </div>
            
            <div className="h-10 w-px bg-gray-200"></div>
            
            <div className="text-center">
              <div className="font-bold text-lg">365</div>
              <div className="text-gray-500 text-sm">Following</div>
            </div>
          </div>
          
          <Link href="/about" className="w-full py-1 text-blue-500 text-center font-medium hover:bg-blue-50">
            View Profile
          </Link>
        </div>
      </div>
    </div>
  )
}

export default CompanySidebar