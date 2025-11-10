"use client";

import CommonLayout from '@/components/common/CommonLayout';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { getMyGiftCards } from '@/views/wallet/store';
import GiftCardGifting from '@/views/wallet/GiftCardGifting';
import WalletSidebar from '@/views/wallet/WalletSidebar';

export default function GiftCardGiftingPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const { giftCards } = useSelector(({ wallet }) => wallet);
  const [giftCardData, setGiftCardData] = useState(null);

  useEffect(() => {
    dispatch(getMyGiftCards());
  }, [dispatch]);

  useEffect(() => {
    if (giftCards && giftCards.length > 0) {
      const card = giftCards.find(c => c.id.toString() === params.id);
      if (card) {
        setGiftCardData(card);
      } else {
        router.push('/user/wallet/gift-cards');
      }
    }
  }, [giftCards, params.id, router]);

  if (!giftCardData) {
    return (
      <CommonLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
            <p className="mt-4 text-gray-600">Loading gift card...</p>
          </div>
        </div>
      </CommonLayout>
    );
  }

  return (
    <CommonLayout>
      <div className="bg-gray-100 min-h-screen">
        <div className="mx-auto">
          <div className="flex flex-wrap">
            <WalletSidebar />
            
            <div className="w-full lg:w-3/4">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <GiftCardGifting
                  giftCardData={giftCardData}
                  onSuccess={() => router.push('/user/wallet/gift-cards')}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </CommonLayout>
  );
}

