"use client"
import CardClassic from '@/views/nfc/nfc-cards/CardClassic';
import CardFlat from '@/views/nfc/nfc-cards/CardFlat';
import CardModern from '@/views/nfc/nfc-cards/CardModern';
import CardSleek from '@/views/nfc/nfc-cards/CardSleek';
import { getNfcById } from '@/views/nfc/store';
import { saveContact } from '@/views/settings/store';
import { useParams } from 'next/navigation';
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

const FbShare = () => {
    const {basicNfcData} = useSelector(({nfc}) => nfc);
    const dispatch = useDispatch();
    const params = useParams();
    useEffect(() => {
        dispatch(getNfcById(params?.id));
    }, [])
    const handleSaveContact = () => {
      dispatch(saveContact(params?.id))
    }
    console.log('basicNfcData from share link',basicNfcData)
  return (
    <div className="w-full max-w-xs mx-auto">
      {basicNfcData?.design_card_id === 1 ?
                        <CardClassic basicNfcData={basicNfcData}/>
                        :
                        basicNfcData?.design_card_id === 2 ?
                        <CardModern basicNfcData={basicNfcData}/>
                        :
                        basicNfcData?.design_card_id === 3 ?
                        <CardSleek basicNfcData={basicNfcData}/>
                        :
                        <CardFlat basicNfcData={basicNfcData}/>
                      }
    <div className='border w-auto bg-blue-600 text-white p-2 rounded-md cursor-pointer mt-1 text-[18px] text-center' 
    onClick={() => {handleSaveContact()}}
    >Save Contact</div>
  </div>
  )
}

export default FbShare;