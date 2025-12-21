"use client"
import CardClassic from '@/views/nfc/nfc-cards/CardClassic';
import CardFlat from '@/views/nfc/nfc-cards/CardFlat';
import CardModern from '@/views/nfc/nfc-cards/CardModern';
import CardSleek from '@/views/nfc/nfc-cards/CardSleek';
import { getNfcById, getNfcByIdPublic } from '@/views/nfc/store';
import { saveContact } from '@/views/settings/store';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import api from '@/helpers/axios';

const FbShare = () => {
    const {basicNfcData, basicNfcDataPublic} = useSelector(({nfc}) => nfc);
    const dispatch = useDispatch();
    const params = useParams();
    const [designOptions, setDesignOptions] = useState([]);
    
    useEffect(() => {
        dispatch(getNfcByIdPublic(params?.id));
        fetchDesignOptions();
    }, []);

    const fetchDesignOptions = async () => {
      try {
        const response = await api.get("/nfc/design");
        if (response.data && response.data.data && response.data.data.nfc_design) {
          setDesignOptions(response.data.data.nfc_design);
        }
      } catch (error) {
        console.error("Error fetching design options:", error);
      }
    };
    
    const handleSaveContact = () => {
      dispatch(saveContact(params?.id))
    }
    console.log('basicNfcData from share link',basicNfcData)
  return (
    <div className="w-full max-w-xs mx-auto">
      {(() => {
        const selectedDesign = designOptions.find(d => d.id === basicNfcDataPublic?.design_card_id);
        const designLabel = selectedDesign?.design_name?.toLowerCase() || 'classic';
        
        switch(designLabel) {
          case 'classic':
            return <CardClassic basicNfcData={basicNfcDataPublic} />;
          case 'modern':
            return <CardModern basicNfcData={basicNfcDataPublic} />;
          case 'sleek':
            return <CardSleek basicNfcData={basicNfcDataPublic} />;
          case 'flat':
            return <CardFlat basicNfcData={basicNfcDataPublic} />;
          default:
            return <CardClassic basicNfcData={basicNfcDataPublic} />;
        }
      })()}
      
    <div className='border w-auto bg-blue-600 text-white p-2 rounded-md cursor-pointer mt-1 text-[18px] text-center' 
    onClick={() => {handleSaveContact()}}
    >
      <a href={`${process.env.NEXT_PUBLIC_API_URL}/public/nfc/card/save_contact/${params?.id}`}>Save Contact</a>
      </div>
    
  </div>
  )
}

export default FbShare;