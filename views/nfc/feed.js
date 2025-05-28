"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { FaEllipsisH, FaVideo, FaGlobe, FaComment, FaPlus, FaUserFriends } from 'react-icons/fa';
import FeedHeader from '@/components/common/FeedHeader';
import PostModal from '@/components/custom/PostModal';
import { useDispatch, useSelector } from 'react-redux';
import { getMyNfc, getNfcById } from './store';
import moment from 'moment';
import Intro from '@/components/common/Intro';
import FollowSuggestion from '@/components/common/FollowSuggestion';
import CardClassic from './nfc-cards/CardClassic';
import CardModern from './nfc-cards/CardModern';
import CardSleek from './nfc-cards/CardSleek';
import CardFlat from './nfc-cards/CardFlat';

const NfcContent = () => {
  const {nfcData, loading} = useSelector(({nfc}) => nfc);
  const {isPostModalOpen} = useSelector(({gathering}) => gathering);

  const dispatch = useDispatch();
  
  useEffect(() => {
    dispatch(getMyNfc());
  }, [])
  



  return (
    <div className="gathering-content">
     <FeedHeader/>
      
      {/* Content Area - 3 Column Layout */}
      <div className="content-area  py-3">
        <div className="mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Left Sidebar - INTRO */}
            <div className="md:col-span-3">
             <Intro/>
             <FollowSuggestion/>
            </div>
            
            {/* Center Content - LIST OF GATHERINGS */}
            <div className="md:col-span-6">
              <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold">LIST OF NFC CARD</h3>
                  <Link href="/user/nfc/create" className="text-blue-500 cursor-pointer bg-gray-100 p-2 rounded-full">
                    <FaPlus />
                  </Link>
                </div>
                
                {/* NFC Card */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {nfcData?.nfc_cards?.data?.map((card, index) => {
                    const fullCard = {
                      ...card, 
                      ...card.nfc_info, 
                      ...card.nfc_design,
                      display_nfc_color: card?.card_design?.color,
                      profilePhotoUrl: process.env.NEXT_PUBLIC_CLIENT_FILE_PATH + card?.nfc_info?.image,
                      logoUrl: process.env.NEXT_PUBLIC_CARD_FILE_PATH + card?.card_design?.logo,

                    }

                    return(
                      <Link href={`/user/nfc/preview/${card.id}`} key={index}>
                        {+card?.card_design?.design_card_id === 1 ?
                        <CardClassic basicNfcData={fullCard}/>
                        :
                        +card?.card_design?.design_card_id === 2 ?
                        <CardModern basicNfcData={fullCard}/>
                        :
                        +card?.card_design?.design_card_id === 3 ?
                        <CardSleek basicNfcData={fullCard}/>
                        :
                        <CardFlat basicNfcData={fullCard}/>
                      }
                      </Link>
                    )
                  })}
                </div>
                
                {/* Add more cards here if needed */}
              </div>
              
             
            </div>
            
            {/* Right Sidebar */}
            <div className="md:col-span-3">
              {/* Online Active Now Widget */}
              <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
                <h3 className="text-lg font-semibold mb-3">Online Active Now</h3>
                <div className="empty-state text-gray-400 text-sm py-4">
                  {/* Empty state */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Chat Button */}
      <div className="fixed bottom-5 right-5">
        <Link href="/user/messages">
          <button className="bg-blue-500 text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg">
            <FaComment size={20} />
          </button>
        </Link>
      </div>

      {/* Post Modal */}
      {isPostModalOpen && <PostModal/>}
    </div>
  );
};

export default NfcContent; 