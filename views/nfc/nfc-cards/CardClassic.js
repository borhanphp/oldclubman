import React from 'react'
import { FaBullhorn, FaThumbsUp } from 'react-icons/fa'

const CardClassic = ({ basicNfcData }) => {
    console.log('check for card list',basicNfcData)
  return (
    <div className="w-full max-w-xs mx-auto">
    <div className="bg-white rounded-xl shadow-md overflow-hidden relative">
      {/* Profile Image with curved bottom edge */}
      <div className="relative">
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
        <div className="absolute left-0 right-0 bottom-0 pointer-events-none">
          <svg preserveAspectRatio="xMinYMax meet" viewBox="0 0 246 57" xmlns="http://www.w3.org/2000/svg">
            <path id="forground" clipRule="evenodd" d="M 214.7168,6.1113281 C 195.65271,5.9023124 172.37742,11.948182 137.87305,32.529297 110.16613,49.05604 86.980345,56.862784 65.015625,57 H 65 v 1 H 246 V 11.453125 C 236.0775,8.6129313 226.15525,6.2367376 214.7168,6.1113281 Z" fill="white" fillRule="evenodd"></path>
            <path id="background" clipRule="evenodd" d="M 0,35.773438 V 58 H 65 L 64.97852,57 C 43.192081,57.127508 22.605139,49.707997 0,35.773438 Z " fill="white" fillRule="evenodd"></path>
            <path id="wave" clipRule="evenodd" d="m 0,16.7221 v 19.052 C 45.4067,63.7643 82.6667,65.4583 137.873,32.5286 193.08,-0.401184 219.54,3.87965 246,11.4535 V 6.51403 C 185.24,-16.8661 135.913,29.331 97.6933,40.8564 59.4733,52.3818 33.6467,44.1494 0,16.7221 Z " fill={basicNfcData?.display_nfc_color} fillRule="evenodd"></path>
          </svg>
        </div>
        {/* Logo (rounded) */}
        {basicNfcData?.logoUrl && (
          <div className="absolute right-4 bottom-0 bg-white rounded-full border shadow flex items-center justify-center w-15 h-15">
            <img src={basicNfcData?.logoUrl} alt="Logo" className="w-full rounded-full" />
          </div>
        )}
      </div>
      {/* Card Info */}
      <div className="p-4">
        {/* Name row */}
        <div className="text-lg font-bold text-gray-900">
          {basicNfcData?.prefix && basicNfcData?.prefix !== "null" && <span className="font-bold">{basicNfcData.prefix} </span>}
          {basicNfcData?.first_name && basicNfcData?.first_name !== "null" && <span className="font-bold">{basicNfcData.first_name} </span>}
          {basicNfcData?.middle_name && basicNfcData?.middle_name !== "null" && <span className="font-bold">{basicNfcData.middle_name} </span>}
          {basicNfcData?.last_name && basicNfcData?.last_name !== "null" && <span className="font-bold">{basicNfcData.last_name} </span>}
          {basicNfcData?.suffix && basicNfcData?.suffix !== "null" && <span className="font-bold">{basicNfcData.suffix} </span>}
          {basicNfcData?.maiden_name && basicNfcData?.maiden_name !== "null" && <span className="font-bold">({basicNfcData.maiden_name})</span>}
        </div>
        {/* Accreditations */}
        {basicNfcData?.accreditations && basicNfcData?.accreditations !== "null" && (
          <div className="text-gray-500 text-sm mb-1">{basicNfcData.accreditations}</div>
        )}
        {/* Title */}
        {basicNfcData?.title && basicNfcData?.title !== "null" && (
          <div className="font-bold text-sm mb-1">{basicNfcData.title}</div>
        )}
        {/* Department */}
        {basicNfcData?.department && basicNfcData?.department !== "null" && (
          <div className="italic text-gray-600 text-sm mb-1">{basicNfcData.department}</div>
        )}
        {/* Company */}
        {basicNfcData?.company && basicNfcData?.company !== "null" && (
          <div className="italic text-gray-400 text-sm mb-1">{basicNfcData.company}</div>
        )}
        {/* Headline */}
        {basicNfcData?.headline && basicNfcData?.headline !== "null" && (
          <div className="text-gray-700 text-sm mb-1">{basicNfcData.headline}</div>
        )}
        {/* Preferred name and pronoun */}
        {(basicNfcData?.preferred_name || basicNfcData?.pronoun) && (basicNfcData?.preferred_name !== "null" || basicNfcData?.pronoun !== "null") && (
          <div className="flex items-center text-gray-400 text-xs mt-2">
            <FaBullhorn className="mr-2 text-blue-500 text-lg" />
            <span>Goes by </span>
            {basicNfcData?.preferred_name && basicNfcData?.preferred_name !== "null" && (
              <span className="ml-1 font-bold text-gray-700">{basicNfcData.preferred_name}</span>
            )}
            {basicNfcData?.pronoun & basicNfcData?.pronoun !== "null" && (
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
  )
}

export default CardClassic