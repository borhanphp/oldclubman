"use client";
import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMyNfc, getNfcById } from "../store";
import FeedLayout from "@/components/common/FeedLayout";
import { QRCodeSVG } from "qrcode.react";

const EmailSignature = () => {
    const { nfcData } = useSelector(({ nfc }) => nfc);
    const [activeTab, setActiveTab] = useState('square');
    const [selectedCard, setSelectedCard] = useState(null);
    const [copied, setCopied] = useState(false);
    
    const dispatch = useDispatch();
  
    useEffect(() => {
      dispatch(getMyNfc());
    }, []);
  
    const handleClickOnCard = (card) => {
      setSelectedCard(card);
      dispatch(getNfcById(card.id));
    };

    const copyToClipboard = () => {
      // Create a temporary container
      const tempDiv = document.createElement('div');
      
      // Add the signature HTML
      tempDiv.innerHTML = `
<table cellpadding="0" cellspacing="0" style="font-family: Arial,sans-serif; font-size: 12px;">
  <tr>
    <td style="padding-right: 12px;" valign="top">
      <img src="${process.env.NEXT_PUBLIC_CLIENT_FILE_PATH + selectedCard?.nfc_info?.image || '/oldman-bg.jpg'}" width="90" height="90" style="display: block; max-width: 90px;" />
    </td>
    <td valign="top">
      <table cellpadding="0" cellspacing="0" style="font-family: Arial,sans-serif;">
        <tr>
          <td>
            <strong style="font-size: 16px; color: #333333; display: block;">${selectedCard?.card_name || 'Taufiqul Islam Pius'}</strong>
            <span style="font-size: 12px; color: #444444; display: block;">${selectedCard?.nfc_info?.title || 'President & CEO'}</span>
            <span style="font-size: 12px; color: #666666; display: block; padding-bottom: 8px;">${selectedCard?.nfc_info?.company || 'Khondoker Group Company, Inc.'}</span>
          </td>
        </tr>
        <tr>
          <td>
            <table cellpadding="0" cellspacing="0">
              <tr>
                <td style="padding-right: 15px;">
                  <a href="mailto:${selectedCard?.client?.email || 'info@taufiqulpius.com'}" style="color: #444444; text-decoration: none;">
                    <span style="color: #6c5ce7;">✉</span> ${selectedCard?.client?.email || 'info@taufiqulpius.com'}
                  </a>
                </td>
                <td>
                  <a href="tel:${selectedCard?.client?.contact_no || '+1 718 839 5812'}" style="color: #444444; text-decoration: none;">
                    <span style="color: #6c5ce7;">📞</span> ${selectedCard?.client?.contact_no || '+1 718 839 5812'}
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>`;

      // Append to document temporarily
      document.body.appendChild(tempDiv);
      
      // Create a range and selection
      const range = document.createRange();
      range.selectNode(tempDiv);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      
      try {
        // Execute copy command
        const successful = document.execCommand('copy');
        if (successful) {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        }
      } catch (err) {
        console.error('Failed to copy:', err);
      }
      
      // Clean up
      selection.removeAllRanges();
      document.body.removeChild(tempDiv);
    };

    console.log('selectedCard',selectedCard)
 
    return (
      <FeedLayout>
        <div className=" mx-auto py-3">
          

         
          <div className="bg-white rounded-xl shadow-lg p-8">
            {/* Cards Grid */}
          <div className="flex flex-row gap-8 px-8 py-4 overflow-x-auto max-w-[5000px]">
            <div className="grid grid-cols-10 gap-4">
              {nfcData?.nfc_cards?.data?.map((card, index) => {
                const fullCard = {
                  ...card,
                  ...card.nfc_info,
                  ...card.nfc_design,
                  display_nfc_color: card?.card_design?.color,
                  profilePhotoUrl:
                    process.env.NEXT_PUBLIC_CLIENT_FILE_PATH +
                    card?.nfc_info?.image,
                  logoUrl:
                    process.env.NEXT_PUBLIC_CARD_FILE_PATH +
                    card?.card_design?.logo,
                };

                return (
                  <div
                    className="col-span-1 rounded-xl hover:border hover:border-gray-300 cursor-pointer"
                    onClick={() => handleClickOnCard(card)}
                  >
                    <>
                      <div className="w-full">
                        <div className="bg-white rounded-xl shadow-md overflow-hidden relative">
                          {/* Profile Image with curved bottom edge */}
                          <div className="relative">
                            <div className="w-full h-40 bg-gray-100 flex items-center justify-center overflow-hidden">
                              {fullCard?.profilePhotoUrl ? (
                                <img
                                  src={fullCard?.profilePhotoUrl}
                                  alt="Profile"
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <svg
                                  viewBox="0 0 200 200"
                                  className="w-480 h-48"
                                  style={{ background: "transparent" }}
                                >
                                  <circle cx="100" cy="100" r="100" fill="#888" />
                                  <ellipse
                                    cx="100"
                                    cy="90"
                                    rx="60"
                                    ry="60"
                                    fill="#ccc"
                                  />
                                  <ellipse
                                    cx="100"
                                    cy="150"
                                    rx="75"
                                    ry="40"
                                    fill="#ccc"
                                  />
                                </svg>
                              )}
                            </div>
                            {/* Blue wave */}
                            <div className="absolute left-0 right-0 bottom-0 pointer-events-none">
                              <svg
                                preserveAspectRatio="xMinYMax meet"
                                viewBox="0 0 246 57"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  id="forground"
                                  clipRule="evenodd"
                                  d="M 214.7168,6.1113281 C 195.65271,5.9023124 172.37742,11.948182 137.87305,32.529297 110.16613,49.05604 86.980345,56.862784 65.015625,57 H 65 v 1 H 246 V 11.453125 C 236.0775,8.6129313 226.15525,6.2367376 214.7168,6.1113281 Z"
                                  fill="white"
                                  fillRule="evenodd"
                                ></path>
                                <path
                                  id="background"
                                  clipRule="evenodd"
                                  d="M 0,35.773438 V 58 H 65 L 64.97852,57 C 43.192081,57.127508 22.605139,49.707997 0,35.773438 Z "
                                  fill="white"
                                  fillRule="evenodd"
                                ></path>
                                <path
                                  id="wave"
                                  clipRule="evenodd"
                                  d="m 0,16.7221 v 19.052 C 45.4067,63.7643 82.6667,65.4583 137.873,32.5286 193.08,-0.401184 219.54,3.87965 246,11.4535 V 6.51403 C 185.24,-16.8661 135.913,29.331 97.6933,40.8564 59.4733,52.3818 33.6467,44.1494 0,16.7221 Z "
                                  fill={fullCard?.display_nfc_color}
                                  fillRule="evenodd"
                                ></path>
                              </svg>
                            </div>
                          </div>
                          {/* Card Info */}
                          <div className="p-4 text-nowrap">
                            {fullCard?.card_name}
                          </div>
                        </div>
                      </div>
                    </>
                  </div>
                );
              })}
            </div>
          </div>
           {/* Tabs and Content */}
            {/* Tabs */}
            <div className="flex gap-4 mb-8 pb-4 justify-center">
              <button
                onClick={() => setActiveTab('square')}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg ${
                  activeTab === 'square' ? 'bg-[#6c5ce7] text-white' : 'bg-gray-100'
                }`}
              >
                SQUARE
              </button>
              <button
                onClick={() => setActiveTab('qrcode')}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg ${
                  activeTab === 'qrcode' ? 'bg-[#6c5ce7] text-white' : 'bg-gray-100'
                }`}
              >
                QR CODE
              </button>
              <button
                onClick={() => setActiveTab('imglogo')}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg ${
                  activeTab === 'imglogo' ? 'bg-[#6c5ce7] text-white' : 'bg-gray-100'
                }`}
              >
                IMG + LOGO
              </button>
              <button
                onClick={() => setActiveTab('logo')}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg ${
                  activeTab === 'logo' ? 'bg-[#6c5ce7] text-white' : 'bg-gray-100'
                }`}
              >
                LOGO
              </button>
              <button
                onClick={() => setActiveTab('text')}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg ${
                  activeTab === 'text' ? 'bg-[#6c5ce7] text-white' : 'bg-gray-100'
                }`}
              >
                TEXT
              </button>
            </div>

            {/* Tab Content */}
            <div className="flex justify-center gap-8 ">
              {activeTab === 'square' && 
              <div className="">
                <div className="bg-gray-50 rounded-xl p-6 flex gap-2">
                  <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    

                    <div className="relative rounded-xl flex flex-col items-center justify-center text-white">
                    <img 
                        src={process.env.NEXT_PUBLIC_CLIENT_FILE_PATH + selectedCard?.nfc_info?.image || '/oldman-bg.jpg'}
                        alt="Profile"
                        className="w-50 h-50 object-cover"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent h-full p-4">
                        <div className="absolute bottom-4 left-0 right-0 px-4">
                          <div className="border-l border-dashed">
                            <div className="pl-1 leading-tight">
                              <h3 className="text-white font-semibold">
                                {selectedCard?.card_name || 'Prefix Taufiqul Islam Plus Suffix'}
                              </h3>
                              <p className=" text-white/80 text-sm">
                                {selectedCard?.nfc_info?.title || 'Title'}
                              </p>
                              <p className="leading-tight text-white/80 text-sm">
                                {selectedCard?.nfc_info?.company || 'Company'}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-xl shadow-md overflow-hidden">

                    <div className="relative w-50 h-50 bg-[#6c5ce7] rounded-xl flex flex-col items-center justify-center text-white">
                  <div className=" p-4 rounded-xl">
                    <div className="w-32 rounded-md h-32 flex items-center justify-center">
                    <QRCodeSVG
                          value={`${typeof window !== 'undefined' ? window.location.origin : ''}/user/fb_share/${selectedCard?.id}`}
                          size={180}
                          bgColor="#f3f4f6"
                          fgColor="#222"
                          level="H"
                          className=""
                          includeMargin={true}
                        />
                    </div>
                    
                  </div>
                  <span className="absolute font-semibold text-sm bottom-2 uppercase tracking-wide">Connect</span>
                  <span className="absolute font-semibold p-1 text-[12px]  border border-white rounded-md bg-[#6c5ce7] uppercase tracking-wide">Hi</span>

                </div>
                  </div>
                </div>
              </div>}

              {activeTab === 'qrcode' && 
              <div className="">
                <div className="bg-white border rounded-[12px] shadow-lg overflow-hidden" style={{width: '360px'}}>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 leading-tight">
                      <img 
                        src={process.env.NEXT_PUBLIC_CLIENT_FILE_PATH + selectedCard?.nfc_info?.image || '/oldman-bg.jpg'}
                        alt="Profile"
                        className="w-[90px] h-[90px] rounded-br-xl"
                      />
                    </div>
                    <div className="flex-grow pt-2">
                      <h3 className="text-[18px]  font-bold text-gray-900 ">
                        {selectedCard?.card_name || 'Taufiqul Islam Pius'}
                      </h3>
                      <p className="text-[12px] text-[#444] leading-tight">
                        {selectedCard?.nfc_info?.title || 'President & CEO'}
                      </p>
                      <p className="text-[12px] text-[#666]">
                        {selectedCard?.nfc_info?.company || 'Khondoker Group Company, Inc.'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="px-5 pt-3 space-y-2.5">
                    <div className="flex items-center gap-2 ">
                      <div className="leading-tight w-5 h-5 rounded-full bg-[#6c5ce7]/10 flex items-center justify-center flex-shrink-0">
                        <svg className="w-4 h-4 text-[#6c5ce7]" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                        </svg>
                      </div>
                      <span className="text-[12px] text-[#444]">{selectedCard?.client?.email || 'info@taufiqulpius.com'}</span>
                    </div>
                    <div className="flex items-center gap-2 leading-tight -mt-1">
                      <div className="w-5 h-5 rounded-full bg-[#6c5ce7]/10 flex items-center justify-center flex-shrink-0">
                        <svg className="w-4 h-4 text-[#6c5ce7]" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                        </svg>
                      </div>
                      <span className="text-[12px] text-[#444]">{selectedCard?.client?.contact_no || '+1 718 839 5812'}</span>
                    </div>
                  </div>

                  <div className="flex justify-end px-5 -mt-10 pb-4">
                    <div className="relative">
                      <QRCodeSVG
                        value={`${typeof window !== 'undefined' ? window.location.origin : ''}/user/fb_share/${selectedCard?.id}`}
                        size={108}
                        bgColor="#ffffff"
                        fgColor="#000000"
                        level="H"
                        includeMargin={false}
                      />
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <div className="bg-[#6c5ce7] text-white text-sm font-bold rounded-full w-8 h-8 flex items-center justify-center">
                          Hi
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end cursor-pointer">
                  <div className="bg-[#6c5ce7]  rounded-tl-xl py-2 w-[150px] flex  justify-center">
                    <button className="text-white cursor-pointer text-[12px] tracking-wide">
                      SAVE CONTACT
                    </button>
                  </div>
                  </div>
                </div>
              </div>}

              {activeTab === 'imglogo' && 
              <div className="">
              <div className="bg-white border rounded-[12px] shadow-lg overflow-hidden" style={{width: '360px'}}>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 leading-tight">
                    <img 
                      src={process.env.NEXT_PUBLIC_CLIENT_FILE_PATH + selectedCard?.nfc_info?.image || '/oldman-bg.jpg'}
                      alt="Profile"
                      className="w-[90px] h-[90px] rounded-br-xl"
                    />
                  </div>
                  <div className="flex-grow pt-2">
                    <h3 className="text-[18px]  font-bold text-gray-900 ">
                      {selectedCard?.card_name || 'Taufiqul Islam Pius'}
                    </h3>
                    <p className="text-[12px] text-[#444] leading-tight">
                      {selectedCard?.nfc_info?.title || 'President & CEO'}
                    </p>
                    <p className="text-[12px] text-[#666]">
                      {selectedCard?.nfc_info?.company || 'Khondoker Group Company, Inc.'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center px-4 py-3 gap-5">
                  <div className="flex items-center gap-2 ">
                    <div className="leading-tight w-5 h-5 rounded-full bg-[#6c5ce7]/10 flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-[#6c5ce7]" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                    </div>
                    <span className="text-[12px] text-[#444]">{selectedCard?.client?.email || 'info@taufiqulpius.com'}</span>
                  </div>
                  <div className="flex items-center gap-2 leading-tight -mt-1">
                    <div className="w-5 h-5 rounded-full bg-[#6c5ce7]/10 flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-[#6c5ce7]" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                      </svg>
                    </div>
                    <span className="text-[12px] text-[#444]">{selectedCard?.client?.contact_no || '+1 718 839 5812'}</span>
                  </div>
                </div>


                <div className="flex justify-end cursor-pointer">
                <div className="bg-[#6c5ce7]  rounded-tl-xl py-2 w-[150px] flex  justify-center">
                  <button className="text-white cursor-pointer text-[12px] tracking-wide">
                    SAVE CONTACT
                  </button>
                </div>
                </div>
              </div>
            </div>}

              {activeTab === 'logo' && 
              <div className="">
              <div className="bg-white border rounded-[12px] shadow-lg overflow-hidden" style={{width: '360px'}}>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 leading-tight">
                    <img 
                      src={process.env.NEXT_PUBLIC_CLIENT_FILE_PATH + selectedCard?.nfc_info?.image || '/oldman-bg.jpg'}
                      alt="Profile"
                      className="w-[90px] h-[90px] rounded-br-xl"
                    />
                  </div>
                  <div className="flex-grow pt-2">
                    <h3 className="text-[18px]  font-bold text-gray-900 ">
                      {selectedCard?.card_name || 'Taufiqul Islam Pius'}
                    </h3>
                    <p className="text-[12px] text-[#444] leading-tight">
                      {selectedCard?.nfc_info?.title || 'President & CEO'}
                    </p>
                    <p className="text-[12px] text-[#666]">
                      {selectedCard?.nfc_info?.company || 'Khondoker Group Company, Inc.'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center px-4 py-3 gap-5">
                  <div className="flex items-center gap-2 ">
                    <div className="leading-tight w-5 h-5 rounded-full bg-[#6c5ce7]/10 flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-[#6c5ce7]" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                    </div>
                    <span className="text-[12px] text-[#444]">{selectedCard?.client?.email || 'info@taufiqulpius.com'}</span>
                  </div>
                  <div className="flex items-center gap-2 leading-tight -mt-1">
                    <div className="w-5 h-5 rounded-full bg-[#6c5ce7]/10 flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-[#6c5ce7]" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                      </svg>
                    </div>
                    <span className="text-[12px] text-[#444]">{selectedCard?.client?.contact_no || '+1 718 839 5812'}</span>
                  </div>
                </div>


                <div className="flex justify-end cursor-pointer">
                <div className="bg-[#6c5ce7]  rounded-tl-xl py-2 w-[150px] flex  justify-center">
                  <button className="text-white cursor-pointer text-[12px] tracking-wide">
                    SAVE CONTACT
                  </button>
                </div>
                </div>
              </div>
            </div>}

              {activeTab === 'text' && 
              <div className="">
              <div className="bg-white border rounded-[12px] shadow-lg overflow-hidden" style={{width: '360px'}}>
                <div className="flex gap-4">
                  
                  <div className="flex-grow pt-2 px-4">
                    <h3 className="text-[18px]  font-bold text-gray-900 ">
                      {selectedCard?.card_name || 'Taufiqul Islam Pius'}
                    </h3>
                    <p className="text-[12px] text-[#444] leading-tight">
                      {selectedCard?.nfc_info?.title || 'President & CEO'}
                    </p>
                    <p className="text-[12px] text-[#666]">
                      {selectedCard?.nfc_info?.company || 'Khondoker Group Company, Inc.'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center px-4 py-3 gap-5">
                  <div className="flex items-center gap-2 ">
                    <div className="leading-tight w-5 h-5 rounded-full bg-[#6c5ce7]/10 flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-[#6c5ce7]" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                    </div>
                    <span className="text-[12px] text-[#444]">{selectedCard?.client?.email || 'info@taufiqulpius.com'}</span>
                  </div>
                  <div className="flex items-center gap-2 leading-tight -mt-1">
                    <div className="w-5 h-5 rounded-full bg-[#6c5ce7]/10 flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-[#6c5ce7]" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                      </svg>
                    </div>
                    <span className="text-[12px] text-[#444]">{selectedCard?.client?.contact_no || '+1 718 839 5812'}</span>
                  </div>
                </div>


                <div className="flex justify-end cursor-pointer">
                <div className="bg-[#6c5ce7]  rounded-tl-xl py-2 w-[150px] flex  justify-center">
                  <button className="text-white cursor-pointer text-[12px] tracking-wide">
                    SAVE CONTACT
                  </button>
                </div>
                </div>
              </div>
            </div>}
            </div>

            {/* Instructions with Generate Button */}
            <div className="flex justify-center">
            <div className="space-y-6 mt-8 ">
              <div className="flex items-center  gap-4">
                <div className="w-8 h-8 rounded-full bg-[#6c5ce7] text-white flex items-center justify-center">1</div>
                <div className="flex-grow">
                  <p className="text-gray-700">Generate and copy your signature's HTML</p>
                  {selectedCard && (
                    <button
                      onClick={copyToClipboard}
                      className="mt-2 bg-[#6c5ce7] text-white px-6 py-2 rounded-lg shadow hover:bg-[#5a4bd4] transition-colors flex items-center gap-2 text-sm"
                    >
                      {copied ? "✓ Copied!" : "Generate Signature and Copy"}
                    </button>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-[#6c5ce7] text-white flex items-center justify-center">2</div>
                <p className="text-gray-700">Click the settings gear and click "See all settings"</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-[#6c5ce7] text-white flex items-center justify-center">3</div>
                <p className="text-gray-700">In the "General" tab, scroll down until you see "Signature"</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-[#6c5ce7] text-white flex items-center justify-center">4</div>
                <p className="text-gray-700">Click the + button</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-[#6c5ce7] text-white flex items-center justify-center">5</div>
                <p className="text-gray-700">Give your signature a name</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-[#6c5ce7] text-white flex items-center justify-center">6</div>
                <p className="text-gray-700">Paste your signature</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-[#6c5ce7] text-white flex items-center justify-center">7</div>
                <p className="text-gray-700">Click "Save Changes"</p>
              </div>
            </div>
            </div>
          </div>
        </div>
      </FeedLayout>
    );
};

export default EmailSignature;