import React from 'react'
import { FaBullhorn, FaPhone } from 'react-icons/fa'

const CardSleek = ({basicNfcData = {}}) => {
  return (
    <div className="w-full rounded-3xl shadow-lg overflow-hidden bg-gradient-to-br from-pink-100 via-green-100 to-purple-100 relative font-sans">
      {/* Top background photo */}
      <div className="w-full h-48 bg-gray-200 relative">
        {basicNfcData?.profilePhotoUrl ? (
          <img
          src={basicNfcData?.profilePhotoUrl || "/common-profile.png"}
          alt="Profile"
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/common-profile.png";
          }}
        />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-3xl text-gray-400">👤</div>
        )}
      </div>
      {/* White overlay card */}
      <div className="w-11/12 mx-auto bg-white rounded-xl shadow-lg -mt-12 p-4 flex flex-col items-center relative z-10">
        {/* Logo */}
        {basicNfcData?.logoUrl && (
          <img src={basicNfcData?.logoUrl} alt="Logo" className="w-12 h-12 mb-2 object-contain" />
        )}
        {/* Name, title, company */}
        <div className="text-lg text-center font-bold text-gray-900">
          {basicNfcData?.prefix && basicNfcData?.prefix !== "null"  && <span className="font-bold">{basicNfcData.prefix} </span>}
          {basicNfcData?.first_name && basicNfcData?.first_name !== "null"  && <span className="font-bold">{basicNfcData.first_name} </span>}
          {basicNfcData?.middle_name && basicNfcData?.middle_name !== "null"  && <span className="font-bold">{basicNfcData.middle_name} </span>}
          {basicNfcData?.last_name && basicNfcData?.last_name !== "null"  && <span className="font-bold">{basicNfcData.last_name} </span>}
          {basicNfcData?.suffix && basicNfcData?.suffix !== "null"  && <span className="font-bold">{basicNfcData.suffix} </span>}
          {basicNfcData?.maiden_name && basicNfcData?.maiden_name !== "null"  && <span className="font-bold">({basicNfcData.maiden_name})</span>}
        </div>
      </div>
      {/* About Me */}
      <div className="px-6 py-4">
         {/* Title */}
         {basicNfcData?.title && basicNfcData?.title !== "null"  && (
          <div className="font-bold text-sm mb-1">{basicNfcData.title}</div>
        )}
        {/* Company */}
        {basicNfcData?.company && basicNfcData?.company !== "null"  && (
          <div className="italic text-gray-400 text-sm mb-1">{basicNfcData.company}</div>
        )}
        {/* Accreditations */}
        {basicNfcData?.accreditations && basicNfcData?.accreditations !== "null"  && (
          <div className="text-gray-500 text-sm mb-1">{basicNfcData.accreditations}</div>
        )}
        {/* Department */}
        {basicNfcData?.department && basicNfcData?.department !== "null"  && (
          <div className="italic text-gray-600 text-sm mb-1">{basicNfcData.department}</div>
        )}
        
        {/* Headline */}
        {basicNfcData?.headline && basicNfcData?.headline !== "null" &&  (
          <div className="text-gray-700 text-sm mb-1">{basicNfcData.headline}</div>
        )}
        {/* Preferred name and pronoun */}
        {(basicNfcData?.preferred_name || basicNfcData?.pronoun) && (
          <div className="flex items-center text-gray-400 text-xs mt-2">
            <FaBullhorn className="mr-2 text-blue-500 text-lg" />
            <span>Goes by </span>
            {basicNfcData?.preferred_name && basicNfcData?.preferred_name !== "null" && (
              <span className="ml-1 font-bold text-gray-700">{basicNfcData.preferred_name}</span>
            )}
            {basicNfcData?.pronoun && basicNfcData?.pronoun !== "null" && (
              <span className="ml-1 font-semibold text-gray-500">({basicNfcData.pronoun})</span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default CardSleek