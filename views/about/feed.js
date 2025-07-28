"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  FaEllipsisH,
  FaVideo,
  FaGlobe,
  FaComment,
  FaMapMarkerAlt,
  FaEnvelope,
  FaBirthdayCake,
  FaCalendarAlt,
  FaBriefcase,
  FaGraduationCap,
  FaHome,
  FaHeart,
  FaUsers,
  FaEdit,
  FaLock,
} from "react-icons/fa";
import PostModal from "@/components/custom/PostModal";
import FeedHeader from "@/components/common/FeedHeader";
import Intro from "@/components/common/Intro";
import { useDispatch, useSelector } from "react-redux";
import { getMyProfile, storeBsicInformation } from "../settings/store";
import moment from "moment";
import CreatePostBox from "@/components/common/CreatePostBox";
import PostList from "@/components/common/PostList";
import FeedLayout from "@/components/common/FeedLayout";
import {
  CiCalendar,
  CiCalendarDate,
  CiHeart,
  CiLocationOn,
  CiMail,
  CiPhone,
  CiStopwatch,
  CiUser,
} from "react-icons/ci";
import { LuPhone } from "react-icons/lu";

const AboutContent = () => {
  const { profile, profileData } = useSelector(({ settings }) => settings);
  const { isPostModalOpen } = useSelector(({ gathering }) => gathering);
  const dispatch = useDispatch();

  // State for active section
  const [activeSection, setActiveSection] = useState('overview');



  useEffect(() => {
    dispatch(getMyProfile());
  }, []);

console.log('profile',profile.client)
 
  return (
    <FeedLayout>
      {/* Content Area - Two Column Layout */}
      <div className="content-area pt-3">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Left Sidebar - Navigation */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-4 sticky top-4">
                <h3 className="text-xl font-bold mb-4">About</h3>
                
                {/* Navigation Menu */}
                <nav className="space-y-1">
                  <button 
                    onClick={() => setActiveSection('overview')}
                    className={`block w-full text-left px-3 py-2 rounded-md transition-colors ${
                      activeSection === 'overview' 
                        ? 'text-blue-600 font-medium bg-blue-50' 
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Overview
                  </button>
                  <button 
                    onClick={() => setActiveSection('work-education')}
                    className={`block w-full text-left px-3 py-2 rounded-md transition-colors ${
                      activeSection === 'work-education' 
                        ? 'text-blue-600 font-medium bg-blue-50' 
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Work and education
                  </button>
                  <button 
                    onClick={() => setActiveSection('places-lived')}
                    className={`block w-full text-left px-3 py-2 rounded-md transition-colors ${
                      activeSection === 'places-lived' 
                        ? 'text-blue-600 font-medium bg-blue-50' 
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Places lived
                  </button>
                  <button 
                    onClick={() => setActiveSection('contact-info')}
                    className={`block w-full text-left px-3 py-2 rounded-md transition-colors ${
                      activeSection === 'contact-info' 
                        ? 'text-blue-600 font-medium bg-blue-50' 
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Contact and basic info
                  </button>
                  <button 
                    onClick={() => setActiveSection('privacy-legal')}
                    className={`block w-full text-left px-3 py-2 rounded-md transition-colors ${
                      activeSection === 'privacy-legal' 
                        ? 'text-blue-600 font-medium bg-blue-50' 
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Privacy and legal info
                  </button>
                  <button 
                    onClick={() => setActiveSection('profile-transparency')}
                    className={`block w-full text-left px-3 py-2 rounded-md transition-colors ${
                      activeSection === 'profile-transparency' 
                        ? 'text-blue-600 font-medium bg-blue-50' 
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Profile transparency
                  </button>
                  <button 
                    onClick={() => setActiveSection('family-relationships')}
                    className={`block w-full text-left px-3 py-2 rounded-md transition-colors ${
                      activeSection === 'family-relationships' 
                        ? 'text-blue-600 font-medium bg-blue-50' 
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Family and relationships
                  </button>
                  <button 
                    onClick={() => setActiveSection('details-about')}
                    className={`block w-full text-left px-3 py-2 rounded-md transition-colors ${
                      activeSection === 'details-about' 
                        ? 'text-blue-600 font-medium bg-blue-50' 
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Details about you
                  </button>
                  <button 
                    onClick={() => setActiveSection('life-events')}
                    className={`block w-full text-left px-3 py-2 rounded-md transition-colors ${
                      activeSection === 'life-events' 
                        ? 'text-blue-600 font-medium bg-blue-50' 
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Life events
                  </button>
                </nav>
              </div>
            </div>

            {/* Right Content - Main Content Area */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-lg shadow-sm p-6">

                {/* Overview Section */}
                {activeSection === 'overview' && (
                  <div className="space-y-6">
                    {/* Work Section */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <FaBriefcase className="text-gray-500 mr-3" />
                        <div>
                          <div className="text-gray-700 font-medium">Software Developer at Clutchit.com.au</div>
                          <div className="text-gray-500 text-sm">Past: Quadrion Technologies</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200">
                          <FaGlobe className="text-gray-600 text-sm" />
                        </button>
                        <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200">
                          <FaEllipsisH className="text-gray-600 text-sm" />
                        </button>
                      </div>
                    </div>

                    {/* Education Section */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <FaGraduationCap className="text-gray-500 mr-3" />
                        <div className="text-gray-700 font-medium">Studied at University of Chittagong</div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200">
                          <FaGlobe className="text-gray-600 text-sm" />
                        </button>
                        <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200">
                          <FaEllipsisH className="text-gray-600 text-sm" />
                        </button>
                      </div>
                    </div>

                    {/* Current City */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <FaHome className="text-gray-500 mr-3" />
                        <div className="text-gray-700 font-medium">Lives in {profile?.client?.currentstate?.name}</div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200">
                          <FaGlobe className="text-gray-600 text-sm" />
                        </button>
                        <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200">
                          <FaEllipsisH className="text-gray-600 text-sm" />
                        </button>
                      </div>
                    </div>

                    {/* Hometown */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <FaMapMarkerAlt className="text-gray-500 mr-3" />
                        <div className="text-gray-700 font-medium">From Chittagong</div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200">
                          <FaGlobe className="text-gray-600 text-sm" />
                        </button>
                        <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200">
                          <FaEllipsisH className="text-gray-600 text-sm" />
                        </button>
                      </div>
                    </div>

                    {/* Relationship Status */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <FaHeart className="text-gray-500 mr-3" />
                        <div className="text-gray-700 font-medium">{profile?.client?.marital_status_name}</div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200">
                          <FaUsers className="text-gray-600 text-sm" />
                        </button>
                        <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200">
                          <FaEdit className="text-gray-600 text-sm" />
                        </button>
                      </div>
                    </div>

                    {/* Contact Info */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <LuPhone className="text-gray-500 mr-3" />
                        <div>
                          <div className="text-gray-700 font-medium">{profile?.client?.contact_no}</div>
                          <div className="text-gray-500 text-sm">Mobile</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200">
                          <FaLock className="text-gray-600 text-sm" />
                        </button>
                        <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200">
                          <FaEdit className="text-gray-600 text-sm" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Work and Education Section */}
                {activeSection === 'work-education' && (
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-lg font-semibold mb-4">Work</h4>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <FaBriefcase className="text-gray-500 mr-3" />
                            <div>
                              <div className="text-gray-700 font-medium">Software Developer</div>
                              <div className="text-gray-500 text-sm">Clutchit.com.au</div>
                              <div className="text-gray-400 text-xs">2023 - Present</div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200">
                              <FaGlobe className="text-gray-600 text-sm" />
                            </button>
                            <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200">
                              <FaEdit className="text-gray-600 text-sm" />
                            </button>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <FaBriefcase className="text-gray-500 mr-3" />
                            <div>
                              <div className="text-gray-700 font-medium">Frontend Developer</div>
                              <div className="text-gray-500 text-sm">Quadrion Technologies</div>
                              <div className="text-gray-400 text-xs">2021 - 2023</div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200">
                              <FaGlobe className="text-gray-600 text-sm" />
                            </button>
                            <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200">
                              <FaEdit className="text-gray-600 text-sm" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold mb-4">Education</h4>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <FaGraduationCap className="text-gray-500 mr-3" />
                            <div>
                              <div className="text-gray-700 font-medium">Bachelor of Computer Science</div>
                              <div className="text-gray-500 text-sm">University of Chittagong</div>
                              <div className="text-gray-400 text-xs">2017 - 2021</div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200">
                              <FaGlobe className="text-gray-600 text-sm" />
                            </button>
                            <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200">
                              <FaEdit className="text-gray-600 text-sm" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Places Lived Section */}
                {activeSection === 'places-lived' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <FaHome className="text-gray-500 mr-3" />
                        <div>
                          <div className="text-gray-700 font-medium">Current City</div>
                          <div className="text-gray-500 text-sm">Chittagong, Bangladesh</div>
                          <div className="text-gray-400 text-xs">2020 - Present</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200">
                          <FaGlobe className="text-gray-600 text-sm" />
                        </button>
                        <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200">
                          <FaEdit className="text-gray-600 text-sm" />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <FaMapMarkerAlt className="text-gray-500 mr-3" />
                        <div>
                          <div className="text-gray-700 font-medium">Hometown</div>
                          <div className="text-gray-500 text-sm">Chittagong, Bangladesh</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200">
                          <FaGlobe className="text-gray-600 text-sm" />
                        </button>
                        <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200">
                          <FaEdit className="text-gray-600 text-sm" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Contact and Basic Info Section */}
                {activeSection === 'contact-info' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <LuPhone className="text-gray-500 mr-3" />
                        <div>
                          <div className="text-gray-700 font-medium">Mobile</div>
                          <div className="text-gray-500 text-sm">01829-521200</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200">
                          <FaLock className="text-gray-600 text-sm" />
                        </button>
                        <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200">
                          <FaEdit className="text-gray-600 text-sm" />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <FaEnvelope className="text-gray-500 mr-3" />
                        <div>
                          <div className="text-gray-700 font-medium">Email</div>
                          <div className="text-gray-500 text-sm">borhanidb@gmail.com</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200">
                          <FaLock className="text-gray-600 text-sm" />
                        </button>
                        <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200">
                          <FaEdit className="text-gray-600 text-sm" />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <FaBirthdayCake className="text-gray-500 mr-3" />
                        <div>
                          <div className="text-gray-700 font-medium">Date of Birth</div>
                          <div className="text-gray-500 text-sm">September 20, 1996</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200">
                          <FaGlobe className="text-gray-600 text-sm" />
                        </button>
                        <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200">
                          <FaEdit className="text-gray-600 text-sm" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Privacy and Legal Info Section */}
                {activeSection === 'privacy-legal' && (
                  <div className="space-y-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Privacy Settings</h4>
                      <p className="text-gray-600 text-sm">Manage who can see your profile information and posts.</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Legal Information</h4>
                      <p className="text-gray-600 text-sm">Terms of service, privacy policy, and data usage information.</p>
                    </div>
                  </div>
                )}

                {/* Profile Transparency Section */}
                {activeSection === 'profile-transparency' && (
                  <div className="space-y-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Profile Transparency</h4>
                      <p className="text-gray-600 text-sm">Information about how your profile data is used and shared.</p>
                    </div>
                  </div>
                )}

                {/* Family and Relationships Section */}
                {activeSection === 'family-relationships' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <FaHeart className="text-gray-500 mr-3" />
                        <div>
                          <div className="text-gray-700 font-medium">Relationship Status</div>
                          <div className="text-gray-500 text-sm">Married since January 16, 2025</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200">
                          <FaUsers className="text-gray-600 text-sm" />
                        </button>
                        <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200">
                          <FaEdit className="text-gray-600 text-sm" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Details About You Section */}
                {activeSection === 'details-about' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <CiUser className="text-gray-500 mr-3" />
                        <div>
                          <div className="text-gray-700 font-medium">Blood Group</div>
                          <div className="text-gray-500 text-sm">A+</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200">
                          <FaLock className="text-gray-600 text-sm" />
                        </button>
                        <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200">
                          <FaEdit className="text-gray-600 text-sm" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Life Events Section */}
                {activeSection === 'life-events' && (
                  <div className="space-y-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Life Events</h4>
                      <p className="text-gray-600 text-sm">Share important moments and milestones in your life.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Post Modal */}
      {isPostModalOpen && <PostModal />}
    </FeedLayout>
  );
};

export default AboutContent;

