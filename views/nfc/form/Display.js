import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { bindNfcData } from "../store";
import { SocialIcon } from 'react-social-icons';

const Display = ({ designOptions, colorOptions }) => {
  const dispatch = useDispatch();
  const basicNfcData = useSelector(state => state.nfc.basicNfcData);

  const handleProfilePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      dispatch(bindNfcData({ ...basicNfcData, profile: file, profilePhotoUrl: URL.createObjectURL(file) }));
    }
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      dispatch(bindNfcData({ ...basicNfcData, logo: file, logoUrl: URL.createObjectURL(file) }));
    }
  };

  const handleDesignChange = (design_card_id) => {
    dispatch(bindNfcData({ ...basicNfcData, design_card_id }));
  };

  const handleColorChange = (display_nfc_color) => {
    dispatch(bindNfcData({ ...basicNfcData, display_nfc_color }));
  };

  return(
    <div className="mb-8">
    {/* Profile Photo */}
    <h3 className="text-md font-semibold mb-3">Profile Photo</h3>
    <div className="flex items-center mb-8">
      <div className="w-24 h-24 bg-gray-200 rounded-md flex items-center justify-center mr-6 border border-gray-300 overflow-hidden">
        {basicNfcData.profilePhotoUrl ? (
          <img src={basicNfcData.profilePhotoUrl} alt="Profile" className="w-full h-full object-cover" />
        ) : (
          <SocialIcon network="user" style={{ height: 48, width: 48 }} bgColor="transparent" fgColor="#7c3aed" />
        )}
      </div>
      <input type="file" accept="image/*" onChange={handleProfilePhotoChange} className="block" />
    </div>
    {/* Design */}
    <h3 className="text-md font-semibold mb-3">Design</h3>
    <div className="flex gap-6 mb-8">
      {designOptions.map(design => (
        <div
          key={design.id}
          onClick={() => handleDesignChange(design.id)}
          className={`cursor-pointer flex flex-col items-center group`}
        >
          <div className={`w-16 h-12 rounded-lg bg-white shadow flex items-end justify-center relative border-2 ${basicNfcData.design_card_id === design.id ? 'border-blue-500' : 'border-transparent'}`}>
            {/* Example SVGs for design backgrounds */}
            {design.id === 1 && (
              <svg viewBox="0 0 64 24" className="absolute bottom-0 left-0 w-full h-6">
                <path d="M0,24 Q32,0 64,24 Z" fill="#3b82f6" />
              </svg>
            )}
            {design.id === 2 && (
              <svg viewBox="0 0 64 24" className="absolute bottom-0 left-0 w-full h-6">
                <polygon points="0,24 64,0 64,24" fill="#3b82f6" />
              </svg>
            )}
            {design.id === 3 && (
              <svg viewBox="0 0 64 24" className="absolute bottom-0 left-0 w-full h-6">
                <rect x="0" y="12" width="64" height="12" fill="#3b82f6" />
              </svg>
            )}
            {design.id === 4 && (
              <svg viewBox="0 0 64 24" className="absolute bottom-0 left-0 w-full h-6">
                <rect x="0" y="18" width="64" height="6" fill="#3b82f6" />
              </svg>
            )}
          </div>
          <span className={`mt-2 text-xs ${basicNfcData.design_card_id === design.id ? 'text-blue-600 font-semibold' : 'text-gray-700'}`}>{design.label}</span>
        </div>
      ))}
    </div>
    {/* Color */}
    <h3 className="text-md font-semibold mb-3">Color</h3>
    <div className="flex gap-3 mb-8">
      {colorOptions.map(color => (
        <div
          key={color}
          onClick={() => handleColorChange(color)}
          className={`w-8 h-8 rounded-full cursor-pointer border-2 ${basicNfcData.display_nfc_color === color ? 'border-gray-700 ring-2 ring-blue-400' : 'border-gray-200'}`}
          style={{ backgroundColor: color }}
        />
      ))}
    </div>
    {/* Logo */}
    <h3 className="text-md font-semibold mb-3">Logo</h3>
    <div className="flex items-center">
      <div className="w-20 h-20 bg-gray-200 rounded-md flex items-center justify-center mr-6 border border-gray-300 overflow-hidden">
        {basicNfcData.logoUrl ? (
          <img src={basicNfcData.logoUrl} alt="Logo" className="w-full h-full object-cover" />
        ) : (
          <SocialIcon network="user" style={{ height: 40, width: 40 }} bgColor="transparent" fgColor="#7c3aed" />
        )}
      </div>
      <input type="file" accept="image/*" onChange={handleLogoChange} className="block" />
    </div>
  </div>
  )
};

export default Display; 