"use client";

import React, { useState, useRef, useContext, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SocialIcon } from 'react-social-icons';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import FeedHeader from '@/components/common/FeedHeader';
import Intro from '@/components/common/Intro';
import api from '@/helpers/axios'; // adjust if needed
import OldInput from '@/components/custom/OldInput';
import { useDispatch, useSelector } from 'react-redux';
import { bindNfcData, getNfcField, storeNfc, updateNfc } from '../store';
import Image from 'next/image';
import Display from './Display';
import Information from './Information';
import Fields from './Fields';
import { FaUser, FaThumbsUp, FaBullhorn } from "react-icons/fa";
import toast from 'react-hot-toast';

const CardClassic = ({ profilePhotoUrl, logoUrl, basicNfcData }) => (
  <div className="w-full max-w-xs mx-auto">
    <div className="bg-white rounded-xl shadow-md overflow-hidden relative">
      {/* Profile Image with curved bottom edge */}
      <div className="relative h-100">
        <div className="w-full h-80 bg-gray-100 flex items-center justify-center overflow-hidden">
          {profilePhotoUrl ? (
            <img
              src={profilePhotoUrl}
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
        {logoUrl && (
          <div className="absolute right-4 bottom-20 bg-white rounded-full border shadow flex items-center justify-center w-10 h-10">
            <img src={logoUrl} alt="Logo" className="w-full rounded-full" />
          </div>
        )}
        {/* Like/thumbs-up icon */}
        <div className="absolute right-8 top-56 bg-white rounded-full border-2 border-blue-400 shadow flex items-center justify-center w-12 h-12">
          <FaThumbsUp className="text-blue-500 text-2xl" />
        </div>
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
);

const CardModern = ({ profilePhotoUrl, selectedColor }) => (
  <div className="relative w-full h-full flex flex-col items-center justify-between">
    <div className="w-full flex justify-center mt-4">
      <div className="w-32 h-32 rounded-full bg-gray-200 overflow-hidden border-4 border-white shadow">
        {profilePhotoUrl ? (
          <img src={profilePhotoUrl} alt="Profile" className="w-full h-full object-cover" />
        ) : (
          <SocialIcon network="user" style={{ height: 64, width: 64 }} bgColor="transparent" fgColor="#7c3aed" />
        )}
      </div>
    </div>
    <svg className="absolute bottom-0 left-0 w-full" height="60" viewBox="0 0 300 60">
      <polygon points="0,60 300,0 300,60" fill={selectedColor} />
    </svg>
    <div className="absolute bottom-6 right-6 bg-white rounded-full p-2 shadow">
      <SocialIcon network="user" style={{ height: 20, width: 20 }} bgColor="transparent" fgColor="#7c3aed" />
    </div>
  </div>
);

const CardSleek = ({ profilePhotoUrl, selectedColor }) => (
  <div className="relative w-full h-full flex flex-col items-center justify-between">
    <div className="w-full flex justify-center mt-4">
      <div className="w-32 h-32 rounded-full bg-gray-200 overflow-hidden border-4 border-white shadow">
        {profilePhotoUrl ? (
          <img src={profilePhotoUrl} alt="Profile" className="w-full h-full object-cover" />
        ) : (
          <SocialIcon network="user" style={{ height: 64, width: 64 }} bgColor="transparent" fgColor="#7c3aed" />
        )}
      </div>
    </div>
    <svg className="absolute bottom-0 left-0 w-full" height="60" viewBox="0 0 300 60">
      <rect x="0" y="30" width="300" height="30" fill={selectedColor} />
    </svg>
    <div className="absolute bottom-6 right-6 bg-white rounded-full p-2 shadow">
      <SocialIcon network="user" style={{ height: 20, width: 20 }} bgColor="transparent" fgColor="#7c3aed" />
    </div>
  </div>
);

const CardFlat = ({ profilePhotoUrl, selectedColor }) => (
  <div className="relative w-full h-full flex flex-col items-center justify-between">
    <div className="w-full flex justify-center mt-4">
      <div className="w-32 h-32 rounded-full bg-gray-200 overflow-hidden border-4 border-white shadow">
        {profilePhotoUrl ? (
          <img src={profilePhotoUrl} alt="Profile" className="w-full h-full object-cover" />
        ) : (
          <SocialIcon network="user" style={{ height: 64, width: 64 }} bgColor="transparent" fgColor="#7c3aed" />
        )}
      </div>
    </div>
    <svg className="absolute bottom-0 left-0 w-full" height="60" viewBox="0 0 300 60">
      <rect x="0" y="48" width="300" height="12" fill={selectedColor} />
    </svg>
    <div className="absolute bottom-6 right-6 bg-white rounded-full p-2 shadow">
      <SocialIcon network="user" style={{ height: 20, width: 20 }} bgColor="transparent" fgColor="#7c3aed" />
    </div>
  </div>
);

function LivePreviewCard({ profilePhotoUrl, selectedDesign, selectedColor, basicNfcData }) {
  return (
    <div className="bg-white rounded-xl shadow p-4 flex flex-col items-center border border-gray-200" style={{ minHeight: 420 }}>
      <div className="w-40 h-40 rounded-full bg-gray-200 overflow-hidden border-4 border-white shadow mb-4 flex items-center justify-center">
        {profilePhotoUrl ? (
          <img src={profilePhotoUrl} alt="Profile" className="w-full h-full object-cover" />
        ) : (
          <svg className="w-full h-full text-gray-400" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="60" fill="#e5e7eb" />
            <ellipse cx="60" cy="50" rx="28" ry="28" fill="#bdbdbd" />
            <ellipse cx="60" cy="90" rx="36" ry="20" fill="#bdbdbd" />
          </svg>
        )}
      </div>
      {/* Design wave */}
      <svg className="w-full" height="24" viewBox="0 0 160 24">
        {basicNfcData?.selectedDesign === 'classic' && (
          <path d="M0,24 Q80,0 160,24 Z" fill={selectedColor} />
        )}
        {basicNfcData?.selectedDesign === 'modern' && (
          <polygon points="0,24 160,0 160,24" fill={selectedColor} />
        )}
        {basicNfcData?.selectedDesign === 'sleek' && (
          <rect x="0" y="12" width="160" height="12" fill={selectedColor} />
        )}
        {basicNfcData?.selectedDesign === 'flat' && (
          <rect x="0" y="18" width="160" height="6" fill={selectedColor} />
        )}
      </svg>
      <div className="mt-4 text-left w-full px-2">
        <div className="text-xl leading-tight font-bold">
          {basicNfcData.prefix && <span className="font-bold">{basicNfcData.prefix} </span>}
          {basicNfcData.f_name && <span className="font-normal">{basicNfcData.f_name} </span>}
          {basicNfcData.middle_name && <span className="font-normal">{basicNfcData.middle_name} </span>}
          {basicNfcData.l_name && <span className="font-normal">{basicNfcData.l_name} </span>}
          {basicNfcData.suffix && <span className="font-bold">{basicNfcData.suffix} </span>}
        </div>
        {basicNfcData.accreditations && (
          <div className="text-gray-400 text-sm mt-1">{basicNfcData.accreditations}</div>
        )}
        {basicNfcData.title && (
          <div className="text-sm font-bold mt-1">{basicNfcData.title}</div>
        )}
        {basicNfcData.department && (
          <div className="text-sm font-bold text-gray-400 mt-1">{basicNfcData.department}</div>
        )}
        {basicNfcData.company && (
          <div className="text-sm italic text-gray-700 mt-1">{basicNfcData.company}</div>
        )}
        {basicNfcData.headline && (
          <div className="text-sm mt-1">{basicNfcData.headline}</div>
        )}
      </div>
    </div>
  );
}

const NfcForm = () => {
  const {basicNfcData, fields} = useSelector(({nfc}) => nfc);
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState('Display');
  const dispatch = useDispatch();

  const tabs = ['Display', 'Information', 'Fields', 'Card'];
  const designOptions = [
    { id: 1, label: 'Classic' },
    { id: 2, label: 'Modern' },
    { id: 3, label: 'Sleek' },
    { id: 4, label: 'Flat' }
  ];
  const colorOptions = [
    '#ff0000', '#00ffff', '#9900ff', '#ff00f', '#ffff00', '#00ff00', '#0000ff', '#ff00ff'
  ];

  useEffect(() => {
    dispatch(getNfcField())
  }, [])

  const handleInfoChange = (e) => {
    const {name, value} = e.target;
    dispatch(bindNfcData({...basicNfcData, [name]:value}))
  }
  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    // Display
    formData.append('design_card_id', basicNfcData.design_card_id);
    formData.append('display_nfc_color', basicNfcData.display_nfc_color);
    if (basicNfcData.profilePhoto) formData.append('profile', basicNfcData.profilePhoto);
    if (basicNfcData.logo) formData.append('logo', basicNfcData.logo);
    // basicNfcData
    Object.entries(basicNfcData).forEach(([key, value]) => {
      formData.append(key, value);
    });
    // Add fields as arrays for backend
    fields.forEach(field => {
      formData.append('nfc_id[]', field.id);
      formData.append('nfc_user_name[]', field.nfc_user_name || '');
      formData.append('nfc_label[]', field.nfc_label || field.label || '');
      formData.append('display_name[]', field.display_name || '');
    });

    const udatedData = {
      id: basicNfcData?.id,
      formData
    }
    
    const action = basicNfcData?.id ? updateNfc(udatedData) : storeNfc(formData);
      
    dispatch(action)
      .then((res) => {
        if(res.error){
          return;
        }else{
          
          toast.success(basicNfcData?.id ? "Updated Successfully" : 'NFC Card created')
        }
      })
    
  };

  console.log('basicNfcData',basicNfcData)

  return (
    <div className="content-area">
      <div className="mx-auto">
        {/* Navigation Tabs */}
        <FeedHeader/>
        <div className="mx-auto rounded-lg shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4">
            {/* Left Sidebar - INTRO */}
            <div className="md:col-span-3">
              <Intro/>
            </div>
            {/* Center Content */}
            <div className="md:col-span-9 bg-white">
              <div className="flex flex-col md:flex-row w-full">
                {/* Preview Card on the left */}
                <div className="w-full md:w-1/3 flex-shrink-0 p-5">
                  {basicNfcData.design_card_id === 1 && (
                    <CardClassic
                      profilePhotoUrl={basicNfcData.profilePhotoUrl}
                      logoUrl={basicNfcData.logoUrl}
                      basicNfcData={basicNfcData}
                    />
                  )}
                  {basicNfcData.design_card_id === 2 && (
                    <CardModern
                      profilePhotoUrl={basicNfcData.profilePhotoUrl}
                      selectedColor={basicNfcData.selectedColor}
                    />
                  )}
                  {basicNfcData.design_card_id === 3 && (
                    <CardSleek
                      profilePhotoUrl={basicNfcData.profilePhotoUrl}
                      selectedColor={basicNfcData.selectedColor}
                    />
                  )}
                  {basicNfcData.design_card_id === 4 && (
                    <CardFlat
                      profilePhotoUrl={basicNfcData.profilePhotoUrl}
                      selectedColor={basicNfcData.selectedColor}
                    />
                  )}
                </div>
                {/* Tabs and content on the right */}
                <div className="w-full md:w-2/3">
                  <form onSubmit={handleSubmit} className="flex flex-col bg-white p-4 gap-4 w-full">
                    {/* Tabs */}
                    <div className="border-b border-gray-200">
                      <div className="flex">
                        {tabs?.map(tab => (
                          <button
                            key={tab}
                            type="button"
                            onClick={() => setActiveTab(tab)}
                            className={`px-6 py-3 cursor-pointer font-medium ${
                              activeTab === tab
                                ? 'text-blue-500 border-b-2 border-blue-500'
                                : 'text-gray-600'
                            }`}
                          >
                            {tab}
                          </button>
                        ))}
                      </div>
                    </div>
                    {/* Tab Content */}
                    <div className="p-6">
                      {activeTab === 'Display' && (
                        <Display
                          designOptions={designOptions}
                          colorOptions={colorOptions}
                        />
                      )}
                      {activeTab === 'Information' && (
                        <Information
                          basicNfcData={basicNfcData}
                          handleInfoChange={basicNfcData.handleInfoChange}
                        />
                      )}
                      {activeTab === 'Fields' && (
                        <Fields />
                      )}
                      {activeTab === 'Card' && (
                        <div className="py-3">
                          <div className="bg-blue-50 border border-blue-100 rounded-lg flex items-center gap-3 px-6 py-4 mb-6" style={{ maxWidth: 500 }}>
                            <SocialIcon network="info" style={{ height: 32, width: 32 }} bgColor="transparent" fgColor="#64748b" />
                            <span className="text-gray-600 text-base">This field does not appear on the card.</span>
                          </div>
                          <div className="mb-2">
                            <label className="block text-gray-700 text-md mb-2">Card Name</label>
                            <input type="text" placeholder="Card Name" className="w-full max-w-md border border-gray-300 rounded px-3 py-2 text-base" name="card_name" value={basicNfcData.card_name || ''} onChange={handleInfoChange} />
                          </div>
                        </div>
                      )}
                    </div>
                    {/* Save button always visible at the bottom */}
                    <div className="flex justify-end mt-4">
                      <Link href="/user/nfc" className="px-6 py-2 cursor-pointer bg-gray-500 text-white rounded mr-2">Cancel</Link>
                      <button type="submit" className="px-6 py-2 cursor-pointer bg-blue-600 text-white rounded">{basicNfcData?.id ? "Update" : "Save"}</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NfcForm;