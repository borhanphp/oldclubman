"use client";

import FeedHeader from "@/components/common/FeedHeader";
import Intro from "@/components/common/Intro";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import {
  FaUserEdit,
  FaImage,
  FaDownload,
  FaEnvelope,
  FaTrash,
  FaCopy,
  FaCode,
  FaEnvelopeOpenText,
  FaCommentDots,
  FaApple,
  FaEdit,
  FaBullhorn,
} from "react-icons/fa";
import { IoIosList } from "react-icons/io";
import { MdEmail } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { SocialIcon } from "react-social-icons";
import { deleteNfc, duplicateNfc, getNfcById } from "../store";
import moment from "moment";
import toast from "react-hot-toast";
import { QRCodeSVG } from 'qrcode.react';

const NfcDetails = () => {
  const {basicNfcData} = useSelector(({nfc}) => nfc);
  const params = useParams();
  const dispatch = useDispatch();
  console.log('basicNfcData afasdf', basicNfcData)

  const [activeTab, setActiveTab] = useState("code");

  useEffect(() => {
    dispatch(getNfcById(params?.id))
  }, [])


const handleNfcEdit = () => {
  dispatch(getNfcById(params?.id))
}

const handleDuplicate = () => {
  dispatch(duplicateNfc(params?.id))
}

const handleDelete = () => {
  dispatch(deleteNfc(basicNfcData?.id))
}

const handleCopyLink = () => {
  const url = `${window.location.origin}/user/fb_share/${basicNfcData?.id}`;
  navigator.clipboard.writeText(url)
    .then(() => {
      toast.success("Link copied to clipboard!"); // Optional feedback
    })
    .catch(() => {
      toast.error("Failed to copy link.");
    });
};
  
  return (
    <div className="">
      <div className="mx-auto">
        <FeedHeader />
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 pt-3">
          {/* Left Sidebar - INTRO */}
          <div className="md:col-span-3">
            <Intro />
          </div>
          <div className="md:col-span-9 bg-white">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">PREVIEW NFC CARD</h2>
                <Link href="/user/nfc" className="flex items-center gap-2 px-4 py-2 cursor-pointer bg-blue-50 hover:text-white text-blue-600 rounded hover:bg-blue-600">
                  <span className="text-lg hover:text-white">
                    {" "}
                    <IoIosList />{" "}
                  </span>
                  <span className="font-medium text-sm ">All NFC CARD</span>
                </Link>
              </div>
              <div className="flex flex-wrap items-center gap-4 sm:gap-8 md:gap-12 lg:gap-20 mb-2 w-full">
                <Link href="/user/nfc/create" className="cursor-pointer p-2 rounded" onClick={() => {handleNfcEdit()}}>
                  <FaEdit size={25} className="text-blue-500" />
                </Link>
                <Link href="/user/nfc" className="cursor-pointer p-2 rounded" onClick={() => {handleDuplicate()}}>
                  <FaCopy size={25} className="text-blue-500" />
                </Link>
                <button className="cursor-pointer p-2 rounded">
                  <FaImage size={25} className="text-blue-500" />
                </button>
                <button className="cursor-pointer p-2 rounded">
                  <FaDownload size={25} className="text-blue-500" />
                </button>
                <button className="cursor-pointer p-2 rounded">
                  <MdEmail size={25} className="text-blue-500" />
                </button>
                <Link href="/user/nfc" className="cursor-pointer p-2 rounded" onClick={() => {handleDelete()}}>
                  <FaTrash size={20} className="text-red-500" />
                </Link>
              </div>
              <div className="flex gap-6 flex-col lg:flex-row items-stretch">
                {/* Left: Card Preview */}
                <div className="bg-white rounded-lg border border-gray-100 p-4 flex flex-col items-center relative w-full max-w-md mx-auto lg:mx-0 lg:w-1/2">
                  {/* Card Content */}
                  <div className="w-full max-w-xs mx-auto">
    <div className="bg-white rounded-xl shadow-md overflow-hidden relative">
      {/* Profile Image with curved bottom edge */}
      <div className="relative h-100">
        <div className="w-full h-80 bg-gray-100 flex items-center justify-center overflow-hidden">
          {basicNfcData?.profilePhotoUrl ? (
            <img
              src={basicNfcData?.profilePhotoUrl}
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
              <ellipse cx="100" cy="90" rx="60" ry="60" fill="#ccc" />
              <ellipse cx="100" cy="150" rx="75" ry="40" fill="#ccc" />
            </svg>
          )}
        </div>
        {/* Blue wave */}
        <div className="absolute left-0 right-0 bottom-20 pointer-events-none">
          <svg preserveAspectRatio="xMinYMax meet" viewBox="0 0 246 57" xmlns="http://www.w3.org/2000/svg">
            <path id="forground" clipRule="evenodd" d="M 214.7168,6.1113281 C 195.65271,5.9023124 172.37742,11.948182 137.87305,32.529297 110.16613,49.05604 86.980345,56.862784 65.015625,57 H 65 v 1 H 246 V 11.453125 C 236.0775,8.6129313 226.15525,6.2367376 214.7168,6.1113281 Z" fill="white" fillRule="evenodd"></path>
            <path id="background" clipRule="evenodd" d="M 0,35.773438 V 58 H 65 L 64.97852,57 C 43.192081,57.127508 22.605139,49.707997 0,35.773438 Z " fill="white" fillRule="evenodd"></path>
            <path id="wave" clipRule="evenodd" d="m 0,16.7221 v 19.052 C 45.4067,63.7643 82.6667,65.4583 137.873,32.5286 193.08,-0.401184 219.54,3.87965 246,11.4535 V 6.51403 C 185.24,-16.8661 135.913,29.331 97.6933,40.8564 59.4733,52.3818 33.6467,44.1494 0,16.7221 Z " fill="#6785F5" fillRule="evenodd"></path>
          </svg>
        </div>
        {/* Logo (rounded) */}
        {basicNfcData?.logoUrl && (
          <div className="absolute right-4 bottom-20 bg-white rounded-full border shadow flex items-center justify-center w-10 h-10">
            <img src={basicNfcData?.logoUrl} alt="Logo" className="w-full rounded-full" />
          </div>
        )}
        
      </div>
      {/* Card Info */}
      <div className="p-4">
        {/* Name row */}
        <div className="text-lg font-bold text-gray-900 mb-1">
          {basicNfcData?.prefix && <span className="font-bold">{basicNfcData.prefix} </span>}
          {basicNfcData?.f_name && <span className="font-normal">{basicNfcData.f_name} </span>}
          {basicNfcData?.middle_name && <span className="font-normal">{basicNfcData.middle_name} </span>}
          {basicNfcData?.l_name && <span className="font-normal">{basicNfcData.l_name} </span>}
          {basicNfcData?.suffix && <span className="font-bold">{basicNfcData.suffix} </span>}
          {basicNfcData?.maiden_name && <span className="font-bold">( {basicNfcData.maiden_name} )</span>}
        </div>
        {/* Accreditations */}
        {basicNfcData?.accreditations && (
          <div className="text-gray-500 text-sm mb-1">{basicNfcData.accreditations}</div>
        )}
        {/* Title */}
        {basicNfcData?.title && (
          <div className="font-bold text-sm mb-1">{basicNfcData.title}</div>
        )}
        {/* Department */}
        {basicNfcData?.department && (
          <div className="italic text-gray-600 text-sm mb-1">{basicNfcData.department}</div>
        )}
        {/* Company */}
        {basicNfcData?.company && (
          <div className="italic text-gray-400 text-sm mb-1">{basicNfcData.company}</div>
        )}
        {/* Headline */}
        {basicNfcData?.headline && (
          <div className="text-gray-700 text-sm mb-1">{basicNfcData.headline}</div>
        )}
        {/* Preferred name and pronoun */}
        {(basicNfcData?.preferred_name || basicNfcData?.pronoun) && (
          <div className="flex items-center text-gray-400 text-xs mt-2">
            <FaBullhorn className="mr-2 text-blue-500 text-lg" />
            <span>Goes by </span>
            {basicNfcData?.preferred_name && (
              <span className="ml-1 font-bold text-gray-700">{basicNfcData.preferred_name}</span>
            )}
            {basicNfcData?.pronoun && (
              <span className="ml-1 font-semibold text-gray-500">({basicNfcData.pronoun})</span>
            )}
          </div>
        )}
        {/* Big bullhorn icon at the bottom left */}
        <div className="mt-4">
          <div className="w-14 h-14 bg-blue-500 rounded-lg flex items-center justify-center">
            <FaBullhorn className="text-white text-2xl" />
          </div>
        </div>
      </div>
    </div>
  </div>
                </div>
                {/* Right: QR and Send Card */}
                <div className="bg-white rounded-lg border border-gray-100 p-4 flex flex-col items-center w-full max-w-md mx-auto lg:mx-0 lg:w-1/2 mt-6 lg:mt-0">
                  <h3 className="font-semibold text-lg mb-2">Send Card</h3>
                  {/* Tab Content */}
                  {activeTab === "code" && (
                    <>
                      <div className="bg-gray-100 rounded-lg p-4 mb-2 w-full flex justify-center">
                        <QRCodeSVG
                          value={`${typeof window !== 'undefined' ? window.location.origin : ''}/user/fb_share/${basicNfcData?.id}`}
                          size={180}
                          bgColor="#f3f4f6"
                          fgColor="#222"
                          level="H"
                          includeMargin={true}
                        />
                      </div>
                      <div className="text-center text-gray-500 text-xs mb-2">
                        Scan Or Click to Preview
                      </div>
                      <div className="flex justify-center gap-2 mb-3 flex-wrap">
                        <SocialIcon network="facebook" style={{ height: 32, width: 32 }} />
                        <SocialIcon network="xing" style={{ height: 32, width: 32 }} />
                        <SocialIcon network="linkedin" style={{ height: 32, width: 32 }} />
                        <SocialIcon network="whatsapp" style={{ height: 32, width: 32 }} />
                        <SocialIcon network="email" style={{ height: 32, width: 32 }} />
                      </div>
                      <button
                       className="flex items-center cursor-pointer gap-2 px-4 py-2 bg-white border rounded mb-4 hover:bg-gray-50 w-full max-w-xs justify-center"
                       onClick={handleCopyLink}
                       >
                        <FaCopy />
                        <span>Copy Link</span>
                      </button>
                    </>
                  )}
                  {activeTab === "email" && (
                    <>
                      <div className="w-full mb-4">
                        <div className="mb-2 text-gray-700">Email your Work card to:</div>
                        <input type="text" placeholder="Name" className="w-full border rounded px-3 py-2 mb-2" />
                        <input type="email" placeholder="Email" className="w-full border rounded px-3 py-2 mb-2" />
                        <textarea placeholder="Message" className="w-full border rounded px-3 py-2 mb-2" rows={4} />
                        <button className="bg-blue-600 text-white px-4 py-2 rounded">Send Email</button>
                      </div>
                    </>
                  )}
                  {activeTab === "text" && (
                    <>
                      <div className="w-full mb-4">
                        <div className="mb-2 text-gray-700">You'll need a text message application installed on your computer to send your card via SMS.</div>
                        <div className="mb-2 font-semibold">Text your Work card to:</div>
                        <input type="text" placeholder="Name" className="w-full border rounded px-3 py-2 mb-2" />
                        <div className="flex gap-2 mb-2">
                          <input type="text" placeholder="61" className="w-1/4 border rounded px-3 py-2" />
                          <input type="text" placeholder="Phone Number" className="w-3/4 border rounded px-3 py-2" />
                        </div>
                        <button className="flex items-center gap-2 border border-blue-600 text-blue-600 px-4 py-2 rounded">
                          <FaCommentDots />
                          <span>Send SMS</span>
                        </button>
                      </div>
                    </>
                  )}
                  {activeTab === "apple" && (
                    <>
                      <div className="w-full mb-4 text-center text-gray-500">Apple Wallet integration coming soon.</div>
                    </>
                  )}
                  {/* Tab Buttons */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full mt-2 border rounded-lg overflow-hidden">
                    <button onClick={() => setActiveTab("code")} className={`flex flex-col items-center justify-center py-2 ${activeTab === "code" ? "bg-purple-600 text-white" : "bg-white text-purple-700"} border-r border-b sm:border-b-0 sm:border-r last:border-r-0 transition-all`}>
                      <FaCode />
                      <span className="text-xs mt-1">Code</span>
                    </button>
                    <button onClick={() => setActiveTab("email")} className={`flex flex-col items-center justify-center py-2 ${activeTab === "email" ? "bg-purple-600 text-white" : "bg-white text-purple-700"} border-r border-b sm:border-b-0 sm:border-r last:border-r-0 transition-all`}>
                      <FaEnvelopeOpenText />
                      <span className="text-xs mt-1">Email</span>
                    </button>
                    <button onClick={() => setActiveTab("text")} className={`flex flex-col items-center justify-center py-2 ${activeTab === "text" ? "bg-purple-600 text-white" : "bg-white text-purple-700"} border-r border-b sm:border-b-0 sm:border-r last:border-r-0 transition-all`}>
                      <FaCommentDots />
                      <span className="text-xs mt-1">Text</span>
                    </button>
                    <button onClick={() => setActiveTab("apple")} className={`flex flex-col items-center justify-center py-2 ${activeTab === "apple" ? "bg-purple-600 text-white" : "bg-white text-purple-700"} transition-all`}>
                      <FaApple />
                      <span className="text-xs mt-1">Apple</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NfcDetails;
