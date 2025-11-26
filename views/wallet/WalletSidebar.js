import Link from 'next/link'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { usePathname } from 'next/navigation';
import { FaWallet, FaGift, FaMoneyBillWave, FaPaperPlane, FaHistory, FaArrowDown, FaArrowUp } from 'react-icons/fa';
import { getMyProfile } from '../settings/store';

const WalletSidebar = () => {
  const {profile} = useSelector(({settings}) => settings)
  const dispatch = useDispatch();
  const pathname = usePathname();

  useEffect(() => {
    dispatch(getMyProfile());
  }, [dispatch])

  const menuItems = [
    { href: '/user/wallet', icon: FaWallet, label: 'Dashboard' },
    { href: '/user/wallet/gift-cards', icon: FaGift, label: 'Gift Cards' },
    { href: '/user/wallet/transfer', icon: FaPaperPlane, label: 'Send Gift Card' },
    { href: '/user/wallet/withdraw', icon: FaArrowUp, label: 'Transfer Request' },
    { href: '/user/wallet/transactions', icon: FaHistory, label: 'Transactions' },
  ];

  return (
    <div className="w-full lg:w-1/4 mb-6 lg:mb-0 lg:pr-6">
      <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-4">
        <div className="flex flex-col items-center pt-6">
          <div className="w-20 h-20 rounded-full overflow-hidden bg-blue-100 mb-5">
            <img 
            src={profile?.client?.image ? process.env.NEXT_PUBLIC_CLIENT_FILE_PATH + profile?.client?.image : "/common-avator.jpg"}
            alt="Profile" className="w-full h-full object-cover" />
          </div>
          
          <h2 className="text-xl font-bold mb-5">
          {profile?.client ? profile?.client?.fname + " " + profile?.client?.last_name : "Loading..."}
          </h2>
          
          <div className="flex justify-between items-center w-full px-8 border-b border-b-gray-100 pb-5">
            <div className="text-center">
              <div className="font-bold text-lg">{profile?.post?.total || 0}</div>
              <div className="text-gray-500 text-sm">Post</div>
            </div>
            
            <div className="h-10 w-px bg-gray-200"></div>
            
            <div className="text-center relative">
              <div className="font-bold text-lg">{profile?.followers || 0}</div>
              <div className="text-gray-500 text-sm">Followers</div>
            </div>
            
            <div className="h-10 w-px bg-gray-200"></div>
            
            <div className="text-center">
              <div className="font-bold text-lg">{profile?.following || 0}</div>
              <div className="text-gray-500 text-sm">Following</div>
            </div>
          </div>
          
          <Link href={`/${profile?.client?.id}`} className="w-full py-2 text-blue-500 text-center font-medium hover:bg-blue-50">
            View Profile
          </Link>
        </div>
      </div>

      {/* Wallet Menu */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-800">Wallet Menu</h3>
        </div>
        <nav className="p-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg mb-1 transition-colors ${
                  isActive
                    ? 'bg-purple-50 text-purple-600 font-semibold'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon className={`text-lg ${isActive ? 'text-purple-600' : 'text-gray-500'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  )
}

export default WalletSidebar

