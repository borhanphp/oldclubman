"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaEye, FaEdit, FaCopy, FaTrash, FaShareAlt, FaQrcode } from 'react-icons/fa';
import CardClassic from '@/views/nfc/nfc-cards/CardClassic';
import CardModern from '@/views/nfc/nfc-cards/CardModern';
import CardSleek from '@/views/nfc/nfc-cards/CardSleek';
import CardFlat from '@/views/nfc/nfc-cards/CardFlat';
import toast from 'react-hot-toast';
import api from '@/helpers/axios';

const NFCCardGrid = ({ nfcCards, loading }) => {
  const [copiedId, setCopiedId] = useState(null);
  const [designOptions, setDesignOptions] = useState([]);

  useEffect(() => {
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

  const handleCopyUrl = (id) => {
    const url = `${window.location.origin}/card/fb_share/${id}`;
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    toast.success('Card URL copied to clipboard!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading your NFC cards...</p>
        </div>
      </div>
    );
  }

  if (!nfcCards || nfcCards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center max-w-md">
          <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaQrcode className="text-blue-600 text-4xl" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-3">No NFC Cards Yet</h3>
          <p className="text-gray-600 mb-6">
            Create your first digital business card and start sharing your information instantly.
          </p>
          <Link
            href="/user/nfc/create"
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all"
          >
            <span>Create Your First Card</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {nfcCards.map((card) => {
        const fullCard = {
          ...card,
          ...card.nfc_info,
          ...card.nfc_design,
          display_nfc_color: card?.card_design?.color,
          profilePhotoUrl: process.env.NEXT_PUBLIC_CLIENT_FILE_PATH + card?.nfc_info?.image,
          logoUrl: process.env.NEXT_PUBLIC_CARD_FILE_PATH + card?.card_design?.logo,
        };

        return (
          <div
            key={card.id}
            className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group"
          >
            {/* Card Preview */}
            <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 p-6">
              <Link href={`/user/nfc/preview/${card.id}`}>
                <div className="transform transition-transform group-hover:scale-105">
                  {(() => {
                    const selectedDesign = designOptions.find(d => d.id === card?.card_design?.design_card_id);
                    const designLabel = selectedDesign?.design_name?.toLowerCase() || 'classic';
                    
                    switch(designLabel) {
                      case 'classic':
                        return <CardClassic basicNfcData={fullCard} />;
                      case 'modern':
                        return <CardModern basicNfcData={fullCard} />;
                      case 'sleek':
                        return <CardSleek basicNfcData={fullCard} />;
                      case 'flat':
                        return <CardFlat basicNfcData={fullCard} />;
                      default:
                        return <CardClassic basicNfcData={fullCard} />;
                    }
                  })()}
                </div>
              </Link>
            </div>

            {/* Card Info */}
            <div className="p-5">
              <h3 className="text-lg font-bold text-gray-800 mb-1 truncate">
                {card.nfc_info?.name || 'Unnamed Card'}
              </h3>
              <p className="text-sm text-gray-500 mb-4 truncate">
                {card.nfc_info?.title || 'No title'} {card.nfc_info?.company ? `at ${card.nfc_info.company}` : ''}
              </p>

              {/* Action Buttons */}
              <div className="grid grid-cols-3 gap-2">
                <Link
                  href={`/user/nfc/preview/${card.id}`}
                  className="flex items-center justify-center space-x-1 bg-blue-100 hover:bg-blue-200 text-blue-600 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                  title="View Card"
                >
                  <FaEye />
                  <span className="hidden sm:inline">View</span>
                </Link>
                
                <button
                  onClick={() => handleCopyUrl(card.id)}
                  className={`flex items-center justify-center space-x-1 ${
                    copiedId === card.id
                      ? 'bg-green-100 text-green-600'
                      : 'bg-purple-100 hover:bg-purple-200 text-purple-600'
                  } px-3 py-2 rounded-lg text-sm font-medium transition-colors`}
                  title="Copy URL"
                >
                  <FaCopy />
                  <span className="hidden sm:inline">{copiedId === card.id ? 'Copied!' : 'Copy'}</span>
                </button>

                <Link
                  href={`/user/nfc/preview/${card.id}`}
                  className="flex items-center justify-center space-x-1 bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                  title="Share Card"
                >
                  <FaShareAlt />
                  <span className="hidden sm:inline">Share</span>
                </Link>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default NFCCardGrid;

