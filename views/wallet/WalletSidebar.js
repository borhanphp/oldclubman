import Link from 'next/link'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { usePathname } from 'next/navigation';
import { FaWallet, FaGift, FaMoneyBillWave, FaPaperPlane, FaHistory, FaArrowDown, FaArrowUp } from 'react-icons/fa';
import { getMyProfile } from '../settings/store';
import Intro from '@/components/common/Intro';

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
   <>
     <div className="w-full lg:w-1/4 mb-6 lg:mb-0 lg:pr-2">
      <Intro/>

      {/* Wallet Menu */}
      <div className="bg-white mt-2 rounded-lg shadow-sm overflow-hidden">
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
   </>
  )
}

export default WalletSidebar

