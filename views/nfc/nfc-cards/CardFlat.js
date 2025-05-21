import React from 'react'
import { FaEnvelope, FaPhone, FaBullhorn } from 'react-icons/fa'

const CardFlat = ({ basicNfcData = {} }) => {
  return (
    <div className="w-full max-w-sm rounded-2xl shadow-lg overflow-hidden bg-white relative font-sans mx-auto border border-gray-100">
      {/* Top profile photo */}
      <div className="w-full h-56 bg-gray-200">
        {basicNfcData?.profilePhotoUrl ? (
          <img
            src={basicNfcData?.profilePhotoUrl}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-3xl text-gray-400">👤</div>
        )}
      </div>
      {/* Thin colored bar */}
      <div className="h-2" style={{ backgroundColor: basicNfcData?.display_nfc_color || "#ff8800" }}></div>
      {/* Info section */}
      <div className="px-6 py-6 flex flex-col">
        {/* Name row */}
        <div className="text-xl font-bold text-gray-900 leading-tight">
          {basicNfcData?.prefix && <span>{basicNfcData.prefix} </span>}
          {basicNfcData?.first_name && <span>{basicNfcData.first_name} </span>}
          {basicNfcData?.middle_name && <span>{basicNfcData.middle_name} </span>}
          {basicNfcData?.last_name && <span>{basicNfcData.last_name} </span>}
          {basicNfcData?.suffix && <span>{basicNfcData.suffix} </span>}
          {basicNfcData?.maiden_name && <span className="font-bold">( {basicNfcData.maiden_name} )</span>}
          {basicNfcData?.accreditations && (
            <span className="font-normal text-gray-500 text-base align-middle ml-2">{basicNfcData.accreditations}</span>
          )}
        </div>
        {/* Title */}
        {basicNfcData?.title && (
          <div className="font-bold text-base mt-2">{basicNfcData.title}</div>
        )}
        {/* Department */}
        {basicNfcData?.department && (
          <div className="text-orange-600 font-semibold text-base">{basicNfcData.department}</div>
        )}
        {/* Company */}
        {basicNfcData?.company && (
          <div className="italic text-orange-400 text-sm mb-1">{basicNfcData.company}</div>
        )}
        {/* Headline */}
        {basicNfcData?.headline && (
          <div className="text-gray-700 text-base mb-2 mt-2">{basicNfcData.headline}</div>
        )}
        {/* Preferred name and pronoun */}
        {(basicNfcData?.preferred_name || basicNfcData?.pronoun) && (
          <div className="flex items-center text-gray-400 text-sm mt-2 mb-4">
            <FaBullhorn className="mr-2 text-gray-400 text-base" />
            <span>Goes by </span>
            {basicNfcData?.preferred_name && (
              <span className="ml-1 font-bold text-gray-700">{basicNfcData.preferred_name}</span>
            )}
            {basicNfcData?.pronoun && (
              <span className="ml-1 italic text-gray-400">({basicNfcData.pronoun})</span>
            )}
          </div>
        )}
        {/* Contact rows */}
        <div className="flex flex-col gap-3 mt-2">
          {basicNfcData?.email && (
            <div className="flex items-center">
              <span className="bg-orange-100 rounded-full p-3 mr-3 flex items-center justify-center">
                <FaEnvelope className="text-orange-500 text-lg" />
              </span>
              <span className="text-gray-800 text-base font-medium">{basicNfcData.email}</span>
            </div>
          )}
          {basicNfcData?.phone && (
            <div className="flex items-center">
              <span className="bg-orange-100 rounded-full p-3 mr-3 flex items-center justify-center">
                <FaPhone className="text-orange-500 text-lg" />
              </span>
              <span className="text-gray-800 text-base font-medium">{basicNfcData.phone}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CardFlat