"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaUser, FaCamera, FaPlus } from 'react-icons/fa';
import FeedHeader from '@/components/common/FeedHeader';

const NfcForm = () => {
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState('Display');
  const [selectedDesign, setSelectedDesign] = useState('Classic');
  const [selectedColor, setSelectedColor] = useState('#ff0000');

  const tabs = ['Display', 'Information', 'Fields', 'Card'];
  
  const designOptions = [
    { id: 'Classic', label: 'Classic' },
    { id: 'Modern', label: 'Modern' },
    { id: 'Sleek', label: 'Sleek' },
    { id: 'Flat', label: 'Flat' }
  ];
  
  const colorOptions = [
    '#ff0000', // Red
    '#00ffff', // Cyan
    '#9900ff', // Purple
    '#ff00ff', // Magenta
    '#ffff00', // Yellow
    '#00ff00', // Green
    '#0000ff', // Blue
    '#ff00ff'  // Pink
  ];

  const isLinkActive = (path) => {
    return pathname.startsWith(path);
  };

  return (
    <div className="content-area py-3">
      <div className="mx-auto">
        {/* Navigation Tabs */}
        <FeedHeader/>

        <div className="mx-auto  rounded-lg shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4">
            {/* Left Sidebar - INTRO */}
            <div className="md:col-span-3">
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold mb-4">INTRO</h2>
                <div className="text-gray-700 mb-3">
                  <p>Full Stack Developer at Test</p>
                  <p className="text-gray-500">{'{ Laravel,Vue,React }'}</p>
                </div>
                
                <div className="flex justify-between py-3">
                  <div className="text-center">
                    <div className="font-bold">256</div>
                    <div className="text-gray-500 text-sm">Post</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold">2.5K</div>
                    <div className="text-gray-500 text-sm">Followers</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold">365</div>
                    <div className="text-gray-500 text-sm">Following</div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Center Content */}
            <div className="md:col-span-9">
              <div className="flex flex-col bg-white p-4 md:flex-row gap-4 w-full">
                {/* Profile preview */}
                <div className="md:w-1/3 border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-center relative">
                    <div className={`w-36 h-36 md:w-48 md:h-48 rounded-full overflow-hidden border-4 border-${selectedColor.substring(1)} bg-gray-200 flex items-center justify-center`}>
                      <FaUser className="text-gray-400 text-6xl" />
                    </div>
                    <div className="absolute bottom-0 right-1/4 bg-white rounded-full p-2 shadow-md">
                      <FaCamera className="text-gray-600" />
                    </div>
                  </div>
                  <div className="text-center mt-4">
                    <p className="text-gray-500 text-sm italic">Goes by</p>
                  </div>
                </div>

                <div className="md:w-2/3  rounded-lg overflow-hidden">
                  {/* Tabs */}
                  <div className="border-b border-gray-200">
                    <div className="flex">
                      {tabs.map(tab => (
                        <button
                          key={tab}
                          onClick={() => setActiveTab(tab)}
                          className={`px-6 py-3 font-medium ${
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
                      <div>
                        <div className="mb-6">
                          <h3 className="text-md font-semibold mb-3">Profile Photo</h3>
                          <div className="flex items-center mt-2">
                            <div className="w-20 h-20 bg-gray-200 rounded-md flex items-center justify-center mr-4">
                              <FaUser className="text-gray-400 text-2xl" />
                            </div>
                            <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 px-4 rounded-md flex items-center">
                              <span className="mr-1">Replace Photo</span>
                            </button>
                          </div>
                        </div>
                        
                        <div className="mb-6">
                          <h3 className="text-md font-semibold mb-3">Design</h3>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            {designOptions.map(design => (
                              <div 
                                key={design.id}
                                onClick={() => setSelectedDesign(design.id)}
                                className={`cursor-pointer transition-all duration-200 ${
                                  selectedDesign === design.id ? 'ring-2 ring-blue-500' : ''
                                }`}
                              >
                                <div className="bg-black rounded-t-lg h-12"></div>
                                <div className="bg-white rounded-b-lg p-2 h-8 flex items-center justify-center">
                                  <span className="text-xs">{design.label}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div className="mb-6">
                          <h3 className="text-md font-semibold mb-3">Color</h3>
                          <div className="flex flex-wrap gap-2">
                            {colorOptions.map(color => (
                              <div 
                                key={color}
                                onClick={() => setSelectedColor(color)}
                                className={`w-8 h-8 rounded-full cursor-pointer transition-all duration-200 ${
                                  selectedColor === color ? 'ring-2 ring-gray-400 ring-offset-2' : ''
                                }`}
                                style={{ backgroundColor: color }}
                              />
                            ))}
                          </div>
                        </div>
                        
                        <div className="mb-6">
                          <h3 className="text-md font-semibold mb-3">Logo</h3>
                          <div className="flex items-center mt-2">
                            <div className="w-20 h-20 bg-gray-200 rounded-md flex items-center justify-center mr-4">
                              <FaUser className="text-gray-400 text-2xl" />
                            </div>
                            <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 px-4 rounded-md flex items-center">
                              <span className="mr-1">Add Logo</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {activeTab === 'Information' && (
                      <div className="py-3">
                        <p>Information content goes here</p>
                      </div>
                    )}
                    
                    {activeTab === 'Fields' && (
                      <div className="py-3">
                        <p>Fields content goes here</p>
                      </div>
                    )}
                    
                    {activeTab === 'Card' && (
                      <div className="py-3">
                        <p>Card content goes here</p>
                      </div>
                    )}
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

export default NfcForm;