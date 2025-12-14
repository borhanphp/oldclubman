"use client"
import CardClassic from '@/views/nfc/nfc-cards/CardClassic';
import CardFlat from '@/views/nfc/nfc-cards/CardFlat';
import CardModern from '@/views/nfc/nfc-cards/CardModern';
import CardSleek from '@/views/nfc/nfc-cards/CardSleek';
import { getNfcById, getNfcByIdPublic } from '@/views/nfc/store';
import { saveContact } from '@/views/settings/store';
import { useParams } from 'next/navigation';
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

const FbShare = () => {
    const {basicNfcData, basicNfcDataPublic} = useSelector(({nfc}) => nfc);
    const dispatch = useDispatch();
    const params = useParams();
    useEffect(() => {
        dispatch(getNfcByIdPublic(params?.id));
    }, [])
    const handleSaveContact = () => {
      dispatch(saveContact(params?.id))
    }
    console.log('basicNfcData from share link',basicNfcData)
  return (
    <div className="w-full max-w-xs mx-auto">
      {basicNfcDataPublic?.design_card_id === 1 ?
        <CardClassic basicNfcData={basicNfcDataPublic}/>
        :
        basicNfcDataPublic?.design_card_id === 2 ?
        <CardModern basicNfcData={basicNfcDataPublic}/>
        :
        basicNfcDataPublic?.design_card_id === 3 ?
        <CardSleek basicNfcData={basicNfcDataPublic}/>
        :
        <CardFlat basicNfcData={basicNfcDataPublic}/>
      }
    <div className='border w-auto bg-blue-600 text-white p-2 rounded-md cursor-pointer mt-1 text-[18px] text-center' 
    onClick={() => {handleSaveContact()}}
    >
      <a href={`${process.env.NEXT_PUBLIC_API_URL}/public/nfc/card/save_contact/${params?.id}`}>Save Contact</a>
      </div>
    
  </div>
  )
}

export default FbShare;