import React from 'react'
import { FaRocket } from 'react-icons/fa'

const CardModern = ({ basicNfcData = {} }) => {
  return (
    <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg rounded-2xl shadow-lg overflow-hidden bg-white relative font-sans mx-auto">
      {/* Angled colored header */}
      <div
        className="relative h-32 sm:h-40 md:h-48 p-4"
        style={{
          background: basicNfcData?.display_nfc_color,
          clipPath: "polygon(0 1%, 100% 0%, 100% 71%, 0% 100%)"
        }}
      >
        {basicNfcData?.logoUrl ? (
          <img src={basicNfcData?.logoUrl} alt="Logo" className="w-10 h-10 rounded-full object-cover" />
        ) : (
          <div className="w-10 h-10 flex items-center justify-center text-3xl text-gray-400">👤</div>
        )}
        {/* Name, title, company */}
        <div className="absolute left-4 top-20 sm:left-6 sm:top-20 md:left-4 md:top-20">
          <div className="text-white text-lg sm:text-2xl font-bold">
          {basicNfcData?.first_name && basicNfcData?.first_name !== "null" && <span className="font-bold">{basicNfcData.first_name} </span>}
            {basicNfcData?.middle_name && basicNfcData?.middle_name !== "null" && <span className="font-bold">{basicNfcData.middle_name} </span>}
        

            {(basicNfcData?.first_name || "") + " " + (basicNfcData?.middle_name || "") + " " + (basicNfcData?.last_name || "") || "Gina Homenick"}
          </div>
          <div className="text-white text-xs sm:text-sm font-medium">{basicNfcData?.title || "Central Web Assistant"}</div>
          <div className="text-white text-xs italic">{basicNfcData?.company || "RocketDesigns, Inc."}</div>
        </div>
      </div>
      {/* Profile photo - overlaps header and body */}
      <div className="absolute transform -translate-x-1/2 -right-15 top-30 w-22 h-22 rounded-full border-1 border-white overflow-hidden shadow-lg bg-gray-100 z-10">
        {basicNfcData?.profilePhotoUrl ? (
          <img 
            src={basicNfcData?.profilePhotoUrl || "/common-avator.jpg"} 
            alt="Profile" 
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/common-avator.jpg";
            }}
          /> 
       ) : (
          <div className="w-full h-full flex items-center justify-center text-3xl text-gray-400">👤</div>
        )}
      </div>
      {/* Card body */}
      <div className="pt-16 sm:pt-20 pb-4 px-4 sm:px-6">
        {/* Headline/paragraph */}
        <div className="text-gray-700 text-sm sm:text-base mb-2">
          {basicNfcData?.headline || "This is a sample paragraph. Sint con sequatur ipsam. Recusandae debitis similique ratione."}
        </div>
        {/* Goes by */}
        {(basicNfcData?.preferred_name || basicNfcData?.pronoun) && (basicNfcData?.preferred_name  !== "null" || basicNfcData?.pronoun  !== "null") && (
          <div className="text-xs sm:text-sm text-gray-400 flex items-center mb-2">
            <FaRocket className="mr-1 text-purple-400" />
            Goes by <span className="ml-1 font-bold text-gray-700">{basicNfcData?.preferred_name || "Gina"}</span>
            {basicNfcData?.pronoun && (
              <span className="ml-1 text-gray-400">({basicNfcData.pronoun || "She/her/hers"})</span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default CardModern