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
      <label className="bg-gray-500 hover:bg-gray-400 text-white px-4 py-2 rounded-md cursor-pointer">
      <input hidden type="file" accept="image/*" onChange={handleProfilePhotoChange} className="block" />
      Upload Logo

      </label>
    </div>
    {/* Design */}
    <h3 className="text-md font-semibold mb-3">Design</h3>
    <div className="flex gap-6 mb-8">
      {designOptions?.map(design => (
        <div
          key={design.id}
          onClick={() => handleDesignChange(design.id)}
          className={`cursor-pointer flex flex-col items-center group`}
        >
          <div className={`w-16 h-16 rounded-2xl bg-white shadow flex items-end justify-center relative border-2 ${basicNfcData.design_card_id === design.id ? 'border-gray-200' : 'border-transparent'}`}>
            {/* Example SVGs for design backgrounds */}
            {design.id === 1 && (
              <svg viewBox="0 0 72 72" focusable="false" class="chakra-icon chakra-icon css-5nx6ny">
                <g clip-path="url(#clip0_1931_53838)">
                    <path class="svg-color" fill="#000000" d="M0 -24H72V54H0V-24Z">
                    </path>
                    <path d="M72 72.5V39.18C44.16 29.9533 29.568 63.3176 0 41.7337V72.5H72Z" fill="whitesmoke"></path>
                </g>
                <defs>
                    <clipPath id="clip0_1931_53838">
                        <rect fill="white" height="72" rx="16" width="72"></rect>
                    </clipPath>
                </defs>
              </svg>
            )}
            {design.id === 2 && (
              <svg viewBox="0 0 72 72" focusable="false" class="chakra-icon chakra-icon css-5nx6ny">
                <g clip-path="url(#clip0_805_62524)">
                    <rect fill="white" height="72" rx="16" width="72"></rect>
                    <g clip-path="url(#clip1_805_62524)">
                        <path class="svg-color" fill="#000000" d="M0 -16.875H72V30.3333L0 55.637V-16.875Z">
                        </path>
                        <circle cx="53" cy="27.125" fill="#ddd" r="14"></circle>
                    </g>
                </g>
                <defs>
                    <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_805_62524" x1="36" x2="36" y1="-16.875" y2="55.637">
                        <stop offset="0" stop-color="currentColor"></stop>
                        <stop offset="0.75" stop-color="currentColor" stop-opacity="0.75"></stop>
                    </linearGradient>
                    <clipPath id="clip0_805_62524">
                        <rect fill="white" height="72" rx="16" width="72"></rect>
                    </clipPath>
                    <clipPath id="clip1_805_62524">
                        <rect fill="white" height="72.576" transform="translate(0 -16.875)" width="72"></rect>
                    </clipPath>
                </defs>
              </svg>
            )}
            {design.id === 3 && (
              <svg viewBox="0 0 72 72" focusable="false" class="chakra-icon chakra-icon css-5nx6ny">
                <g clip-path="url(#a)">
                    <rect fill="#F5F5F5" height="72" rx="16" width="72"></rect>
                    <circle cx="36" cy="-6.75" class="svg-color" fill="#000000" r="59.625"></circle>
                    <path fill="white" d="M15.75 42.75h41.625v13.5H15.75z"></path>
                </g>
                <defs>
                    <clipPath id="a">
                        <rect fill="#fff" height="72" rx="16" width="72"></rect>
                    </clipPath>
                </defs>
              </svg>
            )}
            {design.id === 4 && (
              <svg viewBox="0 0 72 72" focusable="false" class="chakra-icon chakra-icon css-5nx6ny">
                <g clip-path="url(#a)">
                    <rect fill="white" height="72" rx="16" width="72"></rect>
                    <g clip-path="url(#b)" fill="currentColor">
                        <path class="svg-color" fill="#000000" d="M0-29.25h72v72.512H0z"></path>
                        <path class="svg-color" fill="#000000" d="M0 32.184v4.88c13.344 7.171 24 7.605 40.224-.83 16.224-8.436 24-7.34 31.776-5.4V29.57c-17.856-5.99-32.352 5.845-43.584 8.798C17.184 41.319 9.888 39.21 0 32.184Z">
                        </path>
                    </g>
                </g>
                <defs>
                    <clipPath id="a">
                        <rect fill="#fff" height="72" rx="16" width="72"></rect>
                    </clipPath>
                    <clipPath id="b">
                        <path d="M0-29.25h72v72.576H0z" fill="#fff">
                        </path>
                    </clipPath>
                </defs>
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
      {colorOptions?.map(color => (
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
      <label className="bg-gray-500 hover:bg-gray-400 text-white px-4 py-2 rounded-md cursor-pointer">
      <input hidden type="file" accept="image/*" onChange={handleLogoChange} className="block" />
      Upload Logo

      </label>
    </div>
  </div>
  )
};

export default Display; 