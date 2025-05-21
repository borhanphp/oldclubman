import React from 'react'
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaBullhorn } from 'react-icons/fa'

const CardFlat = ({basicNfcData = {}}) => {
  return (
    <div className="w-80 rounded-3xl shadow-lg overflow-hidden bg-white relative font-sans border border-gray-100">
      {/* Top profile photo */}
      <div className="w-full h-40 bg-gray-200">
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
      <div className="h-3" style={{ backgroundColor: basicNfcData?.display_nfc_color }}></div>
      {/* Info section */}
      <div className="px-6 py-6 flex flex-col">
        {/* Logo */}
        {basicNfcData?.logoUrl && (
          <img src={basicNfcData?.logoUrl} alt="Logo" className="w-12 h-12 mb-2 object-contain" />
        )}
        {/* Name, title, company */}
        <div className="text-lg font-bold text-gray-900">
          {basicNfcData?.prefix && <span className="font-bold">{basicNfcData.prefix} </span>}
          {basicNfcData?.first_name && <span className="font-bold">{basicNfcData.first_name} </span>}
          {basicNfcData?.middle_name && <span className="font-bold">{basicNfcData.middle_name} </span>}
          {basicNfcData?.last_name && <span className="font-bold">{basicNfcData.last_name} </span>}
          {basicNfcData?.suffix && <span className="font-bold">{basicNfcData.suffix} </span>}
          {basicNfcData?.maiden_name && <span className="font-bold">({basicNfcData.maiden_name})</span>}
        </div>
        
        {/* Title */}
        {basicNfcData?.title && (
          <div className="font-bold text-sm mb-1">{basicNfcData.title}</div>
        )}
        {/* Company */}
        {basicNfcData?.company && (
          <div className="italic text-gray-400 text-sm mb-1">{basicNfcData.company}</div>
        )}
        {/* Accreditations */}
        {basicNfcData?.accreditations && (
          <div className="text-gray-500 text-sm mb-1">{basicNfcData.accreditations}</div>
        )}
        {/* Department */}
        {basicNfcData?.department && (
          <div className="italic text-gray-600 text-sm mb-1">{basicNfcData.department}</div>
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
      </div>
    </div>
  )
}

export default CardFlat